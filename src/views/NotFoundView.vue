<template>
  <main class="container my-5 min-vh-100 text-center py-5">
    <h1 class="display-4 mb-3">Halaman tidak ditemukan</h1>
    <p>Alamat yang kamu buka tidak tersedia.</p>
    <RouterLink :to="{ name: 'home' }" class="btn bg-color-dark text-color-white px-4 py-3">
      Kembali ke Beranda
    </RouterLink>
  </main>
</template>
