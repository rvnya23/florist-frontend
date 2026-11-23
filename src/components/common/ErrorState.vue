<script setup>
defineProps({ message: { type: String, required: true } })
defineEmits(['retry'])
</script>

<template>
  <div class="state-message state-message-error" role="alert">
    <span>{{ message }}</span>
    <button type="button" class="btn btn-admin-outline" @click="$emit('retry')">Coba Lagi</button>
  </div>
</template>
