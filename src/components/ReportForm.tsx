import { useState } from 'react';
import {
  AlertCircle,
  BookmarkPlus,
  Briefcase,
  Check,
  ChevronDown,
  Heart,
  HeartHandshake,
  RotateCcw,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  Zap,
} from 'lucide-react';
import {
  BEHAVIOR_TAGS,
  PRESET_EXAMPLES,
  REPORT_TYPES,
  TONE_OPTIONS,
} from '../constants';
import type {
  GreetingStyle,
  MessageLength,
  PresetExample,
  ReportFormData,
  ReportSettings,
  StudentProfile,
  ToneId,
} from '../types';
import { getScoreDelta } from '../utils/helpers';

interface ReportFormProps {
  form: ReportFormData;
  settings: ReportSettings;
  errors: { studentName?: string; latestScore?: string };
  isLoading: boolean;
  profiles: StudentProfile[];
  onChangeForm: <K extends keyof ReportFormData>(key: K, value: ReportFormData[K]) => void;
  onToggleTag: (tag: string) => void;
  onChangeSettings: <K extends keyof ReportSettings>(key: K, value: ReportSettings[K]) => void;
  onApplyPreset: (preset: PresetExample) => void;
  onSelectProfile: (profile: StudentProfile) => void;
  onSaveProfile: () => void;
  onResetForm: () => void;
  onSubmit: () => void;
}

export function getToneIcon(toneId: ToneId) {
  switch (toneId) {
    case 'hangat':
      return HeartHandshake;
    case 'formal':
      return Briefcase;
    case 'tegas':
      return ShieldCheck;
    case 'empatik':
      return Heart;
    case 'singkat':
      return Zap;
  }
}

export function ReportForm({
  form,
  settings,
  errors,
  isLoading,
  profiles,
  onChangeForm,
  onToggleTag,
  onChangeSettings,
  onApplyPreset,
  onSelectProfile,
  onSaveProfile,
  onResetForm,
  onSubmit,
}: ReportFormProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const scoreDelta = getScoreDelta(form.latestScore, form.previousScore);

  const inputBase =
    'w-full rounded-2xl border bg-white/90 px-4 py-3 text-sm text-[#0B1B3A] placeholder-[#6B82AC] transition-all duration-200 focus:border-[#3D8BFF] focus:outline-none focus:ring-4 focus:ring-[#2F6BFF]/20 dark:bg-[#07122D]/85 dark:text-[#EAF1FF] dark:placeholder-[#6B84B2]';

  const inputNormal =
    'border-[#2F6BFF]/18 hover:border-[#2F6BFF]/35 dark:border-[#3D8BFF]/22 dark:hover:border-[#3D8BFF]/45';
  const inputError =
    'border-rose-500/80 ring-2 ring-rose-500/20 dark:border-rose-400/80';

  const lengthLabels: Record<MessageLength, string> = {
    singkat: 'Singkat',
    sedang: 'Sedang',
    lengkap: 'Lengkap',
  };

  const greetingLabels: Record<GreetingStyle, string> = {
    assalamualaikum: 'Assalamualaikum',
    selamat: 'Selamat pagi/siang/sore',
    netral: 'Netral',
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
      className="space-y-6"
    >
      {/* Quick-fill examples strip */}
      <section className="rounded-3xl border border-[#2F6BFF]/16 bg-white/85 p-5 shadow-[0_12px_36px_rgba(20,52,130,0.06)] backdrop-blur-xl dark:border-[#3D8BFF]/20 dark:bg-[#0B1736]/75 dark:shadow-[0_14px_42px_rgba(2,7,22,0.55)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
              Coba contoh siap pakai
            </h2>
            <p className="text-xs text-[#4A608A] dark:text-[#9DB2D9]">
              Isi formulir otomatis untuk melihat cara kerja LaporKu Guru.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetForm}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#4A608A] transition-colors hover:bg-[#2F6BFF]/10 hover:text-[#2F6BFF] dark:text-[#9DB2D9] dark:hover:bg-white/6 dark:hover:text-[#EAF1FF]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Bersihkan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {PRESET_EXAMPLES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="group flex min-h-[56px] flex-col items-start justify-center rounded-2xl border border-[#2F6BFF]/16 bg-[#F4F8FF]/90 px-3.5 py-2.5 text-left transition-all duration-200 hover:border-[#FF8A1F]/60 hover:bg-[#FFF6EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A1F] dark:border-[#3D8BFF]/20 dark:bg-[#081330]/80 dark:hover:border-[#FF8A1F]/60 dark:hover:bg-[#171F3A]"
            >
              <span className="text-xs font-bold text-[#0B1B3A] group-hover:text-[#D96608] dark:text-[#EAF1FF] dark:group-hover:text-[#FF9F43]">
                {preset.label}
              </span>
              <span className="mt-0.5 line-clamp-1 text-[11px] text-[#4A608A] dark:text-[#9DB2D9]">
                {preset.shortDesc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main glass form card */}
      <section className="rounded-3xl border border-[#2F6BFF]/16 bg-white/88 p-5 shadow-[0_14px_40px_rgba(20,52,130,0.07)] backdrop-blur-xl dark:border-[#3D8BFF]/20 dark:bg-[#0B1736]/75 dark:shadow-[0_16px_46px_rgba(2,7,22,0.58)] sm:p-7">
        {/* Saved student profile picker */}
        {profiles.length > 0 && (
          <div className="mb-6 flex flex-col gap-2 border-b border-[#2F6BFF]/12 pb-5 dark:border-[#3D8BFF]/15 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2A4270] dark:text-[#7DB4FF]">
              <UserCheck className="h-4 w-4 shrink-0" />
              <span>Pilih profil siswa tersimpan ({profiles.length})</span>
            </div>
            <select
              aria-label="Pilih profil siswa tersimpan"
              defaultValue=""
              onChange={(e) => {
                const found = profiles.find((p) => p.id === e.target.value);
                if (found) onSelectProfile(found);
                e.target.value = '';
              }}
              className="min-h-[42px] rounded-xl border border-[#2F6BFF]/22 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1B3A] focus:border-[#3D8BFF] focus:outline-none focus:ring-4 focus:ring-[#2F6BFF]/20 dark:border-[#3D8BFF]/25 dark:bg-[#07122D] dark:text-[#EAF1FF] sm:max-w-[260px]"
            >
              <option value="" disabled>
                — Pilih siswa untuk isi cepat —
              </option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.studentName}
                  {p.className ? ` · ${p.className}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Section 1: Data Siswa & Nilai */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
                1. Data Siswa & Nilai
              </h2>
              <p className="text-xs text-[#4A608A] dark:text-[#9DB2D9]">
                Kolom bertanda <span className="font-semibold text-[#FF8A1F]">*</span> wajib diisi.
              </p>
            </div>
            <button
              type="button"
              onClick={onSaveProfile}
              disabled={!form.studentName.trim()}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#2F6BFF]/22 bg-[#2F6BFF]/8 px-3 py-1.5 text-xs font-semibold text-[#2F6BFF] transition-all hover:bg-[#2F6BFF]/16 disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#3D8BFF]/28 dark:bg-[#2F6BFF]/16 dark:text-[#7DB4FF] dark:hover:bg-[#2F6BFF]/26"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">Simpan profil siswa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Nama siswa */}
            <div>
              <label
                htmlFor="studentName"
                className="mb-1.5 block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]"
              >
                Nama siswa <span className="text-[#FF8A1F]">*</span>
              </label>
              <input
                id="studentName"
                type="text"
                value={form.studentName}
                onChange={(e) => onChangeForm('studentName', e.target.value)}
                placeholder="Mis. Raka Pratama"
                aria-invalid={Boolean(errors.studentName)}
                className={`${inputBase} ${errors.studentName ? inputError : inputNormal}`}
              />
              {errors.studentName && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.studentName}</span>
                </p>
              )}
            </div>

            {/* Nama wali murid */}
            <div>
              <label
                htmlFor="parentName"
                className="mb-1.5 block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]"
              >
                Nama wali murid <span className="font-normal text-[#6B82AC] dark:text-[#7C95C4]">(opsional)</span>
              </label>
              <input
                id="parentName"
                type="text"
                value={form.parentName}
                onChange={(e) => onChangeForm('parentName', e.target.value)}
                placeholder="Mis. Ibu Dewi / Bapak Hendra"
                className={`${inputBase} ${inputNormal}`}
              />
            </div>

            {/* Kelas / jenjang */}
            <div>
              <label
                htmlFor="className"
                className="mb-1.5 block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]"
              >
                Kelas / jenjang <span className="font-normal text-[#6B82AC] dark:text-[#7C95C4]">(opsional)</span>
              </label>
              <input
                id="className"
                type="text"
                value={form.className}
                onChange={(e) => onChangeForm('className', e.target.value)}
                placeholder="Mis. Kelas 4 SD atau Les Matematika"
                className={`${inputBase} ${inputNormal}`}
              />
            </div>

            {/* Mata pelajaran */}
            <div>
              <label
                htmlFor="subject"
                className="mb-1.5 block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]"
              >
                Mata pelajaran <span className="font-normal text-[#6B82AC] dark:text-[#7C95C4]">(opsional)</span>
              </label>
              <input
                id="subject"
                type="text"
                value={form.subject}
                onChange={(e) => onChangeForm('subject', e.target.value)}
                placeholder="Mis. Matematika, Bahasa Indonesia"
                className={`${inputBase} ${inputNormal}`}
              />
            </div>

            {/* Nilai terakhir */}
            <div>
              <label
                htmlFor="latestScore"
                className="mb-1.5 block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]"
              >
                Nilai terakhir <span className="text-[#FF8A1F]">*</span>
              </label>
              <input
                id="latestScore"
                type="text"
                inputMode="decimal"
                value={form.latestScore}
                onChange={(e) => onChangeForm('latestScore', e.target.value)}
                placeholder="Mis. 85 atau 62/100 atau B+"
                aria-invalid={Boolean(errors.latestScore)}
                className={`${inputBase} font-mono tabular-nums ${errors.latestScore ? inputError : inputNormal}`}
              />
              {errors.latestScore && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.latestScore}</span>
                </p>
              )}
            </div>

            {/* Nilai sebelumnya */}
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="previousScore"
                  className="block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]"
                >
                  Nilai sebelumnya <span className="font-normal text-[#6B82AC] dark:text-[#7C95C4]">(opsional)</span>
                </label>
                {scoreDelta.type && (
                  <span
                    className={`font-mono text-[11px] font-semibold tabular-nums ${
                      scoreDelta.type === 'up'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : scoreDelta.type === 'down'
                          ? 'text-amber-600 dark:text-[#FF9F43]'
                          : 'text-[#4A608A] dark:text-[#7DB4FF]'
                    }`}
                  >
                    {scoreDelta.label}
                  </span>
                )}
              </div>
              <input
                id="previousScore"
                type="text"
                inputMode="decimal"
                value={form.previousScore}
                onChange={(e) => onChangeForm('previousScore', e.target.value)}
                placeholder="Untuk bandingkan naik/turun (mis. 78)"
                className={`${inputBase} font-mono tabular-nums ${inputNormal}`}
              />
            </div>
          </div>
        </div>

        {/* Hairline divider */}
        <hr className="my-6 border-[#2F6BFF]/12 dark:border-[#3D8BFF]/15" />

        {/* Section 2: Jenis Laporan */}
        <div>
          <h2 className="mb-3 text-base font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
            2. Jenis Laporan
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {REPORT_TYPES.map((type) => {
              const active = form.reportType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChangeForm('reportType', type)}
                  aria-pressed={active}
                  className={`flex min-h-[44px] items-center justify-between gap-2 rounded-2xl border px-4 py-2.5 text-left text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A1F] ${
                    active
                      ? 'border-[#FF8A1F] bg-[#FF8A1F]/12 text-[#C45500] shadow-[0_0_16px_rgba(255,138,31,0.2)] dark:border-[#FF8A1F] dark:bg-[#FF8A1F]/16 dark:text-[#FFD2A6]'
                      : 'border-[#2F6BFF]/16 bg-[#F6F9FF] text-[#2A4270] hover:border-[#3D8BFF]/45 hover:bg-white dark:border-[#3D8BFF]/18 dark:bg-[#07122D]/70 dark:text-[#B4C7E8] dark:hover:border-[#3D8BFF]/40 dark:hover:text-[#EAF1FF]'
                  }`}
                >
                  <span>{type}</span>
                  {active && <Check className="h-4 w-4 shrink-0 text-[#FF8A1F]" />}
                </button>
              );
            })}
          </div>

          {/* Conditional Parent Question field */}
          {form.reportType === 'Jawaban atas pertanyaan wali murid' && (
            <div className="mt-4 rounded-2xl border border-[#3D8BFF]/30 bg-[#2F6BFF]/6 p-4 dark:border-[#3D8BFF]/30 dark:bg-[#10224E]/55">
              <label
                htmlFor="parentQuestion"
                className="mb-1.5 block text-xs font-bold text-[#1B3A7A] dark:text-[#7DB4FF]"
              >
                Tempel pertanyaan / pesan dari wali murid
              </label>
              <textarea
                id="parentQuestion"
                rows={3}
                value={form.parentQuestion}
                onChange={(e) => onChangeForm('parentQuestion', e.target.value)}
                placeholder="Contoh: Assalamualaikum Bu, mau tanya kemarin nilai ulangan Raka berapa ya? Soalnya di rumah dia bilang agak kesulitan di materi pecahan."
                className={`${inputBase} ${inputNormal} resize-y`}
              />
            </div>
          )}
        </div>

        {/* Hairline divider */}
        <hr className="my-6 border-[#2F6BFF]/12 dark:border-[#3D8BFF]/15" />

        {/* Section 3: Tag Perilaku & Catatan */}
        <div>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
              3. Catatan Perilaku & Perkembangan
            </h2>
            {form.behaviorTags.length > 0 && (
              <span className="font-mono text-xs font-medium tabular-nums text-[#D96608] dark:text-[#FF9F43]">
                {form.behaviorTags.length} tag dipilih
              </span>
            )}
          </div>

          <p className="mb-2.5 text-xs text-[#4A608A] dark:text-[#9DB2D9]">
            Klik tag cepat untuk mempercepat input (bisa pilih lebih dari satu):
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {BEHAVIOR_TAGS.map((tag) => {
              const selected = form.behaviorTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  aria-pressed={selected}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A1F] ${
                    selected
                      ? 'border-[#FF8A1F] bg-[#FF8A1F]/14 text-[#C45500] shadow-[0_0_14px_rgba(255,138,31,0.22)] dark:border-[#FF8A1F] dark:bg-[#FF8A1F]/18 dark:text-[#FFD2A6]'
                      : 'border-[#2F6BFF]/18 bg-[#F6F9FF] text-[#355080] hover:border-[#3D8BFF]/50 hover:text-[#2F6BFF] dark:border-[#3D8BFF]/20 dark:bg-[#07122D]/75 dark:text-[#9DB2D9] dark:hover:border-[#7DB4FF]/45 dark:hover:text-[#EAF1FF]'
                  }`}
                >
                  {selected && <Check className="h-3.5 w-3.5 shrink-0 text-[#FF8A1F]" />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label
              htmlFor="notes"
              className="mb-1.5 block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]"
            >
              Catatan tambahan guru <span className="font-normal text-[#6B82AC] dark:text-[#7C95C4]">(digabung dengan tag di atas)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => onChangeForm('notes', e.target.value)}
              placeholder="Contoh: sering mengobrol saat pelajaran, tapi aktif bertanya, tugas sering terlambat"
              className={`${inputBase} ${inputNormal} resize-y`}
            />
          </div>
        </div>

        {/* Hairline divider */}
        <hr className="my-6 border-[#2F6BFF]/12 dark:border-[#3D8BFF]/15" />

        {/* Section 4: Pilihan Nada Pesan (Cards, NOT dropdown) */}
        <div>
          <div className="mb-3">
            <h2 className="text-base font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
              4. Pilih Nada Pesan
            </h2>
            <p className="text-xs text-[#4A608A] dark:text-[#9DB2D9]">
              Sesuaikan gaya penyampaian dengan kondisi siswa dan karakter wali murid.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TONE_OPTIONS.map((tone, index) => {
              const Icon = getToneIcon(tone.id);
              const selected = form.tone === tone.id;
              const isLastOdd = index === TONE_OPTIONS.length - 1;

              return (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => onChangeForm('tone', tone.id)}
                  aria-pressed={selected}
                  className={`group flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A1F] ${
                    isLastOdd ? 'sm:col-span-2' : ''
                  } ${
                    selected
                      ? 'border-[#FF8A1F] bg-gradient-to-br from-[#FFF6EE] to-[#FFF0E2] shadow-[0_0_24px_rgba(255,138,31,0.22)] dark:border-[#FF8A1F] dark:bg-gradient-to-br dark:from-[#211927] dark:to-[#101C3D] dark:shadow-[0_0_26px_rgba(255,138,31,0.28)]'
                      : 'border-[#2F6BFF]/16 bg-[#F7FAFF] hover:border-[#3D8BFF]/45 hover:bg-white dark:border-[#3D8BFF]/20 dark:bg-[#07122D]/75 dark:hover:border-[#3D8BFF]/48 dark:hover:bg-[#0D1E47]/80'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      selected
                        ? 'bg-[#FF8A1F] text-white shadow-[0_0_16px_rgba(255,138,31,0.45)]'
                        : 'bg-[#2F6BFF]/12 text-[#2F6BFF] dark:bg-[#2F6BFF]/22 dark:text-[#7DB4FF]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-bold ${
                          selected
                            ? 'text-[#B84C00] dark:text-[#FFD2A6]'
                            : 'text-[#0B1B3A] dark:text-[#EAF1FF]'
                        }`}
                      >
                        {tone.name}
                      </span>
                      {selected && (
                        <Check className="h-4 w-4 shrink-0 text-[#FF8A1F]" />
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#4A608A] dark:text-[#9DB2D9]">
                      {tone.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hairline divider */}
        <hr className="my-6 border-[#2F6BFF]/12 dark:border-[#3D8BFF]/15" />

        {/* Section 5: Collapsible Pengaturan Tambahan */}
        <div>
          <button
            type="button"
            onClick={() => setSettingsOpen((prev) => !prev)}
            aria-expanded={settingsOpen}
            className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-2xl border border-[#2F6BFF]/16 bg-[#F5F9FF] px-4 py-3 text-left transition-colors hover:border-[#3D8BFF]/40 dark:border-[#3D8BFF]/20 dark:bg-[#07122D]/75 dark:hover:border-[#3D8BFF]/45"
          >
            <div className="flex items-center gap-3 min-w-0">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#2F6BFF] dark:text-[#7DB4FF]" />
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
                  Pengaturan Tambahan
                </div>
                <div className="truncate text-xs text-[#4A608A] dark:text-[#9DB2D9]">
                  {lengthLabels[settings.length]} · {greetingLabels[settings.greetingStyle]} ·{' '}
                  {settings.includeEmoji ? 'Dengan emoji' : 'Tanpa emoji'}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#4A608A] transition-transform duration-200 dark:text-[#9DB2D9] ${
                settingsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {settingsOpen && (
            <div className="mt-4 space-y-5 px-1 pt-1">
              {/* Panjang pesan */}
              <div>
                <span className="mb-2 block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]">
                  Panjang pesan
                </span>
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#2F6BFF]/15 bg-[#F2F7FF] p-1 dark:border-[#3D8BFF]/18 dark:bg-[#061028]">
                  {(['singkat', 'sedang', 'lengkap'] as MessageLength[]).map((len) => {
                    const active = settings.length === len;
                    return (
                      <button
                        key={len}
                        type="button"
                        onClick={() => onChangeSettings('length', len)}
                        className={`min-h-[40px] rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                          active
                            ? 'bg-[#2F6BFF] text-white shadow-[0_4px_14px_rgba(47,107,255,0.35)]'
                            : 'text-[#4A608A] hover:text-[#0B1B3A] dark:text-[#9DB2D9] dark:hover:text-[#EAF1FF]'
                        }`}
                      >
                        {lengthLabels[len]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gaya sapaan */}
              <div>
                <span className="mb-2 block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]">
                  Gaya sapaan
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {(['assalamualaikum', 'selamat', 'netral'] as GreetingStyle[]).map((style) => {
                    const active = settings.greetingStyle === style;
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => onChangeSettings('greetingStyle', style)}
                        className={`min-h-[42px] rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                          active
                            ? 'border-[#3D8BFF] bg-[#2F6BFF]/14 text-[#2F6BFF] dark:bg-[#2F6BFF]/25 dark:text-[#EAF1FF]'
                            : 'border-[#2F6BFF]/16 bg-white text-[#4A608A] hover:border-[#3D8BFF]/40 dark:border-[#3D8BFF]/18 dark:bg-[#07122D] dark:text-[#9DB2D9]'
                        }`}
                      >
                        {greetingLabels[style]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nama & sebutan guru */}
              <div>
                <label
                  htmlFor="teacherSignature"
                  className="mb-1.5 block text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]"
                >
                  Nama & sebutan guru (untuk tanda tangan)
                </label>
                <input
                  id="teacherSignature"
                  type="text"
                  value={settings.teacherSignature}
                  onChange={(e) => onChangeSettings('teacherSignature', e.target.value)}
                  placeholder="Mis. Bu Rina, Wali Kelas 4A"
                  className={`${inputBase} ${inputNormal}`}
                />
                <p className="mt-1 text-[11px] text-[#5B729E] dark:text-[#7E96C4]">
                  Tersimpan otomatis di perangkat Anda untuk laporan berikutnya.
                </p>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.includeHomeTips}
                  onClick={() => onChangeSettings('includeHomeTips', !settings.includeHomeTips)}
                  className="flex min-h-[54px] items-center justify-between gap-3 rounded-2xl border border-[#2F6BFF]/16 bg-[#F7FAFF] px-4 py-3 text-left transition-colors hover:border-[#3D8BFF]/40 dark:border-[#3D8BFF]/20 dark:bg-[#07122D]/75"
                >
                  <span className="text-xs font-semibold text-[#1B2F56] dark:text-[#EAF1FF]">
                    Sertakan saran tindak lanjut di rumah
                  </span>
                  <span
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      settings.includeHomeTips ? 'bg-[#FF8A1F]' : 'bg-[#CBD8F0] dark:bg-[#1E3363]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        settings.includeHomeTips ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.includeEmoji}
                  onClick={() => onChangeSettings('includeEmoji', !settings.includeEmoji)}
                  className="flex min-h-[54px] items-center justify-between gap-3 rounded-2xl border border-[#2F6BFF]/16 bg-[#F7FAFF] px-4 py-3 text-left transition-colors hover:border-[#3D8BFF]/40 dark:border-[#3D8BFF]/20 dark:bg-[#07122D]/75"
                >
                  <span className="text-xs font-semibold text-[#1B2F56] dark:text-[#EAF1FF]">
                    Sertakan emoji secukupnya
                  </span>
                  <span
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      settings.includeEmoji ? 'bg-[#FF8A1F]' : 'bg-[#CBD8F0] dark:bg-[#1E3363]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        settings.includeEmoji ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Primary Submit CTA */}
        <div className="mt-7 hidden lg:block">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-orange-glow flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF8A1F] to-[#FF9F43] px-6 py-3.5 text-base font-bold text-white active:scale-[0.99] disabled:cursor-wait disabled:opacity-90 ${
              isLoading ? 'btn-orange-loading' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Sparkles className="h-5 w-5 animate-spin" />
                <span>Sedang Menyusun Laporan...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Buat Laporan</span>
              </>
            )}
          </button>
        </div>
      </section>
    </form>
  );
}
