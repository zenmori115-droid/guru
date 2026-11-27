import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { GuideTab } from './components/GuideTab';
import { Header } from './components/Header';
import { HistoryTab } from './components/HistoryTab';
import { ReportForm } from './components/ReportForm';
import { ResultPanel } from './components/ResultPanel';
import { DEFAULT_FORM_DATA, DEFAULT_SETTINGS } from './constants';
import { streamGeneratedReport } from './services/reportApi';
import type {
  PresetExample,
  ReportFormData,
  ReportHistoryItem,
  ReportSettings,
  StudentProfile,
  TabId,
  ToneId,
} from './types';
import { readStorage, writeStorage } from './utils/helpers';

const STORAGE_KEYS = {
  theme: 'laporku_theme',
  settings: 'laporku_settings_v1',
  history: 'laporku_history_v1',
  profiles: 'laporku_profiles_v1',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('buat');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.theme) !== 'light';
    } catch {
      return true;
    }
  });

  const [form, setForm] = useState<ReportFormData>(DEFAULT_FORM_DATA);
  const [settings, setSettings] = useState<ReportSettings>(() =>
    readStorage<ReportSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  );
  const [history, setHistory] = useState<ReportHistoryItem[]>(() =>
    readStorage<ReportHistoryItem[]>(STORAGE_KEYS.history, [])
  );
  const [profiles, setProfiles] = useState<StudentProfile[]>(() =>
    readStorage<StudentProfile[]>(STORAGE_KEYS.profiles, [])
  );

  const [errors, setErrors] = useState<{ studentName?: string; latestScore?: string }>({});
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const resultSectionRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDark]);

  // Persist settings, history, and student profiles to localStorage
  useEffect(() => {
    writeStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.history, history);
  }, [history]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.profiles, profiles);
  }, [profiles]);

  // Cleanup active request on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2600);
  }

  function handleChangeForm<K extends keyof ReportFormData>(
    key: K,
    value: ReportFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'studentName' && errors.studentName) {
      setErrors((prev) => ({ ...prev, studentName: undefined }));
    }
    if (key === 'latestScore' && errors.latestScore) {
      setErrors((prev) => ({ ...prev, latestScore: undefined }));
    }
  }

  function handleToggleTag(tag: string) {
    setForm((prev) => {
      const exists = prev.behaviorTags.includes(tag);
      return {
        ...prev,
        behaviorTags: exists
          ? prev.behaviorTags.filter((t) => t !== tag)
          : [...prev.behaviorTags, tag],
      };
    });
  }

  function handleChangeSettings<K extends keyof ReportSettings>(
    key: K,
    value: ReportSettings[K]
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleApplyPreset(preset: PresetExample) {
    setForm((prev) => ({
      ...DEFAULT_FORM_DATA,
      whatsappPhone: prev.whatsappPhone,
      ...preset.form,
    }));
    setErrors({});
    setApiError(null);
    setActiveTab('buat');
    showToast(`Contoh "${preset.label}" dimuat ke formulir.`);
  }

  function handleSaveProfile() {
    const cleanName = form.studentName.trim();
    if (!cleanName) {
      setErrors((prev) => ({ ...prev, studentName: 'Isi nama siswa terlebih dahulu untuk menyimpan profil.' }));
      return;
    }

    const now = new Date().toISOString();
    setProfiles((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.studentName.toLowerCase() === cleanName.toLowerCase()
      );
      const updatedProfile: StudentProfile = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `prof_${Date.now()}`,
        studentName: cleanName,
        parentName: form.parentName.trim(),
        className: form.className.trim(),
        whatsappPhone: form.whatsappPhone.trim(),
        updatedAt: now,
      };
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = updatedProfile;
        return next;
      }
      return [updatedProfile, ...prev].slice(0, 50);
    });

    showToast(`Profil "${cleanName}" tersimpan di perangkat.`);
  }

  function handleSelectProfile(profile: StudentProfile) {
    setForm((prev) => ({
      ...prev,
      studentName: profile.studentName,
      parentName: profile.parentName,
      className: profile.className,
      whatsappPhone: profile.whatsappPhone,
    }));
    setErrors((prev) => ({ ...prev, studentName: undefined }));
    setActiveTab('buat');
    showToast(`Profil "${profile.studentName}" dimuat.`);
  }

  function handleDeleteProfile(id: string) {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    showToast('Profil siswa dihapus.');
  }

  function handleResetForm() {
    setForm(DEFAULT_FORM_DATA);
    setErrors({});
    setApiError(null);
    setGeneratedMessage('');
    setActiveHistoryId(null);
    showToast('Formulir dibersihkan.');
  }

  function validateForm(targetForm: ReportFormData): boolean {
    const nextErrors: { studentName?: string; latestScore?: string } = {};
    if (!targetForm.studentName.trim()) {
      nextErrors.studentName = 'Nama siswa wajib diisi agar pesan lebih personal.';
    }
    if (!targetForm.latestScore.trim()) {
      nextErrors.latestScore = 'Nilai terakhir wajib diisi (mis. 85 atau B+).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function runGenerate(options?: {
    overrideForm?: ReportFormData;
    isRegenerate?: boolean;
  }) {
    if (isLoading) return; // Prevent double-clicks

    const targetForm = options?.overrideForm ?? form;
    if (!validateForm(targetForm)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const prevMsg = generatedMessage;
    setIsLoading(true);
    setApiError(null);
    setGeneratedMessage('');

    // Scroll to result preview smoothly on smaller screens
    if (window.innerWidth < 1024 && resultSectionRef.current) {
      resultSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    try {
      const finalText = await streamGeneratedReport({
        form: targetForm,
        settings,
        isRegenerate: options?.isRegenerate,
        previousMessage: options?.isRegenerate ? prevMsg : undefined,
        signal: controller.signal,
        onChunk: (accumulated) => {
          setGeneratedMessage(accumulated);
        },
      });

      setGeneratedMessage(finalText);

      // Save to history in localStorage
      const newId = `rep_${Date.now()}`;
      const historyItem: ReportHistoryItem = {
        id: newId,
        studentName: targetForm.studentName.trim(),
        parentName: targetForm.parentName.trim(),
        className: targetForm.className.trim(),
        subject: targetForm.subject.trim(),
        reportType: targetForm.reportType,
        tone: targetForm.tone,
        message: finalText,
        whatsappPhone: targetForm.whatsappPhone.trim(),
        createdAt: new Date().toISOString(),
      };
      setActiveHistoryId(newId);
      setHistory((prev) => [historyItem, ...prev].slice(0, 60));
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'Kuota AI akun Anda sedang habis atau koneksi bermasalah. Coba lagi beberapa saat.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChangeMessage(nextMessage: string) {
    setGeneratedMessage(nextMessage);
    if (activeHistoryId) {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === activeHistoryId ? { ...item, message: nextMessage } : item
        )
      );
    }
  }

  function handleChangeToneAndRegenerate(newTone: ToneId) {
    const nextForm: ReportFormData = { ...form, tone: newTone };
    setForm(nextForm);
    void runGenerate({ overrideForm: nextForm, isRegenerate: true });
  }

  function handleLoadHistoryToEditor(item: ReportHistoryItem) {
    setForm((prev) => ({
      ...prev,
      studentName: item.studentName,
      parentName: item.parentName,
      className: item.className,
      subject: item.subject,
      reportType: item.reportType,
      tone: item.tone,
      whatsappPhone: item.whatsappPhone,
    }));
    setGeneratedMessage(item.message);
    setActiveHistoryId(item.id);
    setApiError(null);
    setActiveTab('buat');
    showToast(`Laporan ${item.studentName} dibuka kembali.`);
  }

  function handleDeleteHistory(id: string) {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeHistoryId === id) setActiveHistoryId(null);
    showToast('Laporan dihapus dari riwayat.');
  }

  function handleClearHistory() {
    setHistory([]);
    setActiveHistoryId(null);
    showToast('Semua riwayat berhasil dihapus.');
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-[#F4F8FF] via-[#EDF4FF] to-[#E6F0FF] text-[#0B1B3A] transition-colors duration-200 dark:from-[#050B1F] dark:via-[#071330] dark:to-[#0A1A3F] dark:text-[#EAF1FF]">
      {/* Subtle drifting blue aurora ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="aurora-layer-1 absolute -left-24 -top-28 h-[420px] w-[520px] rounded-full bg-[#2F6BFF]/14 blur-[110px] dark:bg-[#2F6BFF]/24" />
        <div className="aurora-layer-2 absolute -bottom-32 -right-24 h-[460px] w-[560px] rounded-full bg-[#3D8BFF]/12 blur-[120px] dark:bg-[#3D8BFF]/18" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[420px] -translate-x-1/2 rounded-full bg-[#7DB4FF]/8 blur-[130px] dark:bg-[#1E4FBF]/14" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          historyCount={history.length}
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
          {activeTab === 'buat' && (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <ReportForm
                  form={form}
                  settings={settings}
                  errors={errors}
                  isLoading={isLoading}
                  profiles={profiles}
                  onChangeForm={handleChangeForm}
                  onToggleTag={handleToggleTag}
                  onChangeSettings={handleChangeSettings}
                  onApplyPreset={handleApplyPreset}
                  onSelectProfile={handleSelectProfile}
                  onSaveProfile={handleSaveProfile}
                  onResetForm={handleResetForm}
                  onSubmit={() => void runGenerate()}
                />
              </div>

              <div ref={resultSectionRef} className="lg:col-span-5">
                <ResultPanel
                  form={form}
                  message={generatedMessage}
                  isLoading={isLoading}
                  error={apiError}
                  onChangeMessage={handleChangeMessage}
                  onChangePhone={(val) => handleChangeForm('whatsappPhone', val)}
                  onRegenerate={() => void runGenerate({ isRegenerate: true })}
                  onChangeToneAndRegenerate={handleChangeToneAndRegenerate}
                  onRetry={() => void runGenerate()}
                />
              </div>
            </div>
          )}

          {activeTab === 'riwayat' && (
            <div className="mx-auto max-w-4xl">
              <HistoryTab
                history={history}
                profiles={profiles}
                onDeleteHistory={handleDeleteHistory}
                onClearHistory={handleClearHistory}
                onLoadToEditor={handleLoadHistoryToEditor}
                onSelectProfile={handleSelectProfile}
                onDeleteProfile={handleDeleteProfile}
                onGoCreate={() => setActiveTab('buat')}
              />
            </div>
          )}

          {activeTab === 'panduan' && (
            <div className="mx-auto max-w-4xl">
              <GuideTab
                onTryPreset={handleApplyPreset}
                onGoCreate={() => setActiveTab('buat')}
              />
            </div>
          )}
        </main>

        {/* Quiet footer */}
        <footer className="mx-auto hidden w-full max-w-7xl px-6 pb-8 text-center text-xs text-[#5B729E] dark:text-[#7B95C5] lg:block">
          LaporKu Guru · Membantu komunikasi guru dan wali murid tetap jujur, hangat, dan sopan. Data tersimpan lokal di perangkat Anda.
        </footer>
      </div>

      {/* Mobile sticky bottom CTA ("Buat Laporan") on main tab only */}
      {activeTab === 'buat' && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#2F6BFF]/14 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-[#3D8BFF]/20 dark:bg-[#060F29]/90 lg:hidden">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => void runGenerate()}
            className={`btn-orange-glow flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF8A1F] to-[#FF9F43] px-5 py-3 text-sm font-bold text-white active:scale-[0.98] disabled:cursor-wait disabled:opacity-90 ${
              isLoading ? 'btn-orange-loading' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Menyusun Laporan...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Buat Laporan</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Subtle toast notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-[#3D8BFF]/35 bg-[#0B1B3D]/95 px-4 py-2.5 text-xs font-semibold text-[#EAF1FF] shadow-[0_12px_32px_rgba(3,8,24,0.55)] backdrop-blur-md lg:bottom-6"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
