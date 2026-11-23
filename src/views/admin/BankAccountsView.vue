<script setup>
import { onMounted, reactive, ref } from 'vue'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { getErrorMessage, getValidationErrors } from '../../lib/http'
import { adminApi } from '../../services/api'

const accounts = ref([])
const loading = ref(true)
const error = ref('')
const message = ref('')
const errors = ref({})
const submitting = ref(false)
const editingId = ref(null)
const form = reactive({ nama_bank: '', nomor_rekening: '', nama_pemilik: '', is_active: true })

const resetForm = () => {
  editingId.value = null
  Object.assign(form, { nama_bank: '', nomor_rekening: '', nama_pemilik: '', is_active: true })
  errors.value = {}
}

const loadAccounts = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await adminApi.bankAccounts()
    accounts.value = response.data
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Rekening bank belum dapat dimuat.')
  } finally {
    loading.value = false
  }
}

const edit = (account) => {
  editingId.value = account.id
  Object.assign(form, {
    nama_bank: account.nama_bank,
    nomor_rekening: account.nomor_rekening,
    nama_pemilik: account.nama_pemilik,
    is_active: account.is_active,
  })
  errors.value = {}
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const submit = async () => {
  submitting.value = true
  errors.value = {}
  error.value = ''
  message.value = ''

  try {
    const response = editingId.value
      ? await adminApi.updateBankAccount(editingId.value, form)
      : await adminApi.createBankAccount(form)
    message.value = response.message
    resetForm()
    await loadAccounts()
  } catch (requestError) {
    errors.value = getValidationErrors(requestError)
    error.value = getErrorMessage(requestError, 'Rekening bank belum dapat disimpan.')
  } finally {
    submitting.value = false
  }
}

const toggleStatus = async (account) => {
  error.value = ''
  try {
    const response = await adminApi.updateBankAccountStatus(account.id, !account.is_active)
    message.value = response.message
    await loadAccounts()
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Status rekening belum dapat diperbarui.')
  }
}

onMounted(loadAccounts)
</script>

<template>
  <div v-if="message" class="alert alert-success" role="status">{{ message }}</div>
  <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

  <section class="admin-card admin-form-card mb-4">
    <h2 class="h5 mb-4">{{ editingId ? 'Edit Rekening' : 'Tambah Rekening' }}</h2>
    <form class="admin-form" novalidate @submit.prevent="submit">
      <div class="mb-3">
        <label for="bank-name" class="form-label">Nama Bank</label>
        <input id="bank-name" v-model="form.nama_bank" type="text" class="form-control" :class="{ 'is-invalid': errors.nama_bank }" required />
        <div v-if="errors.nama_bank" class="invalid-feedback">{{ errors.nama_bank[0] }}</div>
      </div>
      <div class="mb-3">
        <label for="account-number" class="form-label">Nomor Rekening</label>
        <input id="account-number" v-model="form.nomor_rekening" type="text" inputmode="numeric" class="form-control" :class="{ 'is-invalid': errors.nomor_rekening }" required />
        <div v-if="errors.nomor_rekening" class="invalid-feedback">{{ errors.nomor_rekening[0] }}</div>
      </div>
      <div class="mb-3">
        <label for="account-holder" class="form-label">Nama Pemilik</label>
        <input id="account-holder" v-model="form.nama_pemilik" type="text" class="form-control" :class="{ 'is-invalid': errors.nama_pemilik }" required />
        <div v-if="errors.nama_pemilik" class="invalid-feedback">{{ errors.nama_pemilik[0] }}</div>
      </div>
      <div class="form-check mb-4">
        <input id="account-active" v-model="form.is_active" type="checkbox" class="form-check-input" />
        <label for="account-active" class="form-check-label">Rekening aktif</label>
      </div>
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-admin-primary" :disabled="submitting">{{ submitting ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Simpan' }}</button>
        <button v-if="editingId" type="button" class="btn btn-admin-outline" @click="resetForm">Batal</button>
      </div>
    </form>
  </section>

  <LoadingState v-if="loading" label="Memuat rekening bank..." />
  <ErrorState v-else-if="error && !accounts.length" :message="error" @retry="loadAccounts" />
  <section v-else class="admin-card p-0">
    <div v-if="accounts.length" class="table-responsive">
      <table class="admin-table">
        <thead><tr><th>Bank</th><th>Nomor Rekening</th><th>Nama Pemilik</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          <tr v-for="account in accounts" :key="account.id">
            <td><strong>{{ account.nama_bank }}</strong></td>
            <td>{{ account.nomor_rekening }}</td>
            <td>{{ account.nama_pemilik }}</td>
            <td>{{ account.is_active ? 'Aktif' : 'Nonaktif' }}</td>
            <td><div class="action-buttons"><button type="button" class="btn btn-admin-secondary" @click="edit(account)">Edit</button><button type="button" class="btn btn-admin-outline" @click="toggleStatus(account)">{{ account.is_active ? 'Nonaktifkan' : 'Aktifkan' }}</button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="empty-state"><i class="bi bi-bank d-block" aria-hidden="true"></i><p>Belum ada rekening bank.</p></div>
  </section>
</template>
