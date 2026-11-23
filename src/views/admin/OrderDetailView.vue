<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { getErrorMessage, getValidationErrors } from '../../lib/http'
import { formatDate, orderStatusLabels, paymentStatusLabels, todayInJakarta } from '../../lib/orders'
import { adminApi } from '../../services/api'

const route = useRoute()
const order = ref(null)
const banks = ref([])
const loading = ref(true)
const processing = ref(false)
const error = ref('')
const message = ref('')
const errors = ref({})
const rejectionNote = ref('')
const paymentForm = reactive({
  rekening_bank_id: '',
  nama_pengirim: '',
  tanggal_pembayaran: todayInJakarta(),
  jumlah_pembayaran: '',
  bukti_pembayaran: null,
})

const canAddPayment = computed(
  () => order.value?.status === 'pending_payment' && (!order.value.payment || order.value.payment.status === 'rejected'),
)

const loadOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    const [orderResponse, bankResponse] = await Promise.all([
      adminApi.order(route.params.id),
      adminApi.bankAccounts(),
    ])
    order.value = orderResponse.data
    banks.value = bankResponse.data.filter((bank) => bank.is_active)
    paymentForm.jumlah_pembayaran = orderResponse.data.total_harga
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Detail order belum dapat dimuat.')
  } finally {
    loading.value = false
  }
}

const runAction = async (action) => {
  processing.value = true
  error.value = ''
  message.value = ''
  try {
    const response = await action()
    message.value = response.message
    await loadOrder()
  } catch (requestError) {
    errors.value = getValidationErrors(requestError)
    error.value = getErrorMessage(requestError, 'Perubahan belum dapat disimpan.')
  } finally {
    processing.value = false
  }
}

const updateStatus = (status) => {
  const label = orderStatusLabels[status].toLowerCase()
  if (!window.confirm(`Ubah status order menjadi ${label}?`)) return
  runAction(() => adminApi.updateOrderStatus(order.value.id, status))
}

const verifyPayment = () => {
  if (!window.confirm('Verifikasi pembayaran ini?')) return
  runAction(() => adminApi.verifyOrderPayment(order.value.id))
}

const rejectPayment = () => {
  if (!rejectionNote.value.trim()) {
    error.value = 'Catatan penolakan wajib diisi.'
    return
  }
  runAction(() => adminApi.rejectOrderPayment(order.value.id, { catatan_penolakan: rejectionNote.value }))
}

const handleProof = (event) => {
  paymentForm.bukti_pembayaran = event.target.files?.[0] ?? null
}

const addPayment = () => {
  errors.value = {}
  const payload = new FormData()
  for (const [key, value] of Object.entries(paymentForm)) {
    if (value !== null && value !== '') payload.append(key, value)
  }
  runAction(() => adminApi.addOrderPayment(order.value.id, payload))
}

onMounted(loadOrder)
</script>

<template>
  <LoadingState v-if="loading" label="Memuat detail order..." />
  <ErrorState v-else-if="error && !order" :message="error" @retry="loadOrder" />
  <template v-else-if="order">
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <RouterLink :to="{ name: 'admin.orders.index' }" class="btn btn-admin-outline mb-3">Kembali</RouterLink>
        <h2 class="h4 mb-1">{{ order.order_code }}</h2>
        <p class="admin-card-copy">{{ formatDate(order.order_date) }}</p>
      </div>
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <span class="admin-status-label">{{ orderStatusLabels[order.status] }}</span>
        <button v-if="order.status === 'pending_payment'" type="button" class="btn btn-admin-danger" :disabled="processing" @click="updateStatus('cancelled')">Batalkan Order</button>
        <button v-if="order.status === 'confirmed'" type="button" class="btn btn-admin-primary" :disabled="processing" @click="updateStatus('completed')">Tandai Selesai</button>
        <button v-if="order.status === 'confirmed'" type="button" class="btn btn-admin-danger" :disabled="processing" @click="updateStatus('cancelled')">Batalkan Order</button>
      </div>
    </div>

    <div v-if="message" class="alert alert-success" role="status">{{ message }}</div>
    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <div class="row g-4">
      <div class="col-xl-8 d-grid gap-4">
        <section class="admin-card">
          <h3 class="h5 mb-3">Member dan Pengiriman</h3>
          <dl class="admin-detail-grid mb-0">
            <dt>Nama</dt><dd>{{ order.member.name }}</dd>
            <dt>Email</dt><dd>{{ order.member.email }}</dd>
            <dt>No. HP</dt><dd>{{ order.member.phone }}</dd>
            <dt>Alamat</dt><dd>{{ order.alamat_pengiriman }}</dd>
            <dt>Catatan</dt><dd>{{ order.catatan || '-' }}</dd>
          </dl>
        </section>

        <section class="admin-card p-0">
          <div class="p-4 pb-2"><h3 class="h5">Produk</h3></div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead><tr><th>Produk</th><th>Harga</th><th>Jumlah</th><th>Subtotal</th></tr></thead>
              <tbody>
                <tr v-for="detail in order.details" :key="detail.id">
                  <td><div class="d-flex align-items-center gap-2"><img :src="detail.product.image_url" :alt="detail.product.name" class="product-thumb" width="50" height="50" /><strong>{{ detail.product.name }}</strong></div></td>
                  <td>{{ detail.formatted_harga_satuan }}</td><td>{{ detail.jumlah }}</td><td>{{ detail.formatted_subtotal }}</td>
                </tr>
              </tbody>
              <tfoot><tr><td colspan="3" class="text-end p-3"><strong>Total</strong></td><td class="p-3"><strong>{{ order.formatted_total_harga }}</strong></td></tr></tfoot>
            </table>
          </div>
        </section>

        <section v-if="order.payment" class="admin-card">
          <div class="d-flex flex-wrap justify-content-between gap-2 mb-3">
            <h3 class="h5 mb-0">Pembayaran</h3>
            <span class="admin-status-label">{{ paymentStatusLabels[order.payment.status] }}</span>
          </div>
          <div class="row g-4">
            <div class="col-md-7">
              <dl class="admin-detail-grid mb-0">
                <dt>Kode</dt><dd>{{ order.payment.kode_pembayaran }}</dd>
                <dt>Rekening</dt><dd>{{ order.payment.rekening_bank.nama_bank }} · {{ order.payment.rekening_bank.nomor_rekening }}</dd>
                <dt>Pengirim</dt><dd>{{ order.payment.nama_pengirim }}</dd>
                <dt>Tanggal</dt><dd>{{ formatDate(order.payment.tanggal_pembayaran) }}</dd>
                <dt>Jumlah</dt><dd>{{ order.payment.formatted_jumlah_pembayaran }}</dd>
              </dl>
              <div v-if="order.payment.status === 'rejected'" class="alert alert-danger mt-3 mb-0">{{ order.payment.catatan_penolakan }}</div>
            </div>
            <div class="col-md-5">
              <a :href="order.payment.bukti_pembayaran_url" target="_blank" rel="noopener">
                <img :src="order.payment.bukti_pembayaran_url" alt="Bukti transfer" class="admin-payment-proof" width="360" height="240" />
              </a>
            </div>
          </div>

          <div v-if="order.payment.status === 'pending'" class="border-top mt-4 pt-4">
            <div class="mb-3">
              <label for="rejection-note" class="form-label">Catatan Penolakan</label>
              <textarea id="rejection-note" v-model="rejectionNote" class="form-control" rows="3" placeholder="Isi jika pembayaran ditolak"></textarea>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <button type="button" class="btn btn-admin-primary" :disabled="processing" @click="verifyPayment">Verifikasi Pembayaran</button>
              <button type="button" class="btn btn-admin-danger" :disabled="processing" @click="rejectPayment">Tolak Pembayaran</button>
            </div>
          </div>
        </section>
      </div>

      <aside class="col-xl-4">
        <section v-if="canAddPayment" class="admin-card">
          <h3 class="h5 mb-2">Input Pembayaran</h3>
          <p class="admin-card-copy mb-4">Gunakan form ini jika admin mengunggah bukti atas nama member.</p>
          <p v-if="banks.length === 0" class="alert alert-warning">Aktifkan rekening bank sebelum menginput pembayaran.</p>
          <form v-else class="admin-form" novalidate @submit.prevent="addPayment">
            <div class="mb-3">
              <label for="admin-payment-bank" class="form-label">Rekening Tujuan</label>
              <select id="admin-payment-bank" v-model="paymentForm.rekening_bank_id" class="form-select" :class="{ 'is-invalid': errors.rekening_bank_id }" required>
                <option value="" disabled>Pilih rekening</option>
                <option v-for="bank in banks" :key="bank.id" :value="bank.id">{{ bank.nama_bank }} · {{ bank.nomor_rekening }}</option>
              </select>
              <div v-if="errors.rekening_bank_id" class="invalid-feedback">{{ errors.rekening_bank_id[0] }}</div>
            </div>
            <div class="mb-3"><label for="admin-payment-sender" class="form-label">Nama Pengirim</label><input id="admin-payment-sender" v-model="paymentForm.nama_pengirim" type="text" class="form-control" :class="{ 'is-invalid': errors.nama_pengirim }" required /><div v-if="errors.nama_pengirim" class="invalid-feedback">{{ errors.nama_pengirim[0] }}</div></div>
            <div class="mb-3"><label for="admin-payment-date" class="form-label">Tanggal Pembayaran</label><input id="admin-payment-date" v-model="paymentForm.tanggal_pembayaran" type="date" class="form-control" :class="{ 'is-invalid': errors.tanggal_pembayaran }" :max="todayInJakarta()" required /><div v-if="errors.tanggal_pembayaran" class="invalid-feedback">{{ errors.tanggal_pembayaran[0] }}</div></div>
            <div class="mb-3"><label for="admin-payment-amount" class="form-label">Jumlah Pembayaran</label><input id="admin-payment-amount" v-model="paymentForm.jumlah_pembayaran" type="number" min="1" class="form-control" :class="{ 'is-invalid': errors.jumlah_pembayaran }" required /><div v-if="errors.jumlah_pembayaran" class="invalid-feedback">{{ errors.jumlah_pembayaran[0] }}</div></div>
            <div class="mb-4"><label for="admin-payment-proof" class="form-label">Bukti Transfer</label><input id="admin-payment-proof" type="file" accept="image/jpeg,image/png,image/webp" class="form-control" :class="{ 'is-invalid': errors.bukti_pembayaran }" required @change="handleProof" /><div v-if="errors.bukti_pembayaran" class="invalid-feedback">{{ errors.bukti_pembayaran[0] }}</div></div>
            <button type="submit" class="btn btn-admin-primary w-100 justify-content-center" :disabled="processing">{{ processing ? 'Menyimpan...' : 'Simpan Pembayaran' }}</button>
          </form>
        </section>
      </aside>
    </div>
  </template>
</template>
