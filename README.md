# Virtual Manipulative Math Berbasis RME

Aplikasi web interaktif **Virtual Manipulative Math** yang dirancang berbasis pendekatan **Realistic Mathematics Education (RME)** untuk pembelajaran matematika anak.

## 🎮 Fitur Utama

- **Pengukuran Interaktif** — Siswa dapat mengukur bangun datar secara virtual menggunakan manipulatif digital.
- **Drag & Drop** — Mekanik seret dan lepas untuk komposisi dan dekomposisi bentuk geometri.
- **Audio Feedback** — Efek suara dan musik latar yang mendukung pengalaman belajar menyenangkan.
- **Desain Responsif** — Antarmuka 16:9 dengan estetika kartun yang menarik untuk anak-anak.

## 📁 Struktur Project

```
metodebelajar1/
├── index.html          # Halaman utama aplikasi
├── css/
│   └── style.css       # Styling aplikasi
├── js/
│   └── app.js          # Logika utama aplikasi
├── assets/
│   ├── images/         # Gambar dan ilustrasi
│   └── sounds/         # File audio
├── generate_sounds.py  # Script untuk generate efek suara
├── copy_assets.py      # Script untuk copy asset
└── README.md
```

## 🚀 Cara Menjalankan

1. Clone repository ini:
   ```bash
   git clone https://github.com/USERNAME/metodebelajar1.git
   ```
2. Buka `index.html` di browser, atau jalankan dengan live server:
   ```bash
   python -m http.server 8000
   ```
3. Akses di browser: `http://127.0.0.1:8000`

## 🛠️ Teknologi

- HTML5, CSS3, JavaScript (Vanilla)
- Web Audio API
- SVG untuk elemen geometri interaktif

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik.
