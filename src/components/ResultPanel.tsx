import { Fragment, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCheck,
  Copy,
  Edit3,
  Eye,
  MessageSquareText,
  Phone,
  RefreshCw,
  Send,
  Sliders,
} from 'lucide-react';
import { TONE_OPTIONS } from '../constants';
import type { ReportFormData, ToneId } from '../types';
import {
  buildWhatsAppUrl,
  copyTextToClipboard,
  countWordsAndChars,
  normalizeIndonesianPhone,
} from '../utils/helpers';
import { getToneIcon } from './ReportForm';

interface ResultPanelProps {
  form: ReportFormData;
  message: string;
  isLoading: boolean;
  error: string | null;
  onChangeMessage: (next: string) => void;
  onChangePhone: (next: string) => void;
  onRegenerate: () => void;
  onChangeToneAndRegenerate: (toneId: ToneId) => void;
  onRetry: () => void;
}

/**
 * Render simple WhatsApp *bold* formatting safely without raw HTML injection.
 */
function renderWhatsAppFormatted(text: string) {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*[^*\n]+\*)/g);
    return (
      <Fragment key={lineIdx}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return (
              <strong key={partIdx} className="font-bold text-[#06223C] dark:text-white">
                {part.slice(1, -1)}
              </strong>
            );
          }
          return <Fragment key={partIdx}>{part}</Fragment>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </Fragment>
    );
  });
}

export function ResultPanel({
  form,
  message,
  isLoading,
  error,
  onChangeMessage,
  onChangePhone,
  onRegenerate,
  onChangeToneAndRegenerate,
  onRetry,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [previewFormatted, setPreviewFormatted] = useState(false);
  const [tonePickerOpen, setTonePickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { words, chars } = countWordsAndChars(message);
  const normalizedPhone = normalizeIndonesianPhone(form.whatsappPhone);
  const waUrl = message.trim() ? buildWhatsAppUrl(message, form.whatsappPhone) : '#';
  const currentTone = TONE_OPTIONS.find((t) => t.id === form.tone);

  // Auto-resize editable textarea to fit generated content gracefully
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(220, Math.min(el.scrollHeight + 8, 520))}px`;
  }, [message, previewFormatted]);

  async function handleCopy() {
    if (!message.trim()) return;
    const ok = await copyTextToClipboard(message);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  const nowTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  return (
    <aside
      aria-label="Hasil pesan laporan"
      className="rounded-3xl border border-[#2F6BFF]/18 bg-white/88 p-5 shadow-[0_14px_40px_rgba(20,52,130,0.08)] backdrop-blur-xl dark:border-[#3D8BFF]/22 dark:bg-[#0B1736]/78 dark:shadow-[0_18px_50px_rgba(2,7,22,0.62)] sm:p-6 lg:sticky lg:top-24"
    >
      {/* Header row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
            Hasil Pesan WhatsApp
          </h2>
          <p className="truncate text-xs text-[#4A608A] dark:text-[#9DB2D9]">
            {form.studentName.trim()
              ? `${form.studentName.trim()} · ${currentTone?.name ?? ''}`
              : 'Siap disalin atau langsung dikirim ke wali murid'}
          </p>
        </div>

        {message.trim() && !isLoading && (
          <button
            type="button"
            onClick={() => setPreviewFormatted((p) => !p)}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[#2F6BFF]/18 bg-[#F4F8FF] px-3 py-1.5 text-xs font-semibold text-[#2A4270] transition-colors hover:border-[#3D8BFF]/45 hover:text-[#2F6BFF] dark:border-[#3D8BFF]/24 dark:bg-[#081330] dark:text-[#9DB2D9] dark:hover:text-[#EAF1FF]"
          >
            {previewFormatted ? (
              <>
                <Edit3 className="h-3.5 w-3.5 text-[#FF8A1F]" />
                <span className="whitespace-nowrap">Edit Pesan</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 text-[#3D8BFF]" />
                <span className="whitespace-nowrap">Pratinjau Format</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Chat preview stage */}
      <div className="relative min-h-[280px] rounded-2xl border border-[#2F6BFF]/14 bg-gradient-to-b from-[#EDF4FF] to-[#E5F0FA] p-4 dark:border-[#3D8BFF]/18 dark:from-[#061028] dark:to-[#081736]">
        {/* Recipient bar inside chat preview */}
        <div className="mb-3.5 flex items-center justify-between border-b border-[#2F6BFF]/10 pb-2.5 text-xs dark:border-[#3D8BFF]/15">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2F6BFF]/16 font-bold text-[#2F6BFF] dark:bg-[#2F6BFF]/28 dark:text-[#7DB4FF]">
              {(form.parentName.trim() || form.studentName.trim() || 'W')[0].toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="truncate font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
                {form.parentName.trim()
                  ? form.parentName.trim()
                  : form.studentName.trim()
                    ? `Wali Murid ${form.studentName.trim()}`
                    : 'Wali Murid'}
              </div>
              <div className="truncate text-[11px] text-[#536D99] dark:text-[#86A0CF]">
                {form.reportType}
              </div>
            </div>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-[#5B729E] dark:text-[#7B95C5]">
            {nowTime}
          </span>
        </div>

        {/* Error state */}
        {error && !isLoading && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-50/95 p-4 text-rose-800 dark:border-rose-400/30 dark:bg-rose-950/45 dark:text-rose-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500 dark:text-rose-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Gagal menyusun laporan</p>
                <p className="mt-1 text-xs leading-relaxed opacity-90">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skeleton loading before first token */}
        {isLoading && !message && (
          <div className="rounded-2xl rounded-tl-sm border border-[#2F6BFF]/22 bg-gradient-to-br from-[#DFF2F7] to-[#D7ECFB] p-4 dark:border-[#3D8BFF]/28 dark:bg-gradient-to-br dark:from-[#0E294A] dark:to-[#0B203D]">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#1B4B7A] dark:text-[#7DB4FF]">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#FF8A1F]" />
              <span>Menyusun pesan yang jujur dan sopan...</span>
            </div>
            <div className="space-y-2.5">
              <div className="skeleton-shimmer h-3.5 w-3/5 rounded-lg bg-[#2F6BFF]/14 dark:bg-[#7DB4FF]/14" />
              <div className="skeleton-shimmer h-3.5 w-full rounded-lg bg-[#2F6BFF]/14 dark:bg-[#7DB4FF]/14" />
              <div className="skeleton-shimmer h-3.5 w-11/12 rounded-lg bg-[#2F6BFF]/14 dark:bg-[#7DB4FF]/14" />
              <div className="skeleton-shimmer h-3.5 w-4/5 rounded-lg bg-[#2F6BFF]/14 dark:bg-[#7DB4FF]/14" />
              <div className="skeleton-shimmer mt-4 h-3.5 w-2/5 rounded-lg bg-[#2F6BFF]/14 dark:bg-[#7DB4FF]/14" />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && !message && (
          <div className="flex min-h-[210px] flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F6BFF]/12 text-[#2F6BFF] dark:bg-[#2F6BFF]/22 dark:text-[#7DB4FF]">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
              Belum ada pesan dibuat
            </p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#4A608A] dark:text-[#9DB2D9]">
              Isi data singkat siswa di sebelah kiri atau klik salah satu tombol{' '}
              <span className="font-semibold text-[#0B1B3A] dark:text-[#EAF1FF]">Coba contoh</span>,
              lalu tekan <span className="font-semibold text-[#D96608] dark:text-[#FF9F43]">Buat Laporan</span>.
            </p>
          </div>
        )}

        {/* Soft teal-blue WhatsApp-inspired message bubble */}
        {message && (
          <div className="rounded-2xl rounded-tl-sm border border-[#20849A]/25 bg-gradient-to-br from-[#E2F5F5] via-[#E5F2FA] to-[#DCECF9] p-4 shadow-[0_6px_22px_rgba(14,56,96,0.08)] transition-all duration-300 dark:border-[#39A9B8]/30 dark:bg-gradient-to-br dark:from-[#0C2E47] dark:via-[#0D2746] dark:to-[#0C203D] dark:shadow-[0_10px_28px_rgba(2,10,28,0.45)]">
            {isLoading || previewFormatted ? (
              <div className="min-h-[200px] whitespace-pre-wrap text-[14.5px] leading-[1.65] text-[#0B2239] dark:text-[#EAF5FF]">
                {renderWhatsAppFormatted(message)}
                {isLoading && (
                  <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-[#FF8A1F] align-middle"
                  />
                )}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                aria-label="Edit isi pesan laporan"
                value={message}
                onChange={(e) => onChangeMessage(e.target.value)}
                className="w-full resize-none bg-transparent text-[14.5px] leading-[1.65] text-[#0B2239] focus:outline-none dark:text-[#EAF5FF]"
              />
            )}

            <div className="mt-3 flex items-center justify-between border-t border-[#20849A]/15 pt-2 text-[11px] text-[#35637A] dark:border-[#7DB4FF]/15 dark:text-[#8FB4D9]">
              <span>
                {isLoading
                  ? 'Mengetik pesan...'
                  : previewFormatted
                    ? 'Pratinjau format *tebal* WhatsApp'
                    : 'Klik teks di atas untuk mengedit langsung'}
              </span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                <span>{nowTime}</span>
                <CheckCheck className="h-3.5 w-3.5 text-[#2F80ED] dark:text-[#56CCF2]" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Character & word count */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A608A] dark:text-[#9DB2D9]">
        <div className="flex items-center gap-2 font-mono tabular-nums">
          <span>{words} kata</span>
          <span aria-hidden="true">·</span>
          <span>{chars} karakter</span>
        </div>
        {message && !isLoading && (
          <span className="text-[11px] font-medium text-[#2F6BFF] dark:text-[#7DB4FF]">
            Siap diedit & dikirim
          </span>
        )}
      </div>

      {/* Optional parent WhatsApp phone input with auto-normalization */}
      <div className="mt-4">
        <label
          htmlFor="whatsappPhone"
          className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#1B2F56] dark:text-[#CFE0FF]"
        >
          <Phone className="h-3.5 w-3.5 text-[#3D8BFF]" />
          <span>Nomor WhatsApp wali murid</span>
          <span className="font-normal text-[#6B82AC] dark:text-[#7C95C4]">(opsional)</span>
        </label>
        <input
          id="whatsappPhone"
          type="tel"
          inputMode="tel"
          value={form.whatsappPhone}
          onChange={(e) => onChangePhone(e.target.value)}
          placeholder="Mis. 0812-3456-7890 (otomatis jadi 628xx)"
          className="w-full rounded-2xl border border-[#2F6BFF]/18 bg-white/90 px-4 py-2.5 font-mono text-sm tabular-nums text-[#0B1B3A] placeholder-[#6B82AC] transition-all focus:border-[#3D8BFF] focus:outline-none focus:ring-4 focus:ring-[#2F6BFF]/20 dark:border-[#3D8BFF]/22 dark:bg-[#07122D]/85 dark:text-[#EAF1FF] dark:placeholder-[#6B84B2]"
        />
        {normalizedPhone && (
          <p className="mt-1 font-mono text-[11px] tabular-nums text-[#2F6BFF] dark:text-[#7DB4FF]">
            Tujuan WhatsApp: +{normalizedPhone}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 space-y-2.5">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!message.trim() || isLoading}
          onClick={(e) => {
            if (!message.trim() || isLoading) {
              e.preventDefault();
            }
          }}
          className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold whitespace-nowrap transition-all duration-200 ${
            message.trim() && !isLoading
              ? 'bg-gradient-to-r from-[#2F6BFF] to-[#2684FF] text-white shadow-[0_0_22px_rgba(47,107,255,0.38)] hover:shadow-[0_0_30px_rgba(61,139,255,0.58)] active:scale-[0.99]'
              : 'pointer-events-none cursor-not-allowed bg-[#CBD8F0]/60 text-[#6B82AC] dark:bg-[#13254D]/70 dark:text-[#5F78A8]'
          }`}
        >
          <Send className="h-4 w-4" />
          <span>Kirim ke WhatsApp</span>
        </a>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!message.trim() || isLoading}
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-[#2F6BFF]/18 bg-[#F4F8FF] px-3 py-2 text-xs font-semibold text-[#1B3A7A] whitespace-nowrap transition-all hover:border-[#3D8BFF]/50 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#3D8BFF]/22 dark:bg-[#081330] dark:text-[#CFE0FF] dark:hover:border-[#7DB4FF]/50 dark:hover:bg-[#0E1E46]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#3D8BFF]" />
                <span>Salin Pesan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={!message.trim() || isLoading}
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-[#2F6BFF]/18 bg-[#F4F8FF] px-3 py-2 text-xs font-semibold text-[#1B3A7A] whitespace-nowrap transition-all hover:border-[#3D8BFF]/50 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#3D8BFF]/22 dark:bg-[#081330] dark:text-[#CFE0FF] dark:hover:border-[#7DB4FF]/50 dark:hover:bg-[#0E1E46]"
          >
            <RefreshCw className={`h-4 w-4 text-[#3D8BFF] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Buat Ulang</span>
          </button>

          <button
            type="button"
            onClick={() => setTonePickerOpen((prev) => !prev)}
            disabled={!message.trim() || isLoading}
            aria-expanded={tonePickerOpen}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
              tonePickerOpen
                ? 'border-[#FF8A1F] bg-[#FF8A1F]/14 text-[#C45500] dark:text-[#FFD2A6]'
                : 'border-[#2F6BFF]/18 bg-[#F4F8FF] text-[#1B3A7A] hover:border-[#FF8A1F]/55 dark:border-[#3D8BFF]/22 dark:bg-[#081330] dark:text-[#CFE0FF] dark:hover:border-[#FF8A1F]/55'
            }`}
          >
            <Sliders className="h-4 w-4 text-[#FF8A1F]" />
            <span>Ubah Nada</span>
          </button>
        </div>

        {/* Inline quick tone switcher */}
        {tonePickerOpen && message.trim() && !isLoading && (
          <div className="rounded-2xl border border-[#FF8A1F]/35 bg-[#FFF8F2] p-3 dark:border-[#FF8A1F]/35 dark:bg-[#131C38]">
            <p className="mb-2 text-[11px] font-semibold text-[#B84C00] dark:text-[#FF9F43]">
              Pilih nada baru untuk langsung menyusun ulang:
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {TONE_OPTIONS.map((tone) => {
                const Icon = getToneIcon(tone.id);
                const isCurrent = tone.id === form.tone;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => {
                      setTonePickerOpen(false);
                      onChangeToneAndRegenerate(tone.id);
                    }}
                    className={`flex min-h-[38px] items-center gap-2 rounded-xl border px-3 py-1.5 text-left text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'border-[#FF8A1F] bg-[#FF8A1F]/16 text-[#B84C00] dark:text-[#FFD2A6]'
                        : 'border-[#2F6BFF]/16 bg-white text-[#2A4270] hover:border-[#FF8A1F]/60 dark:border-[#3D8BFF]/20 dark:bg-[#081330] dark:text-[#CFE0FF] dark:hover:border-[#FF8A1F]/60'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-[#FF8A1F]" />
                    <span className="truncate">{tone.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Required verification reminder note */}
      <p className="mt-4 text-center text-xs text-[#5B729E] dark:text-[#86A0CF]">
        Periksa kembali isi pesan sebelum dikirim.
      </p>
    </aside>
  );
}
