// =============================================
//   script.js — Nexara Productivity Assistant
//   Logika utama: chat history, API call,
//   render pesan, dan interaksi UI
// =============================================

// ── State Aplikasi ──────────────────────────
let conversationHistory = []; // Menyimpan seluruh riwayat chat
let userName = ""; // Nama user (didapat dari modal intro)
let isLoading = false; // Mencegah double-send saat nunggu respons

// ── Elemen DOM ──────────────────────────────
const introModal = document.getElementById("intro-modal");
const nameInput = document.getElementById("name-input");
const nameSubmitBtn = document.getElementById("name-submit-btn");
const messagesContainer = document.getElementById("messages-container");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const botStatus = document.getElementById("bot-status");
const userBadge = document.getElementById("user-badge");
const clearChatBtn = document.getElementById("clear-chat-btn");
const clearModal = document.getElementById("clear-modal");
const clearConfirmBtn = document.getElementById("clear-confirm-btn");
const clearCancelBtn = document.getElementById("clear-cancel-btn");
const quickActionBtns = document.querySelectorAll(".quick-action-btn");

// ── Init: Modal Nama ─────────────────────────
nameInput.focus();

nameSubmitBtn.addEventListener("click", handleNameSubmit);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleNameSubmit();
});

function handleNameSubmit() {
  const name = nameInput.value.trim();
  userName = name || "teman";

  // Update UI header
  userBadge.textContent = `👋 Hei, ${userName}!`;

  // Sembunyikan modal
  introModal.classList.add("hidden");

  // Kirim pesan selamat datang dari bot
  const welcomeMsg = `Hei ${userName}! 👋 Aku Nexara, asisten produktivitas kamu.\n\nAku siap bantu kamu jadi lebih fokus, terorganisir, dan produktif. Mau mulai dari mana nih? 😊`;
  appendBotMessage(welcomeMsg);

  // Tampilkan quick replies awal
  showQuickReplies([
    "📋 Bantu buat to-do list",
    "🍅 Jelasin teknik Pomodoro",
    "🎯 Tips supaya lebih fokus",
  ]);

  messageInput.focus();
}

// ── Kirim Pesan ──────────────────────────────
async function sendMessage(text) {
  const userText = text || messageInput.value.trim();
  if (!userText || isLoading) return;

  // Tampilkan pesan user
  appendUserMessage(userText);
  messageInput.value = "";
  autoResizeTextarea();

  // Tambahkan ke history
  conversationHistory.push({ role: "user", content: userText });

  // Set state loading
  isLoading = true;
  sendBtn.disabled = true;
  setTypingStatus(true);

  // Tampilkan animasi mengetik
  const typingEl = appendTypingIndicator();

  try {
    // Kirim ke backend server kita (yang meneruskan ke Anthropic)
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversationHistory,
        userName: userName,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Server error");
    }

    const data = await response.json();
    const reply = data.reply;

    // Hapus typing indicator, tampilkan jawaban
    typingEl.remove();
    appendBotMessage(reply);

    // Tambahkan ke history
    conversationHistory.push({ role: "assistant", content: reply });

    // Setiap 3 pesan, kasih quick replies kontekstual
    if (conversationHistory.length % 6 === 0) {
      showQuickReplies([
        "Lanjut tips lainnya",
        "Aku punya tugas lain nih",
        "Rekap yang sudah kita bahas",
      ]);
    }
  } catch (error) {
    typingEl.remove();
    appendBotMessage(
      `Waduh, ada masalah nih 😅\n${error.message}\n\nCoba pastikan server sudah jalan dan API key sudah diisi di .env ya!`,
    );
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
    setTypingStatus(false);
  }
}

// ── Render Pesan ─────────────────────────────

function appendUserMessage(text) {
  const div = document.createElement("div");
  div.className = "message user";
  const initials = userName ? userName.charAt(0).toUpperCase() : "U";
  div.innerHTML = `
    <div class="msg-avatar">${initials}</div>
    <div class="msg-bubble">${escapeHTML(text)}</div>
  `;
  messagesContainer.appendChild(div);
  scrollToBottom();
}

function appendBotMessage(text) {
  const div = document.createElement("div");
  div.className = "message bot";
  div.innerHTML = `
    <div class="msg-avatar">⚡</div>
    <div class="msg-bubble">${formatMessage(text)}</div>
  `;
  messagesContainer.appendChild(div);
  scrollToBottom();
}

function appendTypingIndicator() {
  const div = document.createElement("div");
  div.className = "message bot";
  div.id = "typing-indicator";
  div.innerHTML = `
    <div class="msg-avatar">⚡</div>
    <div class="msg-bubble typing">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  messagesContainer.appendChild(div);
  scrollToBottom();
  return div;
}

function showQuickReplies(options) {
  const div = document.createElement("div");
  div.className = "quick-replies";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "quick-reply-chip";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      div.remove();
      sendMessage(opt);
    });
    div.appendChild(btn);
  });
  messagesContainer.appendChild(div);
  scrollToBottom();
}

// ── Utilities ─────────────────────────────────

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Format teks: bold **teks** dan list sederhana
function formatMessage(text) {
  return escapeHTML(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function setTypingStatus(typing) {
  if (typing) {
    botStatus.textContent = "● Sedang mengetik...";
    botStatus.classList.add("typing");
  } else {
    botStatus.textContent = "● Online";
    botStatus.classList.remove("typing");
  }
}

function autoResizeTextarea() {
  messageInput.style.height = "auto";
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px";
}

// ── Event Listeners ───────────────────────────

// Kirim dengan Enter (Shift+Enter = baris baru)
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

messageInput.addEventListener("input", autoResizeTextarea);

sendBtn.addEventListener("click", () => sendMessage());

// Tombol Quick Action di sidebar
quickActionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const msg = btn.getAttribute("data-msg");
    if (msg) sendMessage(msg);
  });
});

// Hapus percakapan
clearChatBtn.addEventListener("click", () => {
  clearModal.classList.remove("hidden");
});

clearCancelBtn.addEventListener("click", () => {
  clearModal.classList.add("hidden");
});

clearConfirmBtn.addEventListener("click", () => {
  conversationHistory = [];
  messagesContainer.innerHTML = "";
  clearModal.classList.add("hidden");
  appendBotMessage(
    `Oke, kita mulai fresh! 🌟 Mau ngobrol tentang apa nih, ${userName}?`,
  );
});

clearModal.addEventListener("click", (event) => {
  if (event.target === clearModal) {
    clearModal.classList.add("hidden");
  }
});
