<template>
  <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 mt-4 border-top bg-color-main">
    <section class="container d-flex justify-content-between align-items-center">
      <div class="col-md-4 d-flex align-items-center">
        <RouterLink
          :to="{ name: 'home' }"
          class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
          aria-label="Beranda Sudut Flora"
        >
          <span class="mb-3 mb-md-0 text-body-secondary">&copy; 2026 Sudut Flora</span>
        </RouterLink>
      </div>
      <div class="nav col-md-4 justify-content-end d-flex gap-3" aria-label="Media sosial">
        <span class="text-body-secondary" title="Instagram Sudut Flora" aria-label="Instagram Sudut Flora">
          <i class="bi bi-instagram" aria-hidden="true"></i>
        </span>
        <span class="text-body-secondary" title="WhatsApp Sudut Flora" aria-label="WhatsApp Sudut Flora">
          <i class="bi bi-whatsapp" aria-hidden="true"></i>
        </span>
      </div>
    </section>
  </footer>
</template>
