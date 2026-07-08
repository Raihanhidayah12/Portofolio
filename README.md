# Portfolio V5

Portfolio website modern untuk **Muhammad Raihan Hidayah** — mahasiswa D3 Teknologi Informasi Universitas Brawijaya. Portfolio ini dibuat dengan **React (Vite)**, **Tailwind CSS**, dan **Supabase** untuk memberikan tampilan publik yang menarik plus dashboard admin untuk mengelola konten.

---

## ✨ Highlights

- **UI profesional** — desain gelap modern dengan border glow dan layout kartu
- **Interaktif** — animasi halus menggunakan Framer Motion dan AOS
- **Responsive** — tampil baik pada mobile, tablet, dan desktop
- **SEO-aware** — meta tags dan JSON-LD untuk personal branding
- **Admin dashboard** — kelola proyek, sertifikat, foto, tech stack, journey, komentar, dan pesan
- **Proteksi foto** — watermark overlay + blok drag/right-click
- **Download watermark** — gambar yang diunduh membawa watermark ter-embed

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Frontend | React 18, Vite 5, React Router 6 |
| Styling | Tailwind CSS 3 |
| Backend | Supabase (Auth, Postgres, Storage, Realtime) |
| Animasi | Framer Motion, AOS |
| UI | Material UI, Lucide Icons, SweetAlert2 |
| 3D / Visual | Three.js, postprocessing |
| Tools | react-helmet-async, Axios, Supabase JS |

---

## 📄 Fitur Utama

### Untuk pengunjung umum

- Halaman depan dengan CTA, tautan sosial, dan tombol download CV
- Section About dengan bio, quote, dan statistik
- Portofolio dengan filter kategori dan halaman detail proyek
- Contact form yang mengirim email dan menyimpan pesan ke Supabase
- Gallery foto photography dengan preview modal dan watermark

### Untuk admin

- Login admin via Supabase Auth
- Kelola proyek: tambah, edit, hapus, publish
- Kelola sertifikat: upload dan atur tampilannya
- Kelola foto: upload, edit, publish/hide
- Kelola tech stack berdasarkan kategori
- Kelola journey pengalaman dan pembelajaran
- Moderasi komentar realtime

---

## 📁 Struktur Proyek

```
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
```

---

## 🚀 Instalasi & Setup

### Prasyarat

- Node.js >= 18.x
- Supabase account

### 1. Clone repo dan install dependencies

```bash
git clone https://github.com/Raihanhidayah12/Portofolio.git
cd Portofolio
npm install
```

### 2. Buat file `.env`

Salin `.env.example` ke `.env` kemudian isi nilai Supabase:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_USERNAME=admin
```

> Jangan commit file `.env`.

### 3. Jalankan admin setup

```bash
npm run create-admin
```

Jika butuh panduan tambahan:

```bash
npm run setup-admin
```

### 4. Jalankan lokal

```bash
npm run dev
```

Buka http://localhost:5173.

---

## 🧱 Supabase

- Tabel: `projects`, `certificates`, `tech_stack`, `portfolio_comments`, `portfolio_messages`, `journey`, `profiles`
- Storage Bucket: `project-images`, `certificate-images`, `profile-images`
- Realtime: `portfolio_comments`, `portfolio_messages`
- Auth: Supabase Auth + custom table `profiles`
- Contoh SQL dan policy tersedia di folder `supabase/`

> Jika Row Level Security (RLS) aktif pada `portfolio_messages`, jalankan policy insert agar pesan dari form bisa tersimpan.

---

## 📜 NPM Scripts

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build produksi |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Jalankan ESLint |
| `npm run create-admin` | Buat user admin |
| `npm run reset-admin` | Reset password admin |
| `npm run verify-admin` | Verifikasi admin setup |
| `npm run setup-admin` | Panduan setup admin |
| `npm run sync-profile-credentials` | Sinkron profil auth |

---

## 🔧 Troubleshooting

- Supabase env missing — cek `.env` untuk `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`
- Login admin gagal — pastikan user admin tersedia di tabel `profiles` dengan `role = 'admin'`
- Komentar atau pesan tidak muncul — pastikan tabel `portfolio_comments` dan `portfolio_messages` ada serta Realtime aktif
- Pesan tidak tersimpan — periksa policy RLS di tabel `portfolio_messages`
- Route 404 setelah deploy — perlu SPA rewrite / fallback ke `index.html`
- Website lambat — jalankan build lalu preview untuk memeriksa performa

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
