import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageCircleHeart,
  Send,
  Sliders,
} from 'lucide-react';
import { PRESET_EXAMPLES } from '../constants';
import type { PresetExample } from '../types';

interface GuideTabProps {
  onTryPreset: (preset: PresetExample) => void;
  onGoCreate: () => void;
}

const STEPS = [
  {
    number: '01',
    title: 'Isi Data Singkat',
    description:
      'Masukkan nama siswa, nilai terakhir, dan pilih tag perilaku yang sesuai. Anda bisa menyimpan profil siswa agar tidak perlu mengetik ulang lain waktu.',
    icon: ClipboardList,
  },
  {
    number: '02',
    title: 'Pilih Nada Pesan',
    description:
      'Sesuaikan nada penyampaian—hangat untuk kabar baik, empatik untuk nilai turun, atau tegas tapi sopan saat mengingatkan kedisiplinan di kelas.',
    icon: Sliders,
  },
  {
    number: '03',
    title: 'Periksa & Kirim ke WhatsApp',
    description:
      'Baca hasil pesan di pratinjau chat, sunting ringan bila perlu, lalu klik "Kirim ke WhatsApp" atau salin untuk langsung dikirim ke wali murid.',
    icon: Send,
  },
];

const COMMUNICATION_TIPS = [
  {
    title: 'Mulai dengan apresiasi yang nyata',
    detail:
      'Saat menyampaikan nilai turun atau perilaku yang perlu diperbaiki, awali dengan satu hal positif yang benar-benar terlihat pada anak agar orang tua lebih terbuka menerima masukan.',
  },
  {
    title: 'Bicarakan perilaku, bukan label pribadi',
    detail:
      'Hindari kata seperti "malas", "nakal", atau "kurang pintar". Ganti dengan fakta spesifik seperti "tugas matematika minggu ini belum dikumpulkan" atau "masih butuh bantuan pada soal cerita".',
  },
  {
    title: 'Ajak kerja sama tanpa menyalahkan',
    detail:
      'Tawarkan 1–2 langkah sederhana yang bisa dibantu di rumah, misalnya menemani latihan 10–15 menit atau mengecek buku penghubung sebelum tidur.',
  },
  {
    title: 'Jaga pesan tetap ringkas & ramah dibaca di HP',
    detail:
      'Wali murid sering membaca WhatsApp di sela kesibukan kerja. Paragraf pendek dan poin penting dengan format *tebal* membuat pesan cepat dipahami tanpa menimbulkan salah tafsir.',
  },
  {
    title: 'Perhatikan waktu pengiriman',
    detail:
      'Usahakan mengirim pesan di jam yang sopan (pagi hingga sore hari kerja), dan beri ruang bagi orang tua untuk menanggapi atau berdiskusi lebih lanjut.',
  },
];

export function GuideTab({ onTryPreset, onGoCreate }: GuideTabProps) {
  return (
    <div className="space-y-6">
      {/* 3-Step Guide */}
      <section className="rounded-3xl border border-[#2F6BFF]/16 bg-white/88 p-6 shadow-[0_12px_36px_rgba(20,52,130,0.06)] backdrop-blur-xl dark:border-[#3D8BFF]/20 dark:bg-[#0B1736]/75 dark:shadow-[0_14px_42px_rgba(2,7,22,0.55)] sm:p-8">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-xl font-extrabold tracking-tight text-[#0B1B3A] dark:text-[#EAF1FF] sm:text-2xl [text-wrap:balance]">
            Cara Cepat Menyusun Laporan untuk Wali Murid
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#4A608A] dark:text-[#9DB2D9]">
            Cukup tiga langkah sederhana untuk mengubah catatan harian kelas menjadi pesan WhatsApp yang jelas, hangat, dan profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="flex flex-col rounded-2xl border border-[#2F6BFF]/14 bg-[#F6FAFF] p-5 dark:border-[#3D8BFF]/18 dark:bg-[#07122D]/75"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F6BFF]/14 text-[#2F6BFF] dark:bg-[#2F6BFF]/22 dark:text-[#7DB4FF]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm font-bold tabular-nums text-[#FF8A1F]">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#4A608A] dark:text-[#9DB2D9]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Try Ready-Made Examples */}
      <section className="rounded-3xl border border-[#2F6BFF]/16 bg-white/88 p-6 shadow-[0_12px_36px_rgba(20,52,130,0.06)] backdrop-blur-xl dark:border-[#3D8BFF]/20 dark:bg-[#0B1736]/75 dark:shadow-[0_14px_42px_rgba(2,7,22,0.55)] sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
              Langsung Coba dengan 3 Contoh Situasi
            </h2>
            <p className="mt-0.5 text-xs text-[#4A608A] dark:text-[#9DB2D9]">
              Pilih salah satu skenario umum guru SD atau bimbel di bawah ini untuk langsung melihat hasilnya.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoCreate}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#2F6BFF]/12 px-4 py-2 text-xs font-bold text-[#2F6BFF] transition-colors hover:bg-[#2F6BFF]/20 dark:bg-[#2F6BFF]/24 dark:text-[#7DB4FF]"
          >
            <span>Buka Formulir Kosong</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {PRESET_EXAMPLES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onTryPreset(preset)}
              className="group flex flex-col justify-between rounded-2xl border border-[#2F6BFF]/16 bg-[#F6FAFF] p-4 text-left transition-all duration-200 hover:border-[#FF8A1F]/65 hover:bg-[#FFF6EE] dark:border-[#3D8BFF]/20 dark:bg-[#07122D]/75 dark:hover:border-[#FF8A1F]/65 dark:hover:bg-[#171F3A]"
            >
              <div>
                <div className="text-sm font-bold text-[#0B1B3A] group-hover:text-[#C45500] dark:text-[#EAF1FF] dark:group-hover:text-[#FF9F43]">
                  {preset.label}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#4A608A] dark:text-[#9DB2D9]">
                  {preset.shortDesc}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#D96608] dark:text-[#FF9F43]">
                <span>Gunakan contoh ini</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Practical Tips for Teachers */}
      <section className="rounded-3xl border border-[#2F6BFF]/16 bg-white/88 p-6 shadow-[0_12px_36px_rgba(20,52,130,0.06)] backdrop-blur-xl dark:border-[#3D8BFF]/20 dark:bg-[#0B1736]/75 dark:shadow-[0_14px_42px_rgba(2,7,22,0.55)] sm:p-8">
        <div className="mb-5 flex items-center gap-2.5">
          <MessageCircleHeart className="h-5 w-5 text-[#FF8A1F]" />
          <h2 className="text-lg font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
            Tips Menulis Pesan yang Baik kepada Wali Murid
          </h2>
        </div>

        <div className="divide-y divide-[#2F6BFF]/12 dark:divide-[#3D8BFF]/15">
          {COMMUNICATION_TIPS.map((tip) => (
            <div key={tip.title} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F6BFF] dark:text-[#7DB4FF]" />
              <div>
                <h3 className="text-sm font-bold text-[#0B1B3A] dark:text-[#EAF1FF]">
                  {tip.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#4A608A] dark:text-[#9DB2D9]">
                  {tip.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
