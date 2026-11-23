<script setup>
import { onMounted, reactive, ref } from 'vue'
import AdminPagination from '../../components/admin/AdminPagination.vue'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { getErrorMessage } from '../../lib/http'
import { formatDate, orderStatusLabels, paymentStatusLabels } from '../../lib/orders'
import { adminApi } from '../../services/api'

const orders = ref([])
const meta = ref(null)
const loading = ref(true)
const error = ref('')
const filters = reactive({ status: '', payment_status: '' })

const loadOrders = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const response = await adminApi.orders({ page, ...filters })
    orders.value = response.data
    meta.value = response.meta
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Data order belum dapat dimuat.')
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.status = ''
  filters.payment_status = ''
  loadOrders()
}

onMounted(loadOrders)
</script>

<template>
  <section class="admin-card mb-4">
    <form class="row g-3 align-items-end" @submit.prevent="loadOrders()">
      <div class="col-md-4">
        <label for="order-status-filter" class="form-label">Status Order</label>
        <select id="order-status-filter" v-model="filters.status" class="form-select">
          <option value="">Semua status</option>
          <option v-for="(label, value) in orderStatusLabels" :key="value" :value="value">{{ label }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="payment-status-filter" class="form-label">Status Pembayaran</label>
        <select id="payment-status-filter" v-model="filters.payment_status" class="form-select">
          <option value="">Semua status</option>
          <option v-for="(label, value) in paymentStatusLabels" :key="value" :value="value">{{ label }}</option>
        </select>
      </div>
      <div class="col-md-4 d-flex gap-2">
        <button type="submit" class="btn btn-admin-primary">Terapkan</button>
        <button type="button" class="btn btn-admin-outline" @click="resetFilters">Reset</button>
      </div>
    </form>
  </section>

  <LoadingState v-if="loading" label="Memuat data order..." />
  <ErrorState v-else-if="error" :message="error" @retry="loadOrders()" />
  <section v-else class="admin-card p-0">
    <div v-if="orders.length" class="table-responsive">
      <table class="admin-table">
        <thead><tr><th>Kode</th><th>Member</th><th>Tanggal</th><th>Total</th><th>Status Order</th><th>Pembayaran</th><th>Aksi</th></tr></thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td><code>{{ order.order_code }}</code></td>
            <td>{{ order.member.name }}</td>
            <td>{{ formatDate(order.order_date) }}</td>
            <td><strong>{{ order.formatted_total_harga }}</strong></td>
            <td>{{ orderStatusLabels[order.status] }}</td>
            <td>{{ order.payment ? paymentStatusLabels[order.payment.status] : 'Belum Dibayar' }}</td>
            <td><RouterLink :to="{ name: 'admin.orders.show', params: { id: order.id } }" class="btn btn-admin-secondary">Detail</RouterLink></td>
          </tr>
        </tbody>
      </table>
      <AdminPagination v-if="meta" :meta="meta" @change="loadOrders" />
    </div>
    <div v-else class="empty-state"><i class="bi bi-bag d-block" aria-hidden="true"></i><p>Belum ada order yang sesuai filter.</p></div>
  </section>
</template>
