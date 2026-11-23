<script setup>
defineProps({ open: Boolean })
defineEmits(['close'])

const links = [
  { name: 'admin.dashboard', label: 'Dashboard', icon: 'bi-grid' },
  { label: 'Kelola Data', heading: true },
  { name: 'admin.products.index', label: 'Katalog Produk', icon: 'bi-flower1' },
  { name: 'admin.members.index', label: 'Data Member', icon: 'bi-people' },
  { name: 'admin.testimonials.index', label: 'Pesan & Kesan', icon: 'bi-chat-heart' },
  { name: 'admin.about-us.index', label: 'Tentang Kami', icon: 'bi-info-circle' },
]
</script>

<template>
  <aside class="admin-sidebar" :class="{ show: open }" aria-label="Navigasi admin">
    <div class="brand">
      <span>Sudut</span><span class="brand-accent">Flora</span>
      <small class="d-block admin-brand-caption">Admin Panel</small>
    </div>

    <ul class="nav-menu">
      <template v-for="link in links" :key="link.label">
        <li v-if="link.heading" class="menu-label">{{ link.label }}</li>
        <li v-else>
          <RouterLink :to="{ name: link.name }" active-class="active" @click="$emit('close')">
            <i :class="['bi', link.icon]" aria-hidden="true"></i> {{ link.label }}
          </RouterLink>
        </li>
      </template>

      <li class="menu-label">Navigasi</li>
      <li>
        <RouterLink :to="{ name: 'home' }" target="_blank">
          <i class="bi bi-globe" aria-hidden="true"></i> Lihat Website
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>
