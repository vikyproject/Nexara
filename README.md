# ⚡ FokusBot — Personal Productivity Assistant

> Final Project — AI Productivity and AI API Integration for Developers | Hacktiv8

FokusBot adalah chatbot AI berbasis Claude (Anthropic) yang dirancang untuk membantu pengguna meningkatkan produktivitas sehari-hari dengan gaya percakapan yang santai dan friendly.

---

## 🎯 Use Case

**Personal Productivity Assistant** — membantu pengguna dengan:
- 📋 Membuat dan memprioritaskan to-do list
- 🍅 Panduan teknik Pomodoro dan time management
- 🎯 Tips fokus dan menghindari distraksi
- 📅 Perencanaan jadwal harian
- 😮‍💨 Mengatasi burnout dan menjaga motivasi

## ✨ Parameter Kreatif

| Parameter | Nilai |
|-----------|-------|
| Gaya Bahasa | Santai & Friendly (bahasa Indonesia casual) |
| Domain | Produktivitas & Time Management |
| Model AI | Claude Sonnet (claude-sonnet-4-20250514) |
| Fitur Memori | Menyimpan nama user & konteks percakapan per sesi |
| Fitur Tambahan | Quick Actions sidebar, Quick Reply chips |

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js + Express.js
- **AI Model:** Anthropic Claude API
- **Environment:** dotenv untuk manajemen API key

---

## 🚀 Cara Menjalankan

### 1. Clone Repository
```bash
git clone https://github.com/username/fokusbot.git
cd fokusbot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variable
Buat file `.env` di root folder:
```env
ANTHROPIC_API_KEY=sk-ant-isi-api-key-kamu-disini
PORT=3000
```

> Dapatkan API key di: https://console.anthropic.com

### 4. Jalankan Server
```bash
npm start
```

### 5. Buka Browser
```
http://localhost:3000
```

---

## 📁 Struktur Project

```
fokusbot/
├── public/
│   ├── index.html      # Tampilan utama chatbot
│   ├── style.css       # Styling UI
│   └── script.js       # Logika frontend & API call
├── server.js           # Backend Express + proxy Anthropic API
├── package.json        # Dependencies Node.js
├── .env                # API key (tidak di-commit ke GitHub!)
├── .gitignore          # Exclude .env dan node_modules
└── README.md           # Dokumentasi ini
```

---

## 🔒 Keamanan

- API key disimpan di `.env` dan **tidak pernah** di-commit ke GitHub
- Backend server bertindak sebagai proxy, sehingga API key tidak terekspos di browser
- File `.env` sudah masuk ke `.gitignore`

---

## 📸 Screenshot

*(Tambahkan screenshot UI di sini setelah running)*

---

## 👤 Author

Nama: [Nama Kamu]  
Cohort: [Cohort Kamu]  
Hacktiv8 — AI Productivity and AI API Integration for Developers
