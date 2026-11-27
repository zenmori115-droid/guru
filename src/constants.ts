import type { PresetExample, ReportFormData, ReportSettings, ReportType, ToneOption } from './types';

export const BEHAVIOR_TAGS: string[] = [
  'Rajin',
  'Aktif bertanya',
  'Mudah fokus',
  'Sering mengobrol',
  'Sulit fokus',
  'Tugas terlambat',
  'Sering lupa membawa buku',
  'Suka mengganggu teman',
  'Pemalu',
  'Percaya diri',
  'Banyak membantu teman',
  'Perlu dukungan di rumah',
];

export const REPORT_TYPES: ReportType[] = [
  'Perkembangan rutin',
  'Nilai menurun',
  'Masalah perilaku',
  'Prestasi/kabar baik',
  'Undangan bertemu/konsultasi',
  'Jawaban atas pertanyaan wali murid',
];

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'hangat',
    name: 'Hangat & Menyemangati',
    description: 'Ramah, positif, dan memberi dorongan semangat bagi anak dan orang tua.',
  },
  {
    id: 'formal',
    name: 'Formal & Profesional',
    description: 'Bahasa baku yang rapi, terstruktur, dan resmi untuk komunikasi sekolah.',
  },
  {
    id: 'tegas',
    name: 'Tegas tapi Sopan',
    description: 'Jelas menyampaikan batas dan harapan tanpa terkesan menghakimi.',
  },
  {
    id: 'empatik',
    name: 'Empatik & Lembut',
    description: 'Penuh pengertian dan hati-hati, cocok untuk menyampaikan kabar sulit.',
  },
  {
    id: 'singkat',
    name: 'Singkat & Padat',
    description: 'Langsung ke inti informasi, cepat dibaca orang tua yang sibuk.',
  },
];

export const DEFAULT_FORM_DATA: ReportFormData = {
  studentName: '',
  parentName: '',
  className: '',
  subject: '',
  latestScore: '',
  previousScore: '',
  notes: '',
  behaviorTags: [],
  reportType: 'Perkembangan rutin',
  parentQuestion: '',
  tone: 'hangat',
  whatsappPhone: '',
};

export const DEFAULT_SETTINGS: ReportSettings = {
  length: 'sedang',
  greetingStyle: 'assalamualaikum',
  teacherSignature: '',
  includeHomeTips: true,
  includeEmoji: true,
};

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    id: 'nilai-turun',
    label: 'Nilai turun',
    shortDesc: 'Matematika turun dari 78 ke 62',
    form: {
      studentName: 'Raka Pratama',
      parentName: 'Ibu Dewi',
      className: 'Kelas 5 SD',
      subject: 'Matematika (Pecahan)',
      latestScore: '62',
      previousScore: '78',
      reportType: 'Nilai menurun',
      tone: 'empatik',
      behaviorTags: ['Rajin', 'Sulit fokus', 'Perlu dukungan di rumah'],
      notes:
        'Raka sebenarnya mau berusaha saat latihan bersama, tetapi terlihat masih bingung saat mengerjakan soal cerita pecahan secara mandiri dan sering terburu-buru.',
      parentQuestion: '',
    },
  },
  {
    id: 'aktif-mengobrol',
    label: 'Aktif tapi sering mengobrol',
    shortDesc: 'Cepat paham, namun tugas sering terlambat',
    form: {
      studentName: 'Nabila Azzahra',
      parentName: 'Bapak Hendra',
      className: 'Kelas 4A SD',
      subject: 'Bahasa Indonesia',
      latestScore: '84',
      previousScore: '82',
      reportType: 'Masalah perilaku',
      tone: 'tegas',
      behaviorTags: ['Aktif bertanya', 'Sering mengobrol', 'Tugas terlambat'],
      notes:
        'Nabila cepat menangkap materi dan berani mengemukakan pendapat saat diskusi, namun belakangan sering mengobrol dengan teman sebangku sehingga tugas kelas beberapa kali belum selesai tepat waktu.',
      parentQuestion: '',
    },
  },
  {
    id: 'prestasi-meningkat',
    label: 'Prestasi meningkat',
    shortDesc: 'Nilai naik signifikan dari 76 ke 94',
    form: {
      studentName: 'Dimas Saputra',
      parentName: 'Ibu Sari',
      className: 'Les Matematika SD',
      subject: 'Perkalian & Pembagian',
      latestScore: '94',
      previousScore: '76',
      reportType: 'Prestasi/kabar baik',
      tone: 'hangat',
      behaviorTags: ['Rajin', 'Mudah fokus', 'Percaya diri'],
      notes:
        'Dua minggu terakhir Dimas jauh lebih teliti mengecek ulang jawabannya dan tidak lagi ragu maju mengerjakan latihan di papan tulis.',
      parentQuestion: '',
    },
  },
];
