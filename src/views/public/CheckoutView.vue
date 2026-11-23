<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { useAuth } from '../../composables/useAuth'
import { useCart } from '../../composables/useCart'
import { getErrorMessage, getValidationErrors } from '../../lib/http'
import { orderApi } from '../../services/api'

const router = useRouter()
const { auth } = useAuth()
const { cart, loadCart, resetCart } = useCart()
const form = reactive({ alamat_pengiriman: '', catatan: '' })
const errors = ref({})
const error = ref('')
const submitting = ref(false)

const load = async () => {
  error.value = ''
  try {
    await loadCart(true)
    form.alamat_pengiriman = auth.user?.member?.address ?? ''
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Data checkout belum dapat dimuat.')
  }
}

const checkout = async () => {
  errors.value = {}
  error.value = ''
  submitting.value = true

  try {
    const response = await orderApi.checkout(form)
    resetCart()
    await router.push({ name: 'order-detail', params: { id: response.data.id }, query: { created: '1' } })
  } catch (requestError) {
    errors.value = getValidationErrors(requestError)
    error.value = getErrorMessage(requestError, 'Order belum dapat dibuat.')
  } finally {
    submitting.value = false
  }
}

onMounted(load)
</script>

<template>
  <main class="container my-5 min-vh-100">
    <h1 class="display-4 mb-5">Checkout</h1>
    <LoadingState v-if="cart.loading && !cart.data" label="Menyiapkan checkout..." />
    <ErrorState v-else-if="error && !cart.data" :message="error" @retry="load" />
    <section v-else-if="!cart.data?.items.length" class="state-message bg-color-white rounded-4 flex-column">
      <p class="mb-0">Tidak ada produk yang dapat di-checkout.</p>
      <RouterLink :to="{ name: 'cart' }" class="btn bg-color-dark text-color-white px-4 py-3">Kembali ke Keranjang</RouterLink>
    </section>
    <form v-else class="row g-4" novalidate @submit.prevent="checkout">
      <section class="col-lg-7">
        <div class="bg-color-white rounded-4 p-4 p-md-5">
          <h2 class="h4 mb-4">Tujuan Pengiriman</h2>
          <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
          <div class="mb-3">
            <label for="checkout-address" class="form-label">Alamat Tujuan</label>
            <textarea id="checkout-address" v-model="form.alamat_pengiriman" class="form-control" :class="{ 'is-invalid': errors.alamat_pengiriman }" rows="5" required></textarea>
            <div v-if="errors.alamat_pengiriman" class="invalid-feedback">{{ errors.alamat_pengiriman[0] }}</div>
          </div>
          <div>
            <label for="checkout-note" class="form-label">Catatan (Opsional)</label>
            <textarea id="checkout-note" v-model="form.catatan" class="form-control" :class="{ 'is-invalid': errors.catatan }" rows="3"></textarea>
            <div v-if="errors.catatan" class="invalid-feedback">{{ errors.catatan[0] }}</div>
          </div>
        </div>
      </section>
      <aside class="col-lg-5">
        <div class="checkout-summary bg-color-white rounded-4 p-4">
          <h2 class="h4 mb-4">Kalkulasi Harga</h2>
          <div v-for="item in cart.data.items" :key="item.id" class="d-flex justify-content-between gap-3 mb-3">
            <span>{{ item.product.name }} × {{ item.quantity }}</span>
            <span>{{ item.formatted_subtotal }}</span>
          </div>
          <div class="d-flex justify-content-between border-top pt-3 mb-2"><strong>Total</strong><strong>{{ cart.data.formatted_total }}</strong></div>
          <p class="small text-secondary mb-4">Total hanya menghitung harga produk.</p>
          <button type="submit" class="btn bg-color-main-darker text-color-white w-100 py-3" :disabled="submitting">
            {{ submitting ? 'Membuat Order...' : 'Buat Order' }}
          </button>
        </div>
      </aside>
    </form>
  </main>
</template>
