/** Profil & branding — ubah di sini untuk seluruh situs */

export const SITE = {
  fullName: "Muhammad Raihan Hidayah",
  brandName: "Raihan",
  jobTitle: "Frontend Developer · UI/UX · Mobile · IoT · Photo & Video",
  heroRoles: [
    { line1: "Frontend", line2: "Developer" },
    { line1: "UI/UX", line2: "Designer" },
    { line1: "Mobile App", line2: "Developer" },
    { line1: "IoT & Automation", line2: "Engineer" },
    { line1: "Photographer &", line2: "Videographer" },
  ],
  heroTaglines: [
    "Information Technology Student",
    "Software Engineering Enthusiast",
    "Creative Problem Solver",
  ],
  heroDescription:
    "Mengubah Ide Menjadi Solusi Digital melalui Kode, Desain, dan Inovasi.",
  heroDescriptionHighlights: ["Kode", "Desain", "Inovasi"],
  bioAbout:
    "Mahasiswa D3 Teknologi Informasi Universitas Brawijaya yang berfokus pada Front-End Development dengan pengalaman dalam pengembangan aplikasi web dan mobile. Memiliki kemampuan dalam membangun antarmuka yang responsif dan berorientasi pada pengalaman pengguna menggunakan Laravel, Flutter, PHP, dan JavaScript. Selain berfokus pada pengembangan frontend, juga memiliki pengalaman dalam Full Stack Development yang mencakup integrasi backend, pengelolaan database, dan pengembangan sistem secara menyeluruh. Aktif dalam organisasi dan manajemen proyek, dengan pengalaman mengoordinasikan berbagai kegiatan serta proyek kolaboratif di bidang teknologi dan multimedia.",
  bioShort:
    "Portofolio Muhammad Raihan Hidayah — mahasiswa D3 Teknologi Informasi UB, Front-End & Full Stack Developer (Laravel, Flutter, PHP, JavaScript).",
  quote:
    "Memanfaatkan AI sebagai alat profesional untuk meningkatkan produktivitas, kreativitas, dan pemecahan masalah—bukan sebagai pengganti keahlian manusia",
  /** ProfileCard (Home hero) */
  profileHandle: "raihanhidayah06",
  profileStatus: "Available for work",
  profileContactLabel: "Hubungi Saya",
  profileAvatar: "/Photo.jpg",
  cvUrl: "https://drive.google.com/file/d/18Qrn2-JZ71vl26h2JGLhpXiPj8dGaiOS/view?usp=drive_link",

  /** Pendidikan */
  education: [
    {
      period: "2022 - Sekarang",
      title: "D3 Teknologi Informasi",
      org: "Universitas Brawijaya",
      description: "Fokus pada Front-End Development, pemrograman web, dan pengembangan aplikasi mobile.",
    },
    // Tambah pendidikan lain di sini
  ],

  /** Pengalaman / Magang */
  experience: [
    {
      period: "2024",
      title: "Judul Posisi Magang",
      org: "Nama Perusahaan",
      description: "Deskripsi singkat tentang peran dan pencapaian utama.",
    },
    {
      period: "2023",
      title: "Judul Posisi Kedua",
      org: "Nama Perusahaan / Freelance",
      description: "Deskripsi singkat tentang peran dan pencapaian utama.",
    },
  ],

  /** Organisasi */
  organization: [
    {
      period: "2024",
      title: "Jabatan / Peran",
      org: "Nama Organisasi",
      description: "Deskripsi singkat kontribusi dan tanggung jawab.",
    },
    {
      period: "2023",
      title: "Jabatan / Peran",
      org: "Nama Organisasi",
      description: "Deskripsi singkat kontribusi dan tanggung jawab.",
    },
    {
      period: "2023",
      title: "Jabatan / Peran",
      org: "Nama Organisasi",
      description: "Deskripsi singkat kontribusi dan tanggung jawab.",
    },
    {
      period: "2022",
      title: "Jabatan / Peran",
      org: "Nama Organisasi",
      description: "Deskripsi singkat kontribusi dan tanggung jawab.",
    },
    {
      period: "2022",
      title: "Jabatan / Peran",
      org: "Nama Organisasi",
      description: "Deskripsi singkat kontribusi dan tanggung jawab.",
    },
    {
      period: "2022",
      title: "Jabatan / Peran",
      org: "Nama Organisasi",
      description: "Deskripsi singkat kontribusi dan tanggung jawab.",
    },
  ],
};

export const pageTitle = (suffix) =>
  suffix ? `${SITE.fullName} — ${suffix}` : `${SITE.fullName} | ${SITE.jobTitle}`;
