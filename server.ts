import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION = `Kamu adalah asisten guru yang ahli menulis pesan WhatsApp kepada wali murid dalam Bahasa Indonesia yang natural, sopan, dan mudah dipahami orang tua.

Aturan wajib yang harus selalu diikuti:
- Pesan harus JUJUR dan SPESIFIK sesuai data yang diberikan guru. Jangan mengarang fakta, nilai, kejadian, mata pelajaran, atau nama yang tidak diberikan.
- Untuk kabar kurang baik (nilai turun, masalah perilaku): mulai dengan hal positif yang benar-benar ada di data (jika ada), sampaikan masalah dengan bahasa objektif tanpa menghakimi atau melabeli anak (hindari kata seperti "nakal", "bodoh", "malas", "bandel", "payah"), jelaskan dampaknya secara singkat, lalu tutup dengan langkah bersama dan ajakan kerja sama.
- Jika data nilai sebelumnya tersedia, sebutkan perubahannya (naik/turun/stabil) secara faktual berdasarkan angka atau nilai yang diberikan.
- Jangan menyalahkan orang tua. Jika saran di rumah diaktifkan, tulis sebagai ajakan yang praktis dan ringan (maksimal 2-3 saran).
- Sesuaikan nada pesan, panjang pesan, gaya sapaan, dan penggunaan emoji persis dengan pengaturan pengguna.
- Format cocok untuk WhatsApp: gunakan paragraf pendek yang nyaman dibaca di layar HP, boleh memakai *tebal* ala WhatsApp untuk poin penting, tanpa markdown heading (#, ##), tanpa tabel, tanpa tanda kutip pembungkus di awal/akhir pesan.
- Akhiri dengan tanda tangan guru sesuai pengaturan (jika nama guru diisi).
- Keluarkan HANYA teks pesan final, tanpa pembuka seperti "Berikut pesannya:" atau "Tentu, ini draf pesannya:" dan tanpa penjelasan tambahan apa pun di awal atau akhir.
- Hindari memasukkan data pribadi sensitif selain yang diberikan guru.`;

interface GenerateReportPayload {
  studentName?: string;
  parentName?: string;
  className?: string;
  subject?: string;
  latestScore?: string;
  previousScore?: string;
  notes?: string;
  behaviorTags?: string[];
  reportType?: string;
  parentQuestion?: string;
  tone?: string;
  toneDescription?: string;
  length?: 'singkat' | 'sedang' | 'lengkap';
  greetingStyle?: 'assalamualaikum' | 'selamat' | 'netral';
  teacherSignature?: string;
  includeHomeTips?: boolean;
  includeEmoji?: boolean;
  isRegenerate?: boolean;
  previousMessage?: string;
}

function buildUserPrompt(payload: GenerateReportPayload): string {
  const lines: string[] = ['Susun pesan WhatsApp untuk wali murid berdasarkan data berikut:'];

  lines.push(`- Nama siswa: ${payload.studentName?.trim()}`);
  if (payload.parentName?.trim()) {
    lines.push(`- Nama wali murid: ${payload.parentName.trim()}`);
  } else {
    lines.push('- Nama wali murid: (tidak disebutkan, gunakan sapaan Bapak/Ibu Wali Murid)');
  }
  if (payload.className?.trim()) {
    lines.push(`- Kelas / Jenjang: ${payload.className.trim()}`);
  }
  if (payload.subject?.trim()) {
    lines.push(`- Mata pelajaran / Program: ${payload.subject.trim()}`);
  }
  lines.push(`- Nilai terakhir: ${payload.latestScore?.trim()}`);
  if (payload.previousScore?.trim()) {
    lines.push(`- Nilai sebelumnya: ${payload.previousScore.trim()}`);
  }

  lines.push(`- Jenis laporan: ${payload.reportType || 'Perkembangan rutin'}`);

  if (payload.reportType === 'Jawaban atas pertanyaan wali murid' && payload.parentQuestion?.trim()) {
    lines.push(`- Pertanyaan / pesan dari wali murid yang perlu dijawab:\n"""\n${payload.parentQuestion.trim()}\n"""`);
  }

  if (Array.isArray(payload.behaviorTags) && payload.behaviorTags.length > 0) {
    lines.push(`- Tag perilaku yang teramati: ${payload.behaviorTags.join(', ')}`);
  }

  if (payload.notes?.trim()) {
    lines.push(`- Catatan tambahan dari guru: ${payload.notes.trim()}`);
  }

  lines.push('');
  lines.push('Pengaturan gaya pesan:');
  lines.push(`- Nada pesan: ${payload.tone || 'Hangat & Menyemangati'}${payload.toneDescription ? ` (${payload.toneDescription})` : ''}`);

  const lengthGuide =
    payload.length === 'singkat'
      ? 'Singkat (sekitar 2-3 paragraf sangat ringkas, langsung ke inti, maksimal ~80 kata)'
      : payload.length === 'lengkap'
        ? 'Lengkap (sekitar 4-5 paragraf terstruktur namun tetap ringan dibaca di WhatsApp, ~160-220 kata)'
        : 'Sedang (sekitar 3-4 paragraf seimbang dan nyaman dibaca di HP, ~100-150 kata)';
  lines.push(`- Panjang pesan: ${lengthGuide}`);

  const greetingGuide =
    payload.greetingStyle === 'assalamualaikum'
      ? 'Awali dengan "Assalamualaikum Wr. Wb." atau "Assalamualaikum Bapak/Ibu..."'
      : payload.greetingStyle === 'selamat'
        ? 'Awali dengan "Selamat pagi/siang/sore Bapak/Ibu..." (pilih satu yang natural atau "Selamat pagi/siang Bapak/Ibu...")'
        : 'Awali dengan sapaan netral dan sopan seperti "Halo Bapak/Ibu..." atau "Yth. Bapak/Ibu..."';
  lines.push(`- Gaya sapaan: ${greetingGuide}`);

  lines.push(
    `- Saran tindak lanjut di rumah: ${
      payload.includeHomeTips
        ? 'YA, sertakan 2-3 saran praktis dan ringan yang bisa dibantu orang tua di rumah tanpa menyalahkan.'
        : 'TIDAK perlu menyertakan daftar saran tindak lanjut di rumah.'
    }`
  );

  lines.push(
    `- Penggunaan emoji: ${
      payload.includeEmoji
        ? 'YA, gunakan emoji secukupnya secara sopan dan natural (maksimal 2-4 emoji yang sesuai konteks).'
        : 'TIDAK, jangan gunakan emoji sama sekali.'
    }`
  );

  if (payload.teacherSignature?.trim()) {
    lines.push(`- Tanda tangan guru di akhir pesan: ${payload.teacherSignature.trim()}`);
  } else {
    lines.push('- Tanda tangan guru di akhir pesan: (tidak diisi, tutup dengan salam penutup sopan tanpa mengarang nama guru)');
  }

  if (payload.isRegenerate) {
    lines.push('');
    lines.push(
      'Catatan variasi: Buat versi susunan kalimat dan alur penyampaian yang segar dan berbeda dari versi sebelumnya, namun tetap 100% akurat sesuai fakta di atas.'
    );
    if (payload.previousMessage?.trim()) {
      lines.push(`Versi sebelumnya (jangan disalin persis, buat variasi baru):\n"""\n${payload.previousMessage.trim().slice(0, 800)}\n"""`);
    }
  }

  return lines.join('\n');
}

function mapGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (
    lower.includes('429') ||
    lower.includes('resource_exhausted') ||
    lower.includes('quota') ||
    lower.includes('rate limit')
  ) {
    return {
      status: 429,
      message: 'Kuota AI akun Anda sedang habis atau batas permintaan tercapai. Coba lagi beberapa saat.',
    };
  }

  if (
    lower.includes('401') ||
    lower.includes('403') ||
    lower.includes('api_key') ||
    lower.includes('permission_denied') ||
    lower.includes('unauthenticated')
  ) {
    return {
      status: 503,
      message: 'Layanan AI belum siap digunakan saat ini. Pastikan akun AI Studio Anda aktif lalu coba lagi.',
    };
  }

  if (lower.includes('fetch') || lower.includes('network') || lower.includes('timeout') || lower.includes('enotfound')) {
    return {
      status: 503,
      message: 'Koneksi ke layanan AI bermasalah. Periksa koneksi internet Anda lalu coba lagi.',
    };
  }

  return {
    status: 500,
    message: 'Terjadi kendala saat menyusun laporan. Silakan coba lagi beberapa saat.',
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/generate-report', async (req, res) => {
    const body = (req.body ?? {}) as GenerateReportPayload;

    if (!body.studentName || !body.studentName.trim()) {
      res.status(400).json({ error: 'Nama siswa wajib diisi sebelum membuat laporan.' });
      return;
    }

    if (!body.latestScore || !body.latestScore.trim()) {
      res.status(400).json({ error: 'Nilai terakhir siswa wajib diisi sebelum membuat laporan.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'Layanan AI belum aktif pada lingkungan ini. Silakan coba lagi beberapa saat.',
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const userPrompt = buildUserPrompt(body);

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      const stream = await ai.models.generateContentStream({
        model: 'gemini-4-hydrogen',
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      let fullText = '';
      for await (const chunk of stream) {
        const piece = chunk.text;
        if (piece) {
          fullText += piece;
          res.write(`data: ${JSON.stringify({ chunk: piece })}\n\n`);
        }
      }

      if (!fullText.trim()) {
        res.write(
          `data: ${JSON.stringify({
            error: 'AI tidak menghasilkan teks laporan. Silakan coba lagi.',
          })}\n\n`
        );
      } else {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      }
      res.end();
    } catch (err) {
      console.error('[LaporKu Guru] Gemini API error:', err);
      const mapped = mapGeminiError(err);
      res.write(`data: ${JSON.stringify({ error: mapped.message })}\n\n`);
      res.end();
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LaporKu Guru server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
