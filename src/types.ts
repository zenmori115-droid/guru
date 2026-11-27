export type TabId = 'buat' | 'riwayat' | 'panduan';

export type ReportType =
  | 'Perkembangan rutin'
  | 'Nilai menurun'
  | 'Masalah perilaku'
  | 'Prestasi/kabar baik'
  | 'Undangan bertemu/konsultasi'
  | 'Jawaban atas pertanyaan wali murid';

export type ToneId = 'hangat' | 'formal' | 'tegas' | 'empatik' | 'singkat';

export type MessageLength = 'singkat' | 'sedang' | 'lengkap';

export type GreetingStyle = 'assalamualaikum' | 'selamat' | 'netral';

export interface ToneOption {
  id: ToneId;
  name: string;
  description: string;
}

export interface ReportFormData {
  studentName: string;
  parentName: string;
  className: string;
  subject: string;
  latestScore: string;
  previousScore: string;
  notes: string;
  behaviorTags: string[];
  reportType: ReportType;
  parentQuestion: string;
  tone: ToneId;
  whatsappPhone: string;
}

export interface ReportSettings {
  length: MessageLength;
  greetingStyle: GreetingStyle;
  teacherSignature: string;
  includeHomeTips: boolean;
  includeEmoji: boolean;
}

export interface StudentProfile {
  id: string;
  studentName: string;
  parentName: string;
  className: string;
  whatsappPhone: string;
  updatedAt: string;
}

export interface ReportHistoryItem {
  id: string;
  studentName: string;
  parentName: string;
  className: string;
  subject: string;
  reportType: ReportType;
  tone: ToneId;
  message: string;
  whatsappPhone: string;
  createdAt: string;
}

export interface PresetExample {
  id: string;
  label: string;
  shortDesc: string;
  form: Partial<ReportFormData>;
}
