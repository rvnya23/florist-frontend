# Sudut Flora Frontend

Sudut Flora Frontend adalah bagian aplikasi yang dilihat dan disentuh pengguna. Kalau aplikasinya diibaratkan semangkuk seblak, frontend adalah mangkuk dan penyajiannya: produk terlihat cantik, tombol mudah ditemukan, dan pengguna tahu harus ngapain. Bahan serta datanya tetap disiapkan oleh `florist-backend`.

Aplikasi ini dibuat dengan Vue 3 dan Vite. Seluruh halaman publik serta panel admin berada dalam satu aplikasi.

## Siapa yang memakai aplikasi ini?

Ada tiga jenis pengguna:

| Pengguna | Yang dapat dilakukan |
| --- | --- |
| Pengunjung | Melihat beranda dan katalog, membaca Tentang Kami, mendaftar member, serta mengirim pesan dan kesan. |
| Member | Login, mengelola keranjang, checkout, mengunggah bukti bayar, melihat order dan profil, lalu logout. |
| Admin | Login ke panel khusus lalu mengelola katalog, data pendukung, order, pembayaran, dan rekening bank. |

## Halaman publik

### Beranda (`/`)

Beranda berisi pengenalan Sudut Flora, empat produk terbaru pada bagian Edisi Terpopuler, galeri, reputasi pelanggan, dan peta studio. Produk diambil dari backend, sedangkan kartu reputasi yang tampil di beranda masih ditulis langsung di halaman frontend.

### Produk (`/products`)

Halaman ini menampilkan seluruh katalog. Pengunjung dapat memilih kartu untuk membuka detail nama, harga, gambar, dan deskripsi produk.

Saat data sedang diambil, gagal diambil, atau belum tersedia, halaman menampilkan keterangan yang sesuai. Jadi pengguna tidak ditinggal menatap layar kosong seperti menunggu seblak yang ternyata belum dipesan.

Detail produk menyediakan tombol tambah ke keranjang. Pengunjung yang belum login akan diarahkan ke halaman login member terlebih dahulu.

### Keranjang dan Checkout (`/cart` dan `/checkout`)

Member dapat menyimpan beberapa produk, mengubah jumlah, atau menghapus item. Saat checkout, member memasukkan alamat tujuan. Total saat ini hanya menghitung harga produk tanpa ongkos kirim.

### Riwayat Order (`/orders`)

Member dapat melihat status order, rincian produk, total, dan pembayaran. Rekening tujuan dipilih ketika bukti transfer diunggah. Tanggal pembayaran otomatis berisi tanggal hari ini dalam waktu Asia/Jakarta, tetapi dapat diganti selama bukan tanggal mendatang.

### Daftar Member (`/register-member`)

Pengunjung mengisi nama, email, nomor HP, alamat, password, dan konfirmasi password. Setelah berhasil, akun langsung dalam keadaan login dan pengguna dapat membuka profil.

Email dan nomor HP harus unik. Password minimal 8 karakter.

### Login Member (`/login`)

Halaman ini hanya menerima akun dengan peran customer. Pilihan “Ingat saya” dapat digunakan agar sesi login bertahan lebih lama.

### Profil Member (`/profile`)

Halaman profil memperlihatkan nama, email, nomor HP, dan alamat. Halaman ini hanya dapat dibuka oleh member yang sudah login. Belum ada fitur mengubah profil.

### Pesan & Kesan (`/testimoni`)

Pengunjung dapat mengirim nama, email, dan pesan. Member yang sudah login cukup mengisi pesan karena nama dan email diambil dari akun member. Data tersebut masuk ke backend agar bisa diperiksa admin. Pesan yang dikirim tidak otomatis menjadi kartu reputasi di beranda.

### Tentang Kami (`/about-us`)

Isi halaman ini berasal dari backend dan mengikuti urutan yang ditentukan admin.

## Panel admin

Admin masuk melalui:

```text
/admin/login
```

Tidak ada halaman pendaftaran admin. Setelah login, admin mendapatkan:

- dashboard berisi jumlah produk, member, dan testimoni;
- Katalog Produk untuk menambah, mengubah, atau menghapus produk;
- Data Member untuk mengelola catatan member;
- Pesan & Kesan untuk mengelola masukan pengunjung;
- Tentang Kami untuk mengatur judul, isi, kunci bagian, dan urutan tampil;
- Data Order untuk memeriksa detail dan mengubah status pemrosesan;
- pemeriksaan pembayaran untuk memverifikasi atau menolak bukti transfer;
- Rekening Bank untuk mengatur rekening tujuan transfer;
- tombol Lihat Website untuk membuka halaman publik di tab baru.

Setiap penghapusan meminta konfirmasi terlebih dahulu. Daftar yang panjang memakai pagination, yaitu pembagian data ke beberapa halaman, mirip memisahkan topping ke beberapa wadah supaya meja tetap rapi.

## Alur komunikasi dengan backend

Frontend memakai Axios untuk bertukar data. Axios adalah kurir digital: ia membawa permintaan dari halaman yang sedang dibuka, lalu mengantar jawaban backend kembali ke Vue.

Contoh ketika admin menambah produk:

1. Admin mengisi nama, harga, deskripsi, dan gambar.
2. Frontend mengirim formulir ke backend.
3. Backend memeriksa isinya dan menyimpan data.
4. Jika ada bagian yang salah, frontend menampilkan pesan tepat di kolom terkait.
5. Jika berhasil, admin kembali ke daftar produk dan melihat pemberitahuan sukses.

Status login disimpan dalam state Vue sederhana melalui composable. Composable adalah kotak alat bersama: halaman login, navigasi, profil, dan panel admin mengambil informasi pengguna dari tempat yang sama. Aplikasi ini tidak memakai Pinia.

## Penjagaan halaman

Router adalah pengatur jalan di dalam aplikasi. Ia memastikan:

- pengunjung yang belum login diarahkan ke halaman login saat membuka profil;
- pengguna biasa tidak dapat membuka panel admin;
- admin yang sudah login tidak perlu kembali ke halaman login admin;
- member yang sudah login diarahkan dari halaman login ke profilnya;
- alamat yang tidak dikenal menampilkan halaman Tidak Ditemukan.

Frontend melakukan penjagaan tampilan, sedangkan keputusan izin akhir tetap diperiksa backend. Ibarat kos, frontend adalah pagar depan dan backend adalah kunci kamar. Dua-duanya tetap dibutuhkan.

## Animasi katalog

Kartu produk memakai AOS, yaitu alat untuk memberi animasi saat elemen masuk ke layar. Karena data produk datang beberapa saat setelah halaman terbuka, aplikasi menunggu Vue selesai menggambar kartu, lalu menyegarkan AOS. Tanpa langkah ini, kartunya bisa ada tetapi masih transparan.

Pengguna yang mengaktifkan pengurangan gerakan pada perangkatnya tidak akan dipaksa melihat animasi.

## Menjalankan aplikasi

### Kebutuhan awal

- Node.js yang mendukung Vite 8;
- npm;
- `florist-backend` yang sudah terpasang di Laravel Herd dengan alamat `http://sudut-flora.test`.

### 1. Memasang kebutuhan frontend

```bash
cp .env.example .env
npm install
```

`npm install` mengambil semua kebutuhan tampilan, seperti Vue, Axios, Bootstrap, dan AOS. Ibarat belanja bahan seblak, langkah ini cukup dilakukan saat pertama kali atau ketika daftar bahan di `package.json` berubah.

### 2. Menghubungkan frontend ke backend Herd

Ubah isi `.env` frontend menjadi:

```env
VITE_API_BASE_URL=http://sudut-flora.test
```

Backend juga perlu mengizinkan alamat frontend `http://app.sudut-flora.test:5173`. Pengaturannya dijelaskan dalam README `florist-backend`.

### 3. Menyalakan frontend

```bash
npm run dev -- --host app.sudut-flora.test
```

Setelah terminal menampilkan bahwa Vite siap, buka:

```text
http://app.sudut-flora.test:5173
```

Terminal yang menjalankan Vite harus tetap terbuka selama frontend dipakai. Untuk menghentikannya, tekan `Control + C`.

Urutan menjalankan aplikasi sehari-hari:

1. Pastikan Laravel Herd aktif.
2. Pastikan `http://sudut-flora.test/up` dapat dibuka.
3. Masuk ke folder `florist-frontend` melalui terminal.
4. Jalankan `npm run dev -- --host app.sudut-flora.test`.
5. Buka `http://app.sudut-flora.test:5173` di browser.

Gunakan alamat tersebut, bukan `localhost:5173`, supaya sesi login member dan admin tetap dikenali.

### Membuat versi siap tayang

```bash
npm run build
```

Hasilnya masuk ke folder `dist`. Build adalah proses membungkus kode menjadi versi yang lebih ringkas dan siap disajikan oleh server web.

Untuk mencoba hasil build secara lokal:

```bash
npm run preview -- --host app.sudut-flora.test
```

Versi preview biasanya terbuka pada port `4173`. Jika login akan diuji melalui preview, tambahkan `app.sudut-flora.test:4173` ke `FRONTEND_URLS` dan `SANCTUM_STATEFUL_DOMAINS` pada backend.

## Struktur folder sederhana

| Lokasi | Isinya |
| --- | --- |
| `src/views/public` | Halaman yang dipakai pengunjung dan member. |
| `src/views/admin` | Halaman login dan pengelolaan admin. |
| `src/components` | Bagian tampilan yang dipakai berulang, seperti kartu produk dan sidebar. |
| `src/layouts` | Kerangka halaman publik dan admin. |
| `src/services/api.js` | Daftar komunikasi yang tersedia dengan backend. |
| `src/lib/http.js` | Pengaturan Axios serta cara membaca pesan kesalahan. |
| `src/composables` | Logika bersama untuk login dan formulir. |
| `src/router` | Daftar alamat halaman dan aturan siapa yang boleh membukanya. |
| `src/config/resources.js` | Susunan tabel dan formulir untuk data yang dikelola admin. |
| `src/styles` | Tampilan halaman publik dan admin. |
| `public/assets/images` | Gambar statis yang dipakai langsung oleh frontend. |

## Batas aplikasi saat ini

- Total checkout belum menghitung ongkos kirim.
- Profil member belum dapat diedit.
- Pesan dan kesan yang dikirim pengunjung tidak otomatis tampil di beranda.
- Angka pencapaian dan kartu reputasi pada beranda masih berupa isi statis di frontend, bukan data yang diambil dari backend.
- Aplikasi ini berupa SPA. SPA berarti perpindahan halaman terasa seperti mengganti bagian dalam satu buku tanpa mengambil buku baru dari rak setiap kali. Konsekuensinya, server hosting perlu diarahkan kembali ke `index.html` untuk alamat seperti `/products` atau `/admin`.

## Pasangan aplikasi

Data, login, penyimpanan gambar produk, dan aturan akses berada di repository `florist-backend`. Saat pengembangan lokal, backend dan frontend harus menyala bersamaan.
