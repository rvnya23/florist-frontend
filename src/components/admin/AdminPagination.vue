<script setup>
defineProps({ meta: { type: Object, required: true } })
defineEmits(['change'])
</script>

<template>
  <nav v-if="meta.last_page > 1" class="admin-pagination p-3" aria-label="Navigasi halaman">
    <button
      type="button"
      class="page-link"
      :disabled="meta.current_page === 1"
      @click="$emit('change', meta.current_page - 1)"
    >
      Sebelumnya
    </button>
    <span>Halaman {{ meta.current_page }} dari {{ meta.last_page }}</span>
    <button
      type="button"
      class="page-link"
      :disabled="meta.current_page === meta.last_page"
      @click="$emit('change', meta.current_page + 1)"
    >
      Berikutnya
    </button>
  </nav>
</template>
