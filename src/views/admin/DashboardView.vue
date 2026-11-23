<script setup>
import { onMounted, ref } from 'vue'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { getErrorMessage } from '../../lib/http'
import { adminApi } from '../../services/api'

const stats = ref(null)
const loading = ref(true)
const error = ref('')

const loadDashboard = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await adminApi.dashboard()
    stats.value = response.data
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Ringkasan dashboard belum dapat dimuat.')
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<template>
  <LoadingState v-if="loading" label="Memuat dashboard..." />
  <ErrorState v-else-if="error" :message="error" @retry="loadDashboard" />
  <template v-else>
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="admin-card stat-card"><div class="stat-icon pink"><i class="bi bi-flower1" aria-hidden="true"></i></div><div class="stat-info"><div class="stat-value">{{ stats.products }}</div><div class="stat-label">Total Produk</div></div></div>
      </div>
      <div class="col-md-4">
        <div class="admin-card stat-card"><div class="stat-icon charcoal"><i class="bi bi-people" aria-hidden="true"></i></div><div class="stat-info"><div class="stat-value">{{ stats.members }}</div><div class="stat-label">Total Member</div></div></div>
      </div>
      <div class="col-md-4">
        <div class="admin-card stat-card"><div class="stat-icon success"><i class="bi bi-chat-heart" aria-hidden="true"></i></div><div class="stat-info"><div class="stat-value">{{ stats.testimonials }}</div><div class="stat-label">Total Testimoni</div></div></div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-sm-6 col-xl-3">
        <div class="admin-card stat-card"><div class="stat-icon charcoal"><i class="bi bi-bag" aria-hidden="true"></i></div><div class="stat-info"><div class="stat-value">{{ stats.orders }}</div><div class="stat-label">Total Order</div></div></div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="admin-card stat-card"><div class="stat-icon pink"><i class="bi bi-hourglass-split" aria-hidden="true"></i></div><div class="stat-info"><div class="stat-value">{{ stats.pending_orders }}</div><div class="stat-label">Menunggu Pembayaran</div></div></div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="admin-card stat-card"><div class="stat-icon pink"><i class="bi bi-receipt" aria-hidden="true"></i></div><div class="stat-info"><div class="stat-value">{{ stats.pending_payments }}</div><div class="stat-label">Menunggu Verifikasi</div></div></div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="admin-card stat-card"><div class="stat-icon success"><i class="bi bi-check-lg" aria-hidden="true"></i></div><div class="stat-info"><div class="stat-value">{{ stats.confirmed_orders }}</div><div class="stat-label">Order Dikonfirmasi</div></div></div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <section class="admin-card">
          <h2 class="h5 mb-3 admin-card-title">Aksi Cepat</h2>
          <div class="d-flex flex-wrap gap-2">
            <RouterLink :to="{ name: 'admin.products.create' }" class="btn btn-admin-primary"><i class="bi bi-plus-lg" aria-hidden="true"></i> Tambah Produk</RouterLink>
            <RouterLink :to="{ name: 'admin.members.index' }" class="btn btn-admin-outline"><i class="bi bi-people" aria-hidden="true"></i> Lihat Member</RouterLink>
            <RouterLink :to="{ name: 'admin.testimonials.index' }" class="btn btn-admin-outline"><i class="bi bi-chat-heart" aria-hidden="true"></i> Lihat Testimoni</RouterLink>
            <RouterLink :to="{ name: 'admin.orders.index' }" class="btn btn-admin-outline"><i class="bi bi-bag" aria-hidden="true"></i> Lihat Order</RouterLink>
          </div>
        </section>
      </div>
      <div class="col-md-6">
        <section class="admin-card">
          <h2 class="h5 mb-3 admin-card-title">Selamat Datang!</h2>
          <p class="admin-card-copy">Kelola produk, member, order, pembayaran, rekening bank, testimoni, dan halaman Tentang Kami dari panel ini.</p>
        </section>
      </div>
    </div>
  </template>
</template>
