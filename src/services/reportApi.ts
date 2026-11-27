import { TONE_OPTIONS } from '../constants';
import type { ReportFormData, ReportSettings } from '../types';

export interface GenerateReportOptions {
  form: ReportFormData;
  settings: ReportSettings;
  isRegenerate?: boolean;
  previousMessage?: string;
  signal?: AbortSignal;
  onChunk: (accumulatedText: string) => void;
}

export async function streamGeneratedReport({
  form,
  settings,
  isRegenerate = false,
  previousMessage,
  signal,
  onChunk,
}: GenerateReportOptions): Promise<string> {
  const toneObj = TONE_OPTIONS.find((t) => t.id === form.tone);

  const response = await fetch('/api/generate-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      studentName: form.studentName,
      parentName: form.parentName,
      className: form.className,
      subject: form.subject,
      latestScore: form.latestScore,
      previousScore: form.previousScore,
      notes: form.notes,
      behaviorTags: form.behaviorTags,
      reportType: form.reportType,
      parentQuestion: form.parentQuestion,
      tone: toneObj?.name ?? form.tone,
      toneDescription: toneObj?.description ?? '',
      length: settings.length,
      greetingStyle: settings.greetingStyle,
      teacherSignature: settings.teacherSignature,
      includeHomeTips: settings.includeHomeTips,
      includeEmoji: settings.includeEmoji,
      isRegenerate,
      previousMessage,
    }),
  });

  if (!response.ok) {
    let errorMessage =
      'Kuota AI akun Anda sedang habis atau koneksi bermasalah. Coba lagi beberapa saat.';
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) errorMessage = data.error;
    } catch {
      // keep default
    }
    throw new Error(errorMessage);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Tidak dapat membaca respons dari server AI. Silakan coba lagi.');
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const rawEvent of events) {
      const line = rawEvent
        .split('\n')
        .find((l) => l.startsWith('data: '));
      if (!line) continue;

      const jsonStr = line.slice(6).trim();
      if (!jsonStr) continue;

      const parsed = JSON.parse(jsonStr) as {
        chunk?: string;
        done?: boolean;
        error?: string;
      };

      if (parsed.error) {
        throw new Error(parsed.error);
      }

      if (parsed.chunk) {
        accumulated += parsed.chunk;
        onChunk(accumulated);
      }
    }
  }

  const finalText = accumulated.trim();
  if (!finalText) {
    throw new Error('Hasil pesan kosong. Silakan coba buat ulang.');
  }

  return finalText;
}
