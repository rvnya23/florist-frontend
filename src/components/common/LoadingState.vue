<script setup>
defineProps({ label: { type: String, default: 'Memuat data...' } })
</script>

<template>
  <div class="state-message" role="status" aria-live="polite">
    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    <span>{{ label }}</span>
  </div>
</template>
