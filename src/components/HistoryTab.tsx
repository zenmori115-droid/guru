import { useMemo, useState } from 'react';
import {
  Check,
  Clock,
  Copy,
  FileEdit,
  Search,
  Send,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { TONE_OPTIONS } from '../constants';
import type { ReportHistoryItem, StudentProfile } from '../types';
import {
  buildWhatsAppUrl,
  copyTextToClipboard,
  formatIndonesianDate,
} from '../utils/helpers';

interface HistoryTabProps {
  history: ReportHistoryItem[];
  profiles: StudentProfile[];
  onDeleteHistory: (id: string) => void;
  onClearHistory: () => void;
  onLoadToEditor: (item: ReportHistoryItem) => void;
  onSelectProfile: (profile: StudentProfile) => void;
  onDeleteProfile: (id: string) => void;
  onGoCreate: () => void;
}

export function HistoryTab({
  history,
  profiles,
  onDeleteHistory,
  onClearHistory,
  onLoadToEditor,
  onSelectProfile,
  onDeleteProfile,
  onGoCreate,
}: HistoryTabProps) {
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (item) =>
        item.studentName.toLowerCase().includes(q) ||
        item.parentName.toLowerCase().includes(q) ||
        item.className.toLowerCase().includes(q) ||
        item.reportType.toLowerCase().includes(q)
    );
  }, [history, query]);

  async function handleCopy(item: ReportHistoryItem) {
    const ok = await copyTextToClipboard(item.message);
    if (ok) {
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId((curr) => (curr === item.id ? null : curr)), 2000);
    }
  }

  return (
    <div className="space-y-6">
      {/* Saved Student Profiles Section */}
      <section className="rounded-3xl border border-[#2F6BFF]/16 bg-white/88 p-5 shadow-[0_12px_36px_rgba(20,52,130,0.06)] backdrop-blur-xl dark:border-[#3D8BFF]/20 dark:bg-[#0B1736]/75 dark:shadow-[0_14px_42px_rgba(2,7,22,0.55)] sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Users className="h-5 w-5 text-[#2F6BFF] dark:text-[#7DB4FF]" />
            <div>
              <h2 className="text-base font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
                Profil Siswa Tersimpan
              </h2>
              <p className="text-xs text-[#4A608A] dark:text-[#9DB2D9]">
                Klik nama siswa untuk mengisi otomatis nama, kelas, wali murid, dan nomor WhatsApp.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-semibold tabular-nums text-[#4A608A] dark:text-[#9DB2D9]">
            {profiles.length} profil
          </span>
        </div>

        {profiles.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#2F6BFF]/22 bg-[#F5F9FF] px-4 py-5 text-center text-xs text-[#4A608A] dark:border-[#3D8BFF]/24 dark:bg-[#07122D]/60 dark:text-[#9DB2D9]">
            Belum ada profil siswa tersimpan. Di tab <span className="font-semibold text-[#0B1B3A] dark:text-[#EAF1FF]">Buat Laporan</span>, isi nama siswa lalu klik tombol <span className="font-semibold text-[#2F6BFF] dark:text-[#7DB4FF]">Simpan profil siswa</span>.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#2F6BFF]/16 bg-[#F6FAFF] p-3.5 transition-colors hover:border-[#3D8BFF]/40 dark:border-[#3D8BFF]/18 dark:bg-[#07122D]/75 dark:hover:border-[#3D8BFF]/40"
              >
                <button
                  type="button"
                  onClick={() => onSelectProfile(profile)}
                  className="min-w-0 flex-1 text-left focus-visible:outline-none"
                >
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
                    <UserCheck className="h-4 w-4 shrink-0 text-[#FF8A1F]" />
                    <span className="truncate">{profile.studentName}</span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-[#4A608A] dark:text-[#9DB2D9]">
                    {[profile.className, profile.parentName].filter(Boolean).join(' · ') ||
                      'Klik untuk muat ke formulir'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteProfile(profile.id)}
                  aria-label={`Hapus profil ${profile.studentName}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#6B82AC] transition-colors hover:bg-rose-500/12 hover:text-rose-500 dark:text-[#7E96C4] dark:hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Report History Section */}
      <section className="rounded-3xl border border-[#2F6BFF]/16 bg-white/88 p-5 shadow-[0_12px_36px_rgba(20,52,130,0.06)] backdrop-blur-xl dark:border-[#3D8BFF]/20 dark:bg-[#0B1736]/75 dark:shadow-[0_14px_42px_rgba(2,7,22,0.55)] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
              Riwayat Laporan Tersimpan
            </h2>
            <p className="text-xs text-[#4A608A] dark:text-[#9DB2D9]">
              Semua data hanya tersimpan aman di perangkat Anda (browser ini).
            </p>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2">
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    Hapus semua?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="min-h-[36px] rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                  >
                    Ya, Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="min-h-[36px] rounded-xl border border-[#2F6BFF]/20 px-3 py-1.5 text-xs font-semibold text-[#4A608A] dark:border-[#3D8BFF]/25 dark:text-[#9DB2D9]"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-rose-500/25 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-500/10 dark:border-rose-400/25 dark:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus Semua</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Search input */}
        {history.length > 0 && (
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B82AC] dark:text-[#7E96C4]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari riwayat berdasarkan nama siswa, kelas, atau jenis laporan..."
              className="w-full rounded-2xl border border-[#2F6BFF]/18 bg-white/90 py-3 pl-11 pr-4 text-sm text-[#0B1B3A] placeholder-[#6B82AC] transition-all focus:border-[#3D8BFF] focus:outline-none focus:ring-4 focus:ring-[#2F6BFF]/20 dark:border-[#3D8BFF]/22 dark:bg-[#07122D]/85 dark:text-[#EAF1FF] dark:placeholder-[#6B84B2]"
            />
          </div>
        )}

        {/* Empty states */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2F6BFF]/22 bg-[#F5F9FF] px-6 py-12 text-center dark:border-[#3D8BFF]/24 dark:bg-[#07122D]/60">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F6BFF]/12 text-[#2F6BFF] dark:bg-[#2F6BFF]/22 dark:text-[#7DB4FF]">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
              Riwayat laporan masih kosong
            </p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#4A608A] dark:text-[#9DB2D9]">
              Setiap laporan yang Anda buat akan otomatis tersimpan di sini agar mudah disalin atau dikirim ulang kapan saja.
            </p>
            <button
              type="button"
              onClick={onGoCreate}
              className="btn-orange-glow mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF8A1F] to-[#FF9F43] px-5 py-2.5 text-xs font-bold text-white"
            >
              <FileEdit className="h-4 w-4" />
              <span>Buat Laporan Pertama</span>
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="rounded-2xl border border-[#2F6BFF]/15 bg-[#F5F9FF] px-6 py-10 text-center dark:border-[#3D8BFF]/20 dark:bg-[#07122D]/60">
            <p className="text-sm font-semibold text-[#0B1B3A] dark:text-[#EAF1FF]">
              Tidak ditemukan laporan untuk &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-xs text-[#4A608A] dark:text-[#9DB2D9]">
              Coba kata kunci nama siswa lainnya.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#2F6BFF]/12 dark:divide-[#3D8BFF]/15">
            {filteredHistory.map((item) => {
              const toneName = TONE_OPTIONS.find((t) => t.id === item.tone)?.name ?? item.tone;
              const waUrl = buildWhatsAppUrl(item.message, item.whatsappPhone);
              const isCopied = copiedId === item.id;

              return (
                <article key={item.id} className="py-5 first:pt-1 last:pb-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
                        {item.studentName}
                        {item.className ? (
                          <span className="font-medium text-[#4A608A] dark:text-[#9DB2D9]">
                            {' '}
                            · {item.className}
                          </span>
                        ) : null}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#4A608A] dark:text-[#9DB2D9]">
                        <span className="font-semibold text-[#D96608] dark:text-[#FF9F43]">
                          {item.reportType}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{toneName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {formatIndonesianDate(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(item)}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#2F6BFF]/18 bg-[#F4F8FF] px-3 py-1.5 text-xs font-semibold text-[#1B3A7A] whitespace-nowrap transition-colors hover:border-[#3D8BFF]/50 dark:border-[#3D8BFF]/22 dark:bg-[#081330] dark:text-[#CFE0FF]"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-[#3D8BFF]" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#2F6BFF] px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#3D8BFF]"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Kirim Ulang</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => onLoadToEditor(item)}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#2F6BFF]/18 px-3 py-1.5 text-xs font-semibold text-[#4A608A] whitespace-nowrap transition-colors hover:border-[#FF8A1F]/50 hover:text-[#D96608] dark:border-[#3D8BFF]/22 dark:text-[#9DB2D9] dark:hover:text-[#FF9F43]"
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                        <span>Buka</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteHistory(item.id)}
                        aria-label={`Hapus laporan ${item.studentName}`}
                        className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-transparent text-[#6B82AC] transition-colors hover:border-rose-500/25 hover:bg-rose-500/10 hover:text-rose-500 dark:text-[#7E96C4] dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap rounded-2xl border border-[#2F6BFF]/12 bg-[#F6FAFF] p-4 text-xs leading-relaxed text-[#1B2F56] dark:border-[#3D8BFF]/16 dark:bg-[#07122D]/75 dark:text-[#D5E4FF]">
                    {item.message}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
