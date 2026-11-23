<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { getErrorMessage, getValidationErrors } from '../../lib/http'
import { formatDate, orderStatusLabels, paymentStatusLabels, todayInJakarta } from '../../lib/orders'
import { orderApi } from '../../services/api'

const route = useRoute()
const order = ref(null)
const banks = ref([])
const loading = ref(true)
const error = ref('')
const paymentError = ref('')
const paymentMessage = ref('')
const errors = ref({})
const submitting = ref(false)
const form = reactive({
  rekening_bank_id: '',
  nama_pengirim: '',
  tanggal_pembayaran: todayInJakarta(),
  jumlah_pembayaran: '',
  bukti_pembayaran: null,
})

const canSubmitPayment = computed(
  () => order.value?.status === 'pending_payment' && (!order.value.payment || order.value.payment.status === 'rejected'),
)

const load = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await orderApi.find(route.params.id)
    order.value = response.data
    form.jumlah_pembayaran = response.data.total_harga

    if (canSubmitPayment.value) {
      const bankResponse = await orderApi.bankAccounts()
      banks.value = bankResponse.data
    }
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Detail order belum dapat dimuat.')
  } finally {
    loading.value = false
  }
}

const handleProof = (event) => {
  form.bukti_pembayaran = event.target.files?.[0] ?? null
}

const submitPayment = async () => {
  errors.value = {}
  paymentError.value = ''
  paymentMessage.value = ''
  submitting.value = true

  const payload = new FormData()
  for (const [key, value] of Object.entries(form)) {
    if (value !== null && value !== '') payload.append(key, value)
  }

  try {
    const response = await orderApi.submitPayment(order.value.id, payload)
    paymentMessage.value = response.message
    await load()
  } catch (requestError) {
    errors.value = getValidationErrors(requestError)
    paymentError.value = getErrorMessage(requestError, 'Bukti pembayaran belum dapat dikirim.')
  } finally {
    submitting.value = false
  }
}

onMounted(load)
</script>

<template>
  <main class="container my-5 min-vh-100">
    <LoadingState v-if="loading" label="Memuat detail order..." />
    <ErrorState v-else-if="error" :message="error" @retry="load" />
    <template v-else-if="order">
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-5">
        <div>
          <RouterLink :to="{ name: 'orders' }" class="text-color-main-darker">Kembali ke Riwayat</RouterLink>
          <h1 class="display-5 mt-3 mb-2">{{ order.order_code }}</h1>
          <p class="mb-0">Dibuat {{ formatDate(order.order_date) }}</p>
        </div>
        <span class="order-status">{{ orderStatusLabels[order.status] }}</span>
      </div>

      <div v-if="route.query.created === '1'" class="alert alert-success" role="status">
        Order berhasil dibuat. Kamu dapat membayar sekarang atau kembali lagi nanti.
      </div>
      <div v-if="paymentMessage" class="alert alert-success" role="status">{{ paymentMessage }}</div>

      <div class="row g-4">
        <div class="col-lg-7 d-grid gap-4">
          <section class="bg-color-white rounded-4 p-4">
            <h2 class="h4 mb-4">Produk</h2>
            <article v-for="detail in order.details" :key="detail.id" class="order-product-row">
              <img :src="detail.product.image_url" :alt="detail.product.name" width="88" height="88" />
              <div class="flex-grow-1">
                <h3 class="h6 mb-1">{{ detail.product.name }}</h3>
                <p class="mb-0">{{ detail.formatted_harga_satuan }} × {{ detail.jumlah }}</p>
              </div>
              <strong>{{ detail.formatted_subtotal }}</strong>
            </article>
            <div class="d-flex justify-content-between border-top pt-3 mt-3"><strong>Total</strong><strong>{{ order.formatted_total_harga }}</strong></div>
          </section>

          <section class="bg-color-white rounded-4 p-4">
            <h2 class="h4 mb-3">Tujuan Pengiriman</h2>
            <p class="mb-2">{{ order.alamat_pengiriman }}</p>
            <p v-if="order.catatan" class="small text-secondary mb-0">Catatan: {{ order.catatan }}</p>
          </section>

          <section v-if="order.payment" class="bg-color-white rounded-4 p-4">
            <div class="d-flex flex-wrap justify-content-between gap-2 mb-3">
              <h2 class="h4 mb-0">Pembayaran</h2>
              <span class="order-status">{{ paymentStatusLabels[order.payment.status] }}</span>
            </div>
            <dl class="payment-details mb-0">
              <dt>Rekening tujuan</dt><dd>{{ order.payment.rekening_bank.nama_bank }} · {{ order.payment.rekening_bank.nomor_rekening }}</dd>
              <dt>Nama pengirim</dt><dd>{{ order.payment.nama_pengirim }}</dd>
              <dt>Tanggal pembayaran</dt><dd>{{ formatDate(order.payment.tanggal_pembayaran) }}</dd>
              <dt>Jumlah pembayaran</dt><dd>{{ order.payment.formatted_jumlah_pembayaran }}</dd>
            </dl>
            <a :href="order.payment.bukti_pembayaran_url" target="_blank" rel="noopener" class="d-inline-block mt-3 text-color-main-darker">Lihat Bukti Transfer</a>
            <div v-if="order.payment.status === 'rejected'" class="alert alert-danger mt-3 mb-0" role="alert">
              {{ order.payment.catatan_penolakan }}
            </div>
          </section>
        </div>

        <aside class="col-lg-5">
          <section v-if="canSubmitPayment" class="checkout-summary bg-color-white rounded-4 p-4">
            <h2 class="h4 mb-2">{{ order.payment?.status === 'rejected' ? 'Kirim Ulang Pembayaran' : 'Upload Bukti Bayar' }}</h2>
            <p class="small text-secondary mb-4">Pilih rekening yang kamu gunakan sebagai tujuan transfer.</p>
            <div v-if="paymentError" class="alert alert-danger" role="alert">{{ paymentError }}</div>
            <p v-if="banks.length === 0" class="alert alert-warning">Belum ada rekening tujuan yang aktif. Silakan bayar nanti.</p>
            <form v-else novalidate @submit.prevent="submitPayment">
              <div class="mb-3">
                <label for="payment-bank" class="form-label">Rekening Tujuan</label>
                <select id="payment-bank" v-model="form.rekening_bank_id" class="form-select" :class="{ 'is-invalid': errors.rekening_bank_id }" required>
                  <option value="" disabled>Pilih rekening</option>
                  <option v-for="bank in banks" :key="bank.id" :value="bank.id">{{ bank.nama_bank }} · {{ bank.nomor_rekening }} · {{ bank.nama_pemilik }}</option>
                </select>
                <div v-if="errors.rekening_bank_id" class="invalid-feedback">{{ errors.rekening_bank_id[0] }}</div>
              </div>
              <div class="mb-3">
                <label for="payment-sender" class="form-label">Nama Pengirim</label>
                <input id="payment-sender" v-model="form.nama_pengirim" type="text" class="form-control" :class="{ 'is-invalid': errors.nama_pengirim }" required />
                <div v-if="errors.nama_pengirim" class="invalid-feedback">{{ errors.nama_pengirim[0] }}</div>
              </div>
              <div class="mb-3">
                <label for="payment-date" class="form-label">Tanggal Pembayaran</label>
                <input id="payment-date" v-model="form.tanggal_pembayaran" type="date" class="form-control" :class="{ 'is-invalid': errors.tanggal_pembayaran }" :max="todayInJakarta()" required />
                <div v-if="errors.tanggal_pembayaran" class="invalid-feedback">{{ errors.tanggal_pembayaran[0] }}</div>
              </div>
              <div class="mb-3">
                <label for="payment-amount" class="form-label">Jumlah Pembayaran</label>
                <input id="payment-amount" v-model="form.jumlah_pembayaran" type="number" class="form-control" :class="{ 'is-invalid': errors.jumlah_pembayaran }" min="1" required />
                <div v-if="errors.jumlah_pembayaran" class="invalid-feedback">{{ errors.jumlah_pembayaran[0] }}</div>
              </div>
              <div class="mb-4">
                <label for="payment-proof" class="form-label">Bukti Transfer</label>
                <input id="payment-proof" type="file" class="form-control" :class="{ 'is-invalid': errors.bukti_pembayaran }" accept="image/jpeg,image/png,image/webp" required @change="handleProof" />
                <div v-if="errors.bukti_pembayaran" class="invalid-feedback">{{ errors.bukti_pembayaran[0] }}</div>
                <div class="form-text">JPG, PNG, atau WebP. Maksimal 2 MB.</div>
              </div>
              <button type="submit" class="btn bg-color-main-darker text-color-white w-100 py-3" :disabled="submitting">
                {{ submitting ? 'Mengirim...' : 'Kirim Bukti Pembayaran' }}
              </button>
            </form>
          </section>
          <section v-else-if="order.payment?.status === 'pending'" class="checkout-summary bg-color-white rounded-4 p-4">
            <h2 class="h4">Menunggu Verifikasi</h2>
            <p class="mb-0">Admin sedang memeriksa bukti pembayaranmu.</p>
          </section>
        </aside>
      </div>
    </template>
  </main>
</template>
