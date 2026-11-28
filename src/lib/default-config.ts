import type { SiteConfig } from "./types";

// Default media endpoints follow the platform's text-to-image helper.
const img = (prompt: string, size: string) =>
  `https://core-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt
  )}&image_size=${size}`;

export const DEFAULT_CONFIG: SiteConfig = {
  identity: {
    siteName: "Kessoku Family",
    brandMark: "KSF",
    tagline: "Creativity · Community · Craft",
    showNav: true,
    navItems: [
      { id: "nav-1", label: "Profil", href: "#profil", active: true },
      { id: "nav-2", label: "Tentang", href: "#tentang", active: true },
      { id: "nav-3", label: "Kalung", href: "#kalung", active: true },
      { id: "nav-4", label: "Magang", href: "#magang", active: true },
      { id: "nav-5", label: "Sertifikasi", href: "#sertifikasi", active: true },
      { id: "nav-6", label: "Daftar", href: "#registrasi", active: true }
    ]
  },
  background: {
    type: "image",
    color: "#FFFFFF",
    desktopUrl: img(
      "clean minimal white studio room with soft daylight, blurred bokeh, subtle red accent light, premium editorial photography, wide composition",
      "landscape_16_9"
    ),
    mobileUrl: img(
      "clean minimal white studio space with soft daylight, blurred bokeh, subtle red accent, premium vertical editorial photography, calm and airy",
      "portrait_16_9"
    ),
    fadeBottom: true,
    overlayOpacity: 0.72,
    presets: [
      {
        id: "bg-plain",
        label: "Putih Bersih",
        type: "plain",
        color: "#FFFFFF",
        desktopUrl: "",
        mobileUrl: ""
      },
      {
        id: "bg-soft",
        label: "Studio Lembut",
        type: "image",
        color: "#FFFFFF",
        desktopUrl: img(
          "very light minimal white interior with soft diffused daylight and subtle shadows, airy and clean, premium editorial photography, wide",
          "landscape_16_9"
        ),
        mobileUrl: img(
          "very light minimal white interior with soft diffused daylight, calm airy vertical composition, premium editorial photography",
          "portrait_16_9"
        )
      },
      {
        id: "bg-ink",
        label: "Monokrom",
        type: "image",
        color: "#FFFFFF",
        desktopUrl: img(
          "abstract soft white paper texture close up, subtle grey folds, minimal monochrome background, editorial photography, wide",
          "landscape_16_9"
        ),
        mobileUrl: img(
          "abstract soft white paper texture close up, subtle grey folds, minimal monochrome background, vertical",
          "portrait_16_9"
        )
      }
    ]
  },
  hero: {
    eyebrow: "",
    title: "Kessoku Family",
    subtitle: "Portofolio & Gerbang Resmi Anggota KSF",
    description:
      "Ruang resmi Kessoku Family — tempat di mana karya, pengalaman, dan dedikasi setiap anggota diarsipkan dengan rapi dan dipresentasikan dengan standar premium.",
    primaryButton: { label: "Daftar Sekarang", href: "#registrasi" },
    secondaryButton: { label: "Lihat Portofolio", href: "#profil" },
    stats: [
      { id: "hero-stat-1", label: "Anggota Aktif", value: "1.280+" },
      { id: "hero-stat-2", label: "Generasi", value: "3" },
      { id: "hero-stat-3", label: "Sejak", value: "2021" }
    ]
  },
  profile: {
    name: "Kessoku Family",
    role: "Creative Guild & Competitive Squad",
    location: "Indonesia",
    bio: "Kami membangun komunitas yang menjunjung tinggi kualitas karya, kekompakan tim, dan pertumbuhan anggota. Setiap pendaftar diarahkan ke generasi yang tepat sesuai keahliannya.",
    photoUrl: img(
      "studio portrait of a confident young creative in a black and red varsity jacket, plain light grey background, soft studio lighting, premium editorial photography, square framing",
      "square_hd"
    ),
    socials: [
      { id: "soc-1", label: "TikTok", href: "https://www.tiktok.com/", icon: "at" },
      { id: "soc-2", label: "Instagram", href: "https://www.instagram.com/", icon: "image" },
      { id: "soc-3", label: "Discord", href: "https://discord.com/", icon: "link" }
    ]
  },
  about: {
    title: "Tentang Kessoku",
    subtitle: "Satu keluarga, satu standar.",
    body:
      "Kessoku Family adalah naungan bagi kreator dan pemain yang ingin tumbuh bersama. Kami percaya bahwa reputasi dibangun dari konsistensi: karya yang dikurasi, pengalaman yang terdokumentasi, dan anggota yang dibina dari generasi ke generasi. Setiap bagian dari halaman ini adalah bagian dari cerita kami.",
    imageUrl: img(
      "flat lay of a minimal creative workspace on a white desk, notebook, mechanical keyboard, camera and red accent object, top down product photography, bright and clean",
      "portrait_4_3"
    ),
    imageCaption: "Studio kerja anggota Kessoku Family",
    highlights: [
      { id: "hl-1", label: "Karya Terkurasi", value: "320+" },
      { id: "hl-2", label: "Mentor Aktif", value: "24" },
      { id: "hl-3", label: "Kolaborasi", value: "78" }
    ]
  },
  necklace: {
    title: "Kalung Kessoku",
    subtitle: "Simbol Keanggotaan",
    description:
      "Simbol keanggotaan Kessoku Family. Geser untuk memutar, lalu ketuk untuk melihat sisi sebaliknya.",
    hint: "Geser untuk memutar · Ketuk untuk membalik",
    frontImage: img(
      "silver chain necklace with a flat round pendant, product photography on pure white background, centered, soft studio lighting, high detail",
      "square_hd"
    ),
    backImage: img(
      "reverse side of a silver chain necklace pendant, engraved detail, product photography on pure white background, centered, soft studio lighting",
      "square_hd"
    ),
    frontLabel: "Sisi Depan",
    backLabel: "Sisi Belakang"
  },
  internships: {
    title: "Pengalaman Magang",
    description:
      "Geser galeri untuk menjelajahi setiap pengalaman. Ketuk kartu untuk melihat versi lengkapnya.",
    items: [
      {
        id: "int-1",
        title: "Creative Production Intern",
        role: "Videographer",
        company: "Studio Visual Nusantara",
        period: "2023 · 6 bulan",
        description:
          "Mengelola produksi konten mingguan, menyusun storyboard, dan mengatur jadwal shooting tim kreatif.",
        image: img(
          "videographer setting up a camera on a tripod in a bright minimal studio, white walls, professional behind the scenes photography, landscape",
          "landscape_4_3"
        ),
        tags: ["Produksi", "Storyboard", "Editing"]
      },
      {
        id: "int-2",
        title: "Community Manager",
        role: "Community Lead",
        company: "Guild Network ID",
        period: "2023 · 4 bulan",
        description:
          "Membina lebih dari 500 anggota komunitas, menyusun program onboarding, dan menjaga kesehatan interaksi antar generasi.",
        image: img(
          "modern bright co-working space with people collaborating at white desks, minimal interior, natural light, editorial photography, landscape",
          "landscape_4_3"
        ),
        tags: ["Komunitas", "Onboarding", "Event"]
      },
      {
        id: "int-3",
        title: "Brand Design Intern",
        role: "Visual Designer",
        company: "Merah Kreatif",
        period: "2024 · 5 bulan",
        description:
          "Merancang identitas visual klan, komponen desain modular, dan sistem panduan brand untuk seluruh divisi.",
        image: img(
          "designer desk with a tablet, colour swatches and printed logo sheets on a white surface, minimal flat lay, light photography, landscape",
          "landscape_4_3"
        ),
        tags: ["Branding", "UI", "Panduan"]
      },
      {
        id: "int-4",
        title: "Esports Analyst Intern",
        role: "Data Analyst",
        company: "Arena Collective",
        period: "2024 · 3 bulan",
        description:
          "Menganalisis rekaman pertandingan, menyusun laporan performa, dan merancang strategi latihan berbasis data.",
        image: img(
          "esports practice room with monitors showing match statistics, dark desk setup, minimal white room, professional photography, landscape",
          "landscape_4_3"
        ),
        tags: ["Analitik", "Strategi", "Riset"]
      }
    ]
  },
  certifications: {
    title: "Sertifikasi",
    description:
      "Koleksi sertifikat resmi yang diraih Kessoku Family. Geser untuk berpindah antar sertifikat.",
    items: [
      {
        id: "cert-1",
        title: "Digital Content Production",
        issuer: "Creative Skills Institute",
        date: "2023",
        description: "Kompetensi produksi konten digital end-to-end.",
        image: img(
          "framed certificate of achievement hanging on a clean white wall, minimal interior, soft daylight, professional photography, landscape",
          "landscape_4_3"
        )
      },
      {
        id: "cert-2",
        title: "Community Leadership",
        issuer: "Guild Network Academy",
        date: "2024",
        description: "Manajemen komunitas dan kepemimpinan tim lintas generasi.",
        image: img(
          "elegant award plaque on a white pedestal, minimal studio background, soft light, premium product photography, landscape",
          "landscape_4_3"
        )
      },
      {
        id: "cert-3",
        title: "Competitive Game Analysis",
        issuer: "Arena Collective",
        date: "2024",
        description: "Analisis pertandingan dan penyusunan strategi kompetitif.",
        image: img(
          "gold medal ribbon on a white surface, minimal clean composition, soft studio lighting, premium product photography, landscape",
          "landscape_4_3"
        )
      },
      {
        id: "cert-4",
        title: "Brand & Visual Identity",
        issuer: "Merah Kreatif",
        date: "2025",
        description: "Perancangan identitas visual dan sistem desain.",
        image: img(
          "rotated certificate document on a white desk with clean minimal styling, top down photography, bright light, landscape",
          "landscape_4_3"
        )
      }
    ]
  },
  registration: {
    title: "Registrasi Kessoku Family",
    description:
      "Isi data berikut dengan benar. Setelah terkirim, kamu akan menerima rekomendasi nama CN resmi KSF.",
    nameLabel: "Nama",
    namePlaceholder: "Masukkan nama panggilanmu",
    genderLabel: "Gender",
    tiktokLabel: "Akun TikTok",
    tiktokPlaceholder: "@username",
    genLabel: "Pilih Gen tujuan",
    skillLabel: "Paling jago",
    submitLabel: "Kirim Pendaftaran",
    genderOptions: [
      { id: "g-1", label: "Laki-laki", active: true },
      { id: "g-2", label: "Perempuan", active: true },
      { id: "g-3", label: "Rahasia", active: true }
    ],
    genOptions: [
      { id: "gen-1", label: "Gen 1", active: true },
      { id: "gen-2", label: "Gen 2", active: true },
      { id: "gen-3", label: "Gen 3", active: true }
    ],
    skillOptions: [
      { id: "sk-1", label: "JJ 3D", active: true },
      { id: "sk-2", label: "JJ biasa", active: true },
      { id: "sk-3", label: "Mograp", active: true }
    ]
  },
  cn: {
    title: "Nama CN Kamu",
    description:
      "Pilih salah satu format nama CN resmi di bawah ini. Nama kamu otomatis dimasukkan.",
    placeholderHint: "{Nama} diganti dengan namamu.",
    copyLabel: "Salin",
    copiedLabel: "Tersalin",
    joinLabel: "Bergabung",
    formats: [
      { id: "cn-1", label: "Format Klasik", template: "ケ-{Nama}", active: true },
      { id: "cn-2", label: "Format Segel", template: "{Nama}〆`KSF", active: true },
      { id: "cn-3", label: "Format Fraktur", template: "{Nama} 𝖋𝖙`KSF", active: true }
    ]
  },
  join: {
    title: "Konfirmasi Bergabung",
    description:
      "Salin informasi pendaftaranmu terlebih dahulu, lalu lanjutkan untuk masuk ke grup resmi Kessoku Family.",
    copyInfoLabel: "Salin Informasi",
    copyInfoDoneLabel: "Informasi Tersalin",
    joinLabel: "Bergabung Sekarang",
    url: "https://www.tiktok.com/"
  },
  hashtags: {
    title: "Statistik Hashtag",
    description: "Rekap penggunaan hashtag resmi Kessoku Family.",
    note: "Diperbarui setiap hari Senin",
    items: [
      { id: "tag-1", tag: "#kessokuclan", count: 4820 },
      { id: "tag-2", tag: "#kessomufamily", count: 3160 },
      { id: "tag-3", tag: "#ksf", count: 6540 }
    ]
  },
  animation: {
    enabled: true,
    scrollReveal: true,
    hoverEffects: true,
    shimmer: true,
    necklaceMotion: true,
    coverflowMotion: true,
    durationScale: 1
  }
};
