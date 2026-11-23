<script setup>
import { onMounted, ref } from 'vue'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { useCart } from '../../composables/useCart'
import { getErrorMessage } from '../../lib/http'

const { cart, loadCart, updateItem, removeItem } = useCart()
const error = ref('')
const processingId = ref(null)

const load = async () => {
  error.value = ''
  try {
    await loadCart(true)
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Keranjang belum dapat dimuat.')
  }
}

const changeQuantity = async (item, quantity) => {
  if (quantity < 1 || quantity > 99 || processingId.value) return
  processingId.value = item.id
  error.value = ''

  try {
    await updateItem(item.id, quantity)
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Jumlah produk belum dapat diperbarui.')
  } finally {
    processingId.value = null
  }
}

const remove = async (item) => {
  if (!window.confirm(`Hapus ${item.product.name} dari keranjang?`)) return
  processingId.value = item.id
  error.value = ''

  try {
    await removeItem(item.id)
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Produk belum dapat dihapus dari keranjang.')
  } finally {
    processingId.value = null
  }
}

onMounted(load)
</script>

<template>
  <main class="container my-5 min-vh-100">
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5">
      <div>
        <h1 class="display-4 mb-2">Keranjang</h1>
        <p class="mb-0">Atur jumlah bunga sebelum melanjutkan ke checkout.</p>
      </div>
      <RouterLink :to="{ name: 'products' }" class="text-color-main-darker">Tambah Bunga Lain</RouterLink>
    </div>

    <LoadingState v-if="cart.loading && !cart.data" label="Memuat keranjang..." />
    <ErrorState v-else-if="error && !cart.data" :message="error" @retry="load" />
    <section v-else-if="!cart.data?.items.length" class="state-message bg-color-white rounded-4 flex-column">
      <p class="mb-0">Keranjang masih kosong.</p>
      <RouterLink :to="{ name: 'products' }" class="btn bg-color-dark text-color-white px-4 py-3">Pilih Bunga</RouterLink>
    </section>
    <div v-else class="row g-4">
      <section class="col-lg-8" aria-label="Produk dalam keranjang">
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <article v-for="item in cart.data.items" :key="item.id" class="cart-item bg-color-white rounded-4 p-3 mb-3">
          <img :src="item.product.image_url" :alt="item.product.name" width="120" height="120" />
          <div class="flex-grow-1">
            <h2 class="h5">{{ item.product.name }}</h2>
            <p class="mb-2">{{ item.product.formatted_price }}</p>
            <div class="d-flex flex-wrap align-items-center gap-2">
              <button type="button" class="btn btn-outline-dark cart-quantity-button" :disabled="item.quantity <= 1 || processingId === item.id" aria-label="Kurangi jumlah" @click="changeQuantity(item, item.quantity - 1)">−</button>
              <span class="cart-quantity" aria-label="Jumlah produk">{{ item.quantity }}</span>
              <button type="button" class="btn btn-outline-dark cart-quantity-button" :disabled="item.quantity >= 99 || processingId === item.id" aria-label="Tambah jumlah" @click="changeQuantity(item, item.quantity + 1)">+</button>
              <button type="button" class="btn btn-link text-danger ms-sm-2" :disabled="processingId === item.id" @click="remove(item)">Hapus</button>
            </div>
          </div>
          <strong>{{ item.formatted_subtotal }}</strong>
        </article>
      </section>

      <aside class="col-lg-4">
        <div class="checkout-summary bg-color-white rounded-4 p-4">
          <h2 class="h4 mb-4">Ringkasan</h2>
          <div class="d-flex justify-content-between mb-3"><span>Total produk</span><span>{{ cart.data.item_count }}</span></div>
          <div class="d-flex justify-content-between border-top pt-3 mb-4"><strong>Total</strong><strong>{{ cart.data.formatted_total }}</strong></div>
          <RouterLink :to="{ name: 'checkout' }" class="btn bg-color-main-darker text-color-white w-100 py-3">Lanjut Checkout</RouterLink>
        </div>
      </aside>
    </div>
  </main>
</template>
