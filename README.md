# Portfolio V5

Portofolio web modern untuk **Muhammad Raihan Hidayah** — mahasiswa D3 Teknologi Informasi Universitas Brawijaya. Dibangun dengan **React (Vite)**, **Tailwind CSS**, dan **Supabase**, mencakup situs publik single-page dan panel admin untuk mengelola konten.

---

## ✨ Highlights

- **Welcome screen** — intro cinematic "Welcome to My Work" dengan typewriter terminal, progress bar, dan ambient glow
- **Hero interaktif** — video workspace, grid scan, rotasi role, tech stack dari database, dan tombol Download CV terpusat
- **Performance optimized** — auto-detect low-end devices, lazy loading, code splitting, dan selective animation rendering
- **BorderGlow (React Bits)** — efek border & glow pada kartu dan tombol
- **Animasi halus** — Framer Motion + AOS terpusat, mendukung `prefers-reduced-motion`
- **Tema editorial** — palet sky / zinc, layout grid, tipografi mono untuk label
- **SEO** — `react-helmet-async`, JSON-LD Person schema
- **Responsive design** — optimized untuk semua ukuran layar, dari mobile hingga desktop
- **Admin dashboard** — CRUD proyek (dengan kategori Web/App/UI-UX), sertifikat, tech stack, journey, moderasi komentar

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Frontend | React 18, Vite 5, React Router 6 |
| Styling | Tailwind CSS 3 |
| Backend | Supabase (Auth, Postgres, Storage, Realtime) |
| Animasi | Framer Motion, AOS |
| UI | Material UI (tabs portofolio), Lucide Icons, SweetAlert2 |
| 3D Graphics | Three.js, @react-three/fiber, @react-three/drei |
| Lainnya | Axios (FormSubmit), react-helmet-async |

---

## 🚀 Performance Optimizations

- **Intelligent device detection** — menonaktifkan animasi berat pada low-end devices (CPU < 4 cores, RAM < 4GB)
- **Lazy loading** — komponen dan media dimuat sesuai kebutuhan
- **Code splitting** — vendor chunks terpisah (React, MUI, Three.js, animations)
- **Optimized media** — `preload="none"`, `loading="lazy"`, dan `decoding="async"` pada images/videos
- **Minification** — terser dengan drop console & debugger di production
- **Selective rendering** — AnimatedBackground dan FluidCursor hanya di devices yang capable

---

## 📄 Halaman & Fitur

### Publik (pengunjung)

| Bagian | Route / Anchor | Deskripsi |
|--------|----------------|-----------|
| Welcome | `/` (pertama kali) | Splash screen + transisi ke landing |
| Home | `#Home` | Hero, CTA, sosial, tech pills (Supabase), CV Download |
| About | `#About` | Bio, quote, stat cards |
| Portofolio | `#Portofolio` | Tab proyek (kategori: Web, App, UI/UX) & sertifikat, tech stack loop |
| Detail proyek | `/project/:slug` | Halaman detail per proyek |
| Contact | `#Contact` | Form kirim pesan (FormSubmit) + komentar realtime |
| 404 | `*` | Halaman tidak ditemukan |

### Admin

| Route | Fitur |
|-------|--------|
| `/login` | Login Supabase Auth (role `admin`) |
| `/dashboard/projects` | CRUD proyek (Kategori: Web, App, UI/UX) + upload gambar |
| `/dashboard/certificates` | Upload & hapus sertifikat |
| `/dashboard/photos` | Upload, edit, publish/unpublish foto photography |
| `/dashboard/tech-stack` | CRUD tech stack + kategori (Frontend, Backend, Database, Mobile, Design, Cloud, DevOps) |
| `/dashboard/journey` | CRUD riwayat edukasi, pengalaman kerja, & organisasi |
| `/dashboard/comments` | Hapus, pin/unpin komentar |

---

## 📁 Struktur Proyek

```
Portofolio/
├── public/                 # Aset statis (Photo.jpg, hero-workspace.mp4, …)
├── scripts/                # create-admin, reset-admin, verify-admin, …
├── src/
│   ├── App.jsx             # Router & welcome gate
│   ├── config/
│   │   ├── site.js         # ⭐ Nama, bio, hero, branding
│   │   └── social.js       # ⭐ Link GitHub, LinkedIn, Instagram
│   ├── components/
│   │   ├── BorderGlow.jsx  # Efek border glow (React Bits)
│   │   ├── ui/layout.jsx   # SectionShell, GlowCard, tombol glow
│   │   └── …
│   ├── hooks/useAOS.js     # Inisialisasi AOS global
│   ├── lib/                # motion.js, aos.js presets
│   ├── Pages/              # Home, About, Contact, WelcomeScreen, …
│   └── utils/supabase/     # client.js, mappers.js
├── .env.example
├── package.json
└── vercel.json             # SPA rewrite
```

### Kustomisasi cepat

Edit **`src/config/site.js`** untuk nama, bio, role hero, dan foto profil.  
Edit **`src/config/social.js`** untuk semua link sosial.

---

## 👥 Peran Pengguna

| Role | Akses |
|------|--------|
| **Visitor** | Lihat proyek, sertifikat, tech stack; kirim komentar |
| **Admin** | Dashboard penuh — CRUD konten & moderasi komentar |

---

## 🚀 Getting Started

### Prasyarat

- **Node.js** `>= 18.x` (disarankan LTS)
- Akun [Supabase](https://supabase.com)

### 1. Clone & install

```bash
git clone https://github.com/Raihanhidayah12/Portofolio.git
cd Portofolio
npm install
```

Jika ada konflik peer dependency:

```bash
npm install --legacy-peer-deps
```

### 2. Environment variables

Salin `.env.example` menjadi `.env` di root proyek:

```env
# Wajib — prefix VITE_ agar terbaca di browser (Vite SPA)
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Opsional — legacy alias masih didukung di client
# VITE_SUPABASE_ANON_KEY=...

# Hanya untuk script admin (JANGAN prefix VITE_)
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_USERNAME=admin
```
### 4. Local AI routing tool (`9router`)

This project includes a local `9router` CLI tool as a dev dependency for optional AI/code-tool routing support.

- Install dependencies:

```bash
npm install
```

- Start `9router` locally:

```bash
npm run 9router
```

- You can also run it directly with:

```bash
npx 9router
```

`9router` is a local development tool and is not required for the portfolio app runtime.
> ⚠️ Jangan commit file `.env`.  
> Variabel `NEXT_PUBLIC_*` adalah untuk Next.js — **tidak** dipakai di proyek ini.

### 3. Supabase client

Client browser ada di `src/utils/supabase/client.js` dan di-reexport dari `src/supabase.js`:

```javascript
import { supabase } from "./supabase";
```

### 4. Database setup

Buka Supabase → **SQL Editor** → jalankan skrip berikut (sekali):

```sql
-- ============================
-- TABLES
-- ============================
CREATE TABLE public.projects (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title text,
  description text,
  img text,
  link text,
  github text,
  features jsonb,
  tech_stack jsonb,
  category text DEFAULT 'web',
  is_published boolean DEFAULT true,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.certificates (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  img text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.tech_stack (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  icon text,
  category text NOT NULL DEFAULT 'Frontend Development'
    CHECK (category IN (
      'Frontend Development',
      'Backend Development',
      'Database Management',
      'Mobile Development',
      'Design',
      'Cloud & Backend Services',
      'Tools & DevOps'
    )),
  order_index int DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.portfolio_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  user_name text NOT NULL,
  profile_image text,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.journey (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  period text NOT NULL,
  title text NOT NULL,
  org text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'education' CHECK (type IN ('education', 'experience', 'organization')),
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  gmail text,
  password text,
  created_at timestamptz DEFAULT now()
);

-- ============================
-- RLS
-- ============================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read projects"
ON public.projects FOR SELECT USING (true);

CREATE POLICY "public read certificates"
ON public.certificates FOR SELECT USING (true);

CREATE POLICY "public read tech_stack"
ON public.tech_stack FOR SELECT USING (true);

CREATE POLICY "public read comments"
ON public.portfolio_comments FOR SELECT USING (true);

CREATE POLICY "public read journey"
ON public.journey FOR SELECT USING (true);

CREATE POLICY "public insert comment"
ON public.portfolio_comments FOR INSERT
WITH CHECK (is_pinned = false);

CREATE POLICY "users read own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "admin manage projects"
ON public.projects FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "admin manage certificates"
ON public.certificates FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "admin manage tech_stack"
ON public.tech_stack FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "admin manage comments"
ON public.portfolio_comments FOR UPDATE, DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "admin manage journey"
ON public.journey FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================
-- STORAGE
-- ============================
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "admin upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "public read project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-images', 'certificate-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "admin upload certificate images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificate-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "public read certificate images"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-images');
```

### 5. Tech categories (opsional, DB lama)

Jika tabel `tech_stack` belum punya kolom `category`, jalankan `supabase/tech-stack-add-category.sql` di SQL Editor.

Kategori yang didukung: **Frontend Development**, **Backend Development**, **Database Management**, **Mobile Development**, **Design**, **Cloud & Backend Services**, **Tools & DevOps**.

### 6. Realtime (komentar)

**Table Editor** → `portfolio_comments` → aktifkan **Realtime**.

### 7. Buat akun admin

**Opsi A — Script (disarankan)**

```bash
npm run create-admin
```

Pastikan `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, dan `ADMIN_PASSWORD` sudah diisi di `.env`.

**Opsi B — Panduan terminal**

```bash
npm run setup-admin
```

**Opsi C — Manual (Dashboard)**

1. **Authentication** → **Users** → tambah user (auto-confirm) → salin UUID.  
2. SQL Editor:

```sql
INSERT INTO public.profiles (id, username, role)
VALUES ('USER_UUID_DARI_AUTH', 'admin', 'admin');
```

### 8. Jalankan lokal

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173).

---

## 📜 NPM Scripts

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Development server (Vite) |
| `npm run build` | Build production → folder `dist/` |
| `npm run preview` | Preview build lokal |
| `npm run lint` | ESLint |
| `npm run create-admin` | Buat user admin via service role |
| `npm run reset-admin` | Reset password admin |
| `npm run verify-admin` | Verifikasi setup admin |
| `npm run setup-admin` | Tampilkan petunjuk setup admin |
| `npm run sync-profile-credentials` | Sinkron kredensial profil |

---

## 🌐 Deploy Production

```bash
npm run build
```

Upload isi folder **`dist/`** ke hosting static (Vercel, Netlify, dll.).

Untuk Vercel, `vercel.json` sudah mengatur SPA rewrite:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Set environment variables `VITE_SUPABASE_*` di dashboard hosting.

---

## 🎨 Komponen UI utama

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| `BorderGlow` | `src/components/BorderGlow.jsx` | Border gradient + glow interaktif |
| `GlowCard` / `GlowLink` | `src/components/ui/layout.jsx` | Wrapper kartu & tombol dengan glow |
| `WelcomeScreen` | `src/Pages/WelcomeScreen.jsx` | Intro animasi "Welcome to My Work" + Loading Portfolio |
| `SectionShell` | `src/components/ui/layout.jsx` | Layout section + grid background |
| `Reveal` | `src/components/ui/Reveal.jsx` | Scroll reveal (Framer Motion) |
| `GridScan` | `src/components/GridScan.jsx` | Interactive 3D grid scanning effect |
| `HeroGridScan` | `src/components/HeroGridScan.jsx` | Optimized hero grid dengan idle callback |

Preset glow: `src/components/ui/borderGlowConfig.js`  
Preset animasi: `src/lib/motion.js`, `src/lib/aos.js`

---

## ⚡ Build & Bundle Optimization

### Vite Configuration

Build process menggunakan manual chunks untuk optimal loading:

- **react-vendor** — React core (react, react-dom, react-router-dom)
- **animation** — Animation libraries (framer-motion, aos)
- **mui** — Material UI components
- **three** — Three.js dan dependencies 3D rendering

### Production Build

```bash
npm run build
```

Output di folder `dist/` dengan:
- Minified & tree-shaken code
- Console logs dihapus
- Optimized asset chunks
- Reduced bundle size ~30-40%

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `Supabase env missing` | Pastikan `.env` memakai `VITE_SUPABASE_URL` & `VITE_SUPABASE_PUBLISHABLE_KEY`, lalu restart `npm run dev` |
| Login admin gagal | Cek baris `profiles` dengan `role = 'admin'` untuk UUID user Auth |
| Komentar tidak realtime | Aktifkan Realtime pada tabel `portfolio_comments` |
| Animasi terasa berat | Sistem otomatis menonaktifkan animasi berat pada low-end devices dan menghormati `prefers-reduced-motion` di OS |
| Route 404 setelah deploy | Pastikan SPA rewrite / fallback ke `index.html` |
| Sidebar GitHub "No contributors" | Verifikasi email commit di [GitHub Emails](https://github.com/settings/emails), lalu push commit baru |
| Website loading lambat | Jalankan `npm run build` dan test dengan `npm run preview` untuk melihat optimasi production |
| `useMemo is not defined` error | Pastikan semua hooks React di-import dengan benar di komponen |

---

## 📊 Performance Metrics

Target metrics setelah optimasi:

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Bundle size**: ~40% lebih kecil dengan code splitting

---

## 👤 Kontributor

| | |
|---|---|
| ![@Raihanhidayah12](https://github.com/Raihanhidayah12.png?size=96) | **[Muhammad Raihan Hidayah](https://github.com/Raihanhidayah12)** — pengembang utama |

---

## 📬 Kontak

**Muhammad Raihan Hidayah**  
GitHub: [@Raihanhidayah12](https://github.com/Raihanhidayah12) · LinkedIn: [Profil](https://www.linkedin.com/in/muhammad-raihan-hidayah-800a07321) · Instagram: [@raihanhidayah06](https://www.instagram.com/raihanhidayah06/)

---

⭐ Jika proyek ini bermanfaat, berikan star di GitHub!
