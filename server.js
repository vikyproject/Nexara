// =============================================
//   server.js — Backend Proxy Server
//   Bertugas meneruskan request dari frontend
//   ke Groq API dengan aman (API key
//   disimpan di server, bukan di browser)
// =============================================

require("dotenv").config(); // Baca .env

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Sajikan file HTML/CSS/JS dari folder public/

// ── System Prompt Chatbot ───────────────────
const SYSTEM_PROMPT = `Kamu adalah Nexara 🤖, personal productivity assistant yang santai dan friendly.

Kepribadian kamu:
- Ngobrol pakai bahasa Indonesia yang casual (boleh mix sedikit Inggris)
- Panggil user dengan nama mereka kalau sudah tahu
- Pakai "kamu" bukan "Anda"
- Sesekali pakai emoji biar lebih hidup, tapi jangan berlebihan
- Jawaban ringkas dan to the point (3-4 kalimat), kecuali diminta detail
- Selalu encouraging dan positif

Keahlian kamu:
- Time management dan perencanaan harian
- Membantu membuat dan memprioritaskan to-do list
- Tips fokus: teknik Pomodoro, deep work, menghindari distraksi
- Manajemen energi dan istirahat produktif
- Motivasi dan mindset growth
- Metode produktivitas: GTD, Eisenhower Matrix, Time Blocking

Aturan penting:
- Kalau user curhat tentang burnout atau stres, tunjukkan empati dulu sebelum kasih solusi
- Kalau diminta buat to-do list, tampilkan dalam format yang rapi dengan nomor
- Ingat konteks percakapan sebelumnya dalam satu sesi`;

// ── Route: Chat API ─────────────────────────
app.post("/api/chat", async (req, res) => {
  const { messages, userName } = req.body;

  // Validasi input
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Format messages tidak valid" });
  }

  // Cek API key tersedia
  if (!process.env.GROQ_API_KEY) {
    return res
      .status(500)
      .json({ error: "API key belum dikonfigurasi di .env" });
  }

  // Tambahkan nama user ke system prompt kalau ada
  const systemPrompt = userName
    ? `${SYSTEM_PROMPT}\n\nNama user saat ini: ${userName}`
    : SYSTEM_PROMPT;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // ← beda header!
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // ← model Groq
          max_tokens: 1000,
          messages: [
            { role: "system", content: systemPrompt }, // ← system masuk ke messages
            ...messages,
          ],
        }),
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error("Groq API error:", errData);
      return res
        .status(response.status)
        .json({ error: "Error dari Groq API", detail: errData });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Maaf, ada error!";

    res.json({ reply });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Route: Health Check ─────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Nexara server berjalan!",
    apiKeySet: !!process.env.GROQ_API_KEY,
  });
});

// ── Start Server ────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Nexara server jalan di http://localhost:${PORT}`);
  console.log(
    `🔑 API Key: ${process.env.GROQ_API_KEY ? "✅ Terkonfigurasi" : "❌ Belum ada! Cek .env"}`,
  );
  console.log(`\nBuka browser dan akses http://localhost:${PORT}\n`);
});
