# Portfolio V5

Portfolio web modern untuk **Muhammad Raihan Hidayah** — mahasiswa D3 Teknologi Informasi Universitas Brawijaya. Dibangun dengan **React (Vite)**, **Tailwind CSS**, dan **Supabase**, proyek ini menyajikan halaman publik single-page serta dashboard admin untuk mengelola konten.

---

## ✨ Highlights

- **UI profesional** — tema editorial sky/zinc, border glow, dan layout kartu modern
- **Interaktif** — animasi smooth dengan Framer Motion, AOS, dan efek grid scan
- **Responsive** — optimal untuk mobile, tablet, laptop, dan desktop
- **SEO-ready** — 
eact-helmet-async, meta tags, dan JSON-LD Person schema
- **Admin dashboard** — CRUD proyek, sertifikat, foto, tech stack, journey, komentar, dan pesan kontak
- **Proteksi foto** — watermark overlay + block drag/right-click untuk gallery dan preview
- **Download watermark** — unduhan foto otomatis dilengkapi watermark ter-embed

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Frontend | React 18, Vite 5, React Router 6 |
| Styling | Tailwind CSS 3 |
| Backend | Supabase (Auth, Postgres, Storage, Realtime) |
| Animasi | Framer Motion, AOS |
| UI | Material UI, Lucide Icons, SweetAlert2 |
| 3D / Visual | Three.js, @react-three/fiber, @react-three/drei |
| Tools | react-helmet-async, Axios, Supabase JS |

---

## 📄 Fitur Utama

### Publik

- Splash screen / welcome gate
- Hero section dengan CTA, social links, dan CV download
- About section dengan bio, quote, dan stat cards
- Portofolio tab untuk kategori Web / App / UI-UX
- Halaman detail proyek dengan teknologi, fitur, dan CTA
- Contact form dengan email FormSubmit dan penyimpanan pesan ke Supabase
- Gallery foto photography dengan preview modal dan watermark

### Admin

- Login Supabase Auth untuk admin
- Dashboard proyek: tambah, edit, hapus, publish
- Dashboard sertifikat: upload dan kelola
- Dashboard foto: upload, edit, publish/hide
- Tech stack manager berdasarkan kategori
- Journey manager untuk pengalaman dan edukasi
- Moderasi komentar realtime

---

## 📁 Struktur Proyek

`
Portofolio/
├── public/
├── scripts/
├── src/
│   ├── App.jsx
│   ├── config/
│   │   ├── site.js
│   │   └── social.js
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── Pages/
│   └── utils/
├── supabase/
├── .env.example
├── package.json
└── vercel.json
`

---

## 🚀 Instalasi & Setup

### Prasyarat

- Node.js >= 18.x
- Akun Supabase

### 1. Clone & install

`ash
git clone https://github.com/Raihanhidayah12/Portofolio.git
cd Portofolio
npm install
`

### 2. Buat file .env

Salin .env.example ke .env dan isi dengan kredensial Supabase:

`env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_USERNAME=admin
`

> Jangan commit file .env.

### 3. Jalankan admin setup

`ash
npm run create-admin
`

Jika perlu panduan tambahan:

`ash
npm run setup-admin
`

### 4. Jalankan lokal

`ash
npm run dev
`

Buka http://localhost:5173.

---

## 🧱 Supabase

- Tabel: projects, certificates, tech_stack, portfolio_comments, portfolio_messages, journey, profiles
- Storage Bucket: project-images, certificate-images, profile-images
- Realtime: portfolio_comments, portfolio_messages
- Auth: Supabase Auth + custom table profiles

SQL contoh tersedia di folder supabase/.

---

## 📜 NPM Scripts

| Perintah | Deskripsi |
|----------|-----------|
| 
pm run dev | Jalankan development server |
| 
pm run build | Build produksi |
| 
pm run preview | Preview hasil build |
| 
pm run lint | Jalankan ESLint |
| 
pm run create-admin | Buat user admin |
| 
pm run reset-admin | Reset password admin |
| 
pm run verify-admin | Verifikasi admin setup |
| 
pm run setup-admin | Panduan setup admin |
| 
pm run sync-profile-credentials | Sinkron profil auth |

---

## 📌 Fitur Khusus

- **Proteksi foto** — watermark overlay pada gallery dan preview modal, serta block drag/right-click
- **Image download watermark** — watermark ter-embed saat unduhan foto gallery
- **Admin dashboard** — kelola konten tanpa deploy ulang
- **Performance-aware** — animasi disesuaikan untuk devices low-end
- **SEO-ready** — 
eact-helmet-async, meta tag, dan JSON-LD

---

## 🔧 Troubleshooting

- Supabase env missing — pastikan .env berisi variabel VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY
- Login admin gagal — pastikan user admin ada di tabel profiles dengan 
ole = 'admin'
- Komentar atau pesan tidak muncul — pastikan tabel `portfolio_comments` dan `portfolio_messages` ada dan Realtime diaktifkan di Supabase
- Route 404 setelah deploy — perlu konfigurasi SPA rewrite / fallback ke index.html
- Website lambat — build lalu preview untuk memeriksa hasil produksi

---

## 👤 Kontributor

- **Muhammad Raihan Hidayah** — pengembang utama

---

## 📬 Kontak

- GitHub: [@Raihanhidayah12](https://github.com/Raihanhidayah12)
- LinkedIn: [https://www.linkedin.com/in/muhammad-raihan-hidayah-800a07321](https://www.linkedin.com/in/muhammad-raihan-hidayah-800a07321)
- Instagram: [@raihanhidayah06](https://www.instagram.com/raihanhidayah06/)

---

⭐ Jika kamu suka proyek ini, beri star di GitHub!
