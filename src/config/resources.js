export const resourceConfigs = {
  products: {
    title: 'Katalog Produk',
    singular: 'Produk',
    columns: [
      { key: 'image_url', label: 'Gambar', type: 'image' },
      { key: 'name', label: 'Nama Produk', strong: true },
      { key: 'formatted_price', label: 'Harga' },
      { key: 'description', label: 'Deskripsi', truncate: true },
    ],
    fields: [
      { key: 'name', label: 'Nama Produk', type: 'text', required: true },
      { key: 'price', label: 'Harga (Rp)', type: 'number', min: 0, required: true, help: 'Masukkan harga dalam satuan Rupiah tanpa titik. Contoh: 367000' },
      { key: 'description', label: 'Deskripsi', type: 'textarea', rows: 4, required: true },
      { key: 'image', label: 'Gambar Produk', type: 'file', accept: 'image/*', required: true, help: 'Format: JPG, JPEG, PNG, WEBP. Maks: 2MB.' },
    ],
  },
  members: {
    title: 'Data Member',
    singular: 'Member',
    columns: [
      { key: 'name', label: 'Nama', strong: true },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'No HP' },
      { key: 'address', label: 'Alamat' },
      { key: 'created_at', label: 'Terdaftar', type: 'date' },
    ],
    fields: [
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'No HP', type: 'tel', required: true },
      { key: 'address', label: 'Alamat', type: 'textarea', rows: 3 },
    ],
  },
  testimonials: {
    title: 'Data Pesan & Kesan',
    singular: 'Testimoni',
    columns: [
      { key: 'name', label: 'Nama', strong: true },
      { key: 'email', label: 'Email' },
      { key: 'message', label: 'Pesan', truncate: true },
      { key: 'created_at', label: 'Tanggal', type: 'date' },
    ],
    fields: [
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'message', label: 'Pesan & Kesan', type: 'textarea', rows: 4, required: true },
    ],
  },
  'about-us': {
    title: 'Tentang Kami',
    singular: 'Section',
    columns: [
      { key: 'sort_order', label: 'Urutan' },
      { key: 'section_key', label: 'Key', type: 'code' },
      { key: 'title', label: 'Judul', strong: true },
      { key: 'content', label: 'Konten', truncate: true },
    ],
    fields: [
      { key: 'section_key', label: 'Section Key', type: 'text', required: true, help: 'Identifier unik, contoh: tentang, layanan, keunggulan, filosofi, komitmen' },
      { key: 'title', label: 'Judul', type: 'text', required: true },
      { key: 'content', label: 'Konten', type: 'textarea', rows: 6, required: true, help: 'Gunakan baris baru untuk memisahkan paragraf.' },
      { key: 'sort_order', label: 'Urutan Tampil', type: 'number', min: 0, required: true, default: 0 },
    ],
  },
}
