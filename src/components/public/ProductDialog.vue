<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useCart } from '../../composables/useCart'
import { getErrorMessage } from '../../lib/http'

const product = ref(null)
const dialog = ref(null)
const adding = ref(false)
const message = ref('')
const error = ref('')
const route = useRoute()
const router = useRouter()
const { auth, loadUser } = useAuth()
const { addItem } = useCart()

const open = (selectedProduct) => {
  product.value = selectedProduct
  message.value = ''
  error.value = ''
  dialog.value?.showModal()
}

const close = () => dialog.value?.close()

const addToCart = async () => {
  await loadUser()

  if (!auth.user) {
    close()
    await router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  if (auth.user.role !== 'customer') {
    error.value = 'Gunakan akun member untuk menambahkan produk ke keranjang.'
    return
  }

  adding.value = true
  message.value = ''
  error.value = ''

  try {
    await addItem(product.value.id)
    message.value = `${product.value.name} ditambahkan ke keranjang.`
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Produk belum dapat ditambahkan ke keranjang.')
  } finally {
    adding.value = false
  }
}

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
        <div v-if="message" class="alert alert-success" role="status">{{ message }}</div>
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <button
            type="button"
            class="btn bg-color-dark text-color-white px-4 py-3"
            :disabled="adding"
            @click="addToCart"
          >
            {{ adding ? 'Menambahkan...' : 'Tambah ke Keranjang' }}
          </button>
          <RouterLink v-if="message" :to="{ name: 'cart' }" class="text-color-main-darker" @click="close">
            Lihat Keranjang
          </RouterLink>
        </div>
      </div>
    </article>
  </dialog>
</template>
