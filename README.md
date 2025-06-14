# Realtime Collaborative Computer Based Test (CBT)

## 🎯 Deskripsi Aplikasi

Aplikasi Computer Based Test (CBT) adalah sistem ujian berbasis web yang dikembangkan untuk memfasilitasi pelaksanaan ujian atau tes secara digital dengan fokus pada kolaborasi real-time. Sistem ini dirancang untuk menggantikan metode ujian konvensional dengan solusi modern yang lebih efisien dan aman.

### Fitur Utama:

- ✅ **Manajemen Tes**: Pembuatan, pengelolaan, dan konfigurasi tes oleh administrator
- 🔐 **Sistem Autentikasi**: Login dan manajemen pengguna dengan role-based access control
- 📝 **Interface Ujian**: Antarmuka yang user-friendly untuk peserta ujian
- 📊 **Monitoring Real-time**: Pemantauan aktivitas ujian secara langsung
- 🏆 **Sistem Scoring**: Penilaian otomatis dan laporan hasil ujian
- 🛡️ **Anti-Cheating Features**: Fitur keamanan untuk mencegah kecurangan
- 👥 **Realtime Collaborative**: Mendukung tes yang dilakukan bersama dalam tim

## 📋 Analisis Kebutuhan

### Kebutuhan Fungsional

| Req-ID | Kebutuhan Fungsional   | Deskripsi                                           |
| ------ | ---------------------- | --------------------------------------------------- |
| F-01   | Autentikasi Pengguna   | Sistem login dan registrasi dengan verifikasi email |
| F-02   | Manajemen Tes          | Fitur CRUD tes dengan pengaturan waktu dan password |
| F-03   | Manajemen Soal         | Pembuatan soal dengan dukungan format Markdown      |
| F-04   | Pelaksanaan Ujian      | Interface ujian dengan timer dan auto-save          |
| F-05   | Sistem Penilaian       | Penilaian otomatis dan perhitungan skor             |
| F-06   | Monitoring Ujian       | Pemantauan real-time dan laporan pelanggaran        |
| F-07   | Manajemen Tim          | Pengelolaan tim/group peserta ujian                 |
| F-08   | Laporan dan Analisis   | Laporan hasil dan analisis statistik                |
| F-09   | Realtime Collaboration | Kolaborasi semi real-time antar anggota tim         |

### Tech Stack

**Frontend:**

- Next.js TypeScript
- Tailwind CSS

**Backend:**

- Next.js Server Rendering

**Database:**

- Supabase PostgreSQL

## 🏗️ Arsitektur Aplikasi

Aplikasi menggunakan arsitektur full-stack modern dengan Next.js sebagai framework utama dan Supabase sebagai backend service.

### Lapisan Arsitektur:

1. **Client Layer**: Web & Mobile Browser
2. **Frontend Layer**: Next.js dengan React components
3. **Backend Layer**: Next.js API Routes
4. **Database Layer**: Supabase PostgreSQL

## 🗄️ Pemodelan Data

### Entitas Utama:

- **tests**: Data ujian dan konfigurasi
- **questions**: Soal-soal ujian
- **teams**: Tim peserta ujian
- **test_sessions**: Sesi pengerjaan ujian
- **answers**: Jawaban peserta
- **scores**: Hasil penilaian

## 🚀 Implementasi

### Fitur yang Telah Dikembangkan:

#### 1. Manajemen Tes dan Soal

- Dashboard administrator untuk CRUD tes
- Editor Markdown untuk pembuatan soal
- Dukungan notasi matematis (KaTeX)

#### 2. Pelaksanaan Ujian Real-time

- Interface kolaboratif untuk tim
- Sinkronisasi jawaban real-time
- Timer dan navigasi soal

#### 3. Sistem Penilaian Otomatis

- Penilaian otomatis post-submission
- Perhitungan skor berdasarkan kunci jawaban
- Tampilan hasil instant

#### 4. Monitoring dan Manajemen

- Dashboard monitoring sesi aktif
- Manajemen pengguna dan tim
- Laporan aktivitas mencurigakan

## 🌐 Demo

**Website CBT**: [https://cbt.runs.my.id](https://cbt.runs.my.id)

## 📁 Source Code

Repository GitHub: [https://github.com/runsdev/cbt-runsha](https://github.com/runsdev/cbt-runsha)

---
