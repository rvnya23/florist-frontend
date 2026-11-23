<script setup>
import { onMounted, ref } from 'vue'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { getErrorMessage } from '../../lib/http'
import { formatDate, orderStatusLabels, paymentStatusLabels } from '../../lib/orders'
import { orderApi } from '../../services/api'

const orders = ref([])
const loading = ref(true)
const error = ref('')

const loadOrders = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await orderApi.list()
    orders.value = response.data
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Riwayat order belum dapat dimuat.')
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)
</script>

<template>
  <main class="container my-5 min-vh-100">
    <h1 class="display-4 mb-5">Riwayat Order</h1>
    <LoadingState v-if="loading" label="Memuat riwayat order..." />
    <ErrorState v-else-if="error" :message="error" @retry="loadOrders" />
    <section v-else-if="orders.length === 0" class="state-message bg-color-white rounded-4 flex-column">
      <p class="mb-0">Belum ada order.</p>
      <RouterLink :to="{ name: 'products' }" class="btn bg-color-dark text-color-white px-4 py-3">Pilih Bunga</RouterLink>
    </section>
    <section v-else class="d-grid gap-3" aria-label="Daftar order">
      <article v-for="order in orders" :key="order.id" class="order-list-item bg-color-white rounded-4 p-4">
        <div>
          <p class="small text-secondary mb-1">{{ formatDate(order.order_date) }}</p>
          <h2 class="h5 mb-2">{{ order.order_code }}</h2>
          <p class="mb-0">{{ order.details.length }} jenis produk</p>
        </div>
        <div>
          <span class="order-status">{{ orderStatusLabels[order.status] }}</span>
          <p v-if="order.payment" class="small mb-0 mt-2">Pembayaran: {{ paymentStatusLabels[order.payment.status] }}</p>
        </div>
        <strong>{{ order.formatted_total_harga }}</strong>
        <RouterLink :to="{ name: 'order-detail', params: { id: order.id } }" class="btn btn-outline-dark">Lihat Detail</RouterLink>
      </article>
    </section>
  </main>
</template>
