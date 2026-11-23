<script setup>
import { ref } from 'vue'

const product = ref(null)
const dialog = ref(null)

const open = (selectedProduct) => {
  product.value = selectedProduct
  dialog.value?.showModal()
}

const close = () => dialog.value?.close()

defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="product-dialog rounded-4" @click.self="close">
    <article v-if="product" class="product-dialog-content">
      <button type="button" class="product-dialog-close" aria-label="Tutup detail produk" @click="close">
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>
      <img :src="product.image_url" :alt="product.name" width="480" height="480" />
      <div>
        <h2>{{ product.name }}</h2>
        <p class="fw-bold text-color-main-darker">{{ product.formatted_price }}</p>
        <p>{{ product.description }}</p>
      </div>
    </article>
  </dialog>
</template>
