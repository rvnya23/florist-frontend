<script setup>
import { ref } from 'vue'
import { publicApi } from '../../services/api'
import { useApiForm } from '../../composables/useApiForm'
import { useAuth } from '../../composables/useAuth'

const { form, errors, message, submitting, submit } = useApiForm(
  { name: '', email: '', phone: '', address: '', password: '', password_confirmation: '' },
  publicApi.registerMember,
)
const { loadUser } = useAuth()
const successDialog = ref(null)

const register = async () => {
  const response = await submit()

  if (!response) return

  await loadUser(true)
  successDialog.value?.showModal()
}

const closeSuccessDialog = () => successDialog.value?.close()
</script>

<template>
  <main class="container my-5 min-vh-100">
    <h1 class="display-4 mb-5">Daftar Member</h1>

    <div v-if="message && Object.keys(errors).length" class="alert alert-danger" role="alert">
      {{ message }}
    </div>

    <section class="form-daftar-member rounded-4 p-5 bg-color-body mt-5">
      <p>Buat akun member untuk melanjutkan pembelian bunga.</p>
      <form novalidate @submit.prevent="register">
        <div class="mb-3">
          <label for="member-name" class="form-label">Nama</label>
          <input id="member-name" v-model="form.name" type="text" autocomplete="name" class="form-control" :class="{ 'is-invalid': errors.name }" required />
          <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
        </div>
        <div class="mb-3">
          <label for="member-email" class="form-label">Email</label>
          <input id="member-email" v-model="form.email" type="email" autocomplete="email" class="form-control" :class="{ 'is-invalid': errors.email }" aria-describedby="member-email-help" required />
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email[0] }}</div>
          <div id="member-email-help" class="form-text">Kami tidak akan pernah membagikan alamat email kamu kepada pihak lain.</div>
        </div>
        <div class="mb-3">
          <label for="member-phone" class="form-label">No Hp</label>
          <input id="member-phone" v-model="form.phone" type="tel" autocomplete="tel" class="form-control" :class="{ 'is-invalid': errors.phone }" required />
          <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone[0] }}</div>
        </div>
        <div class="mb-3">
          <label for="member-address" class="form-label">Alamat</label>
          <textarea id="member-address" v-model="form.address" autocomplete="street-address" class="form-control" :class="{ 'is-invalid': errors.address }" rows="3" required></textarea>
          <div v-if="errors.address" class="invalid-feedback">{{ errors.address[0] }}</div>
        </div>
        <div class="mb-3">
          <label for="member-password" class="form-label">Password</label>
          <input id="member-password" v-model="form.password" type="password" autocomplete="new-password" class="form-control" :class="{ 'is-invalid': errors.password }" minlength="8" required />
          <div v-if="errors.password" class="invalid-feedback">{{ errors.password[0] }}</div>
          <div class="form-text">Minimal 8 karakter.</div>
        </div>
        <div class="mb-3">
          <label for="member-password-confirmation" class="form-label">Konfirmasi Password</label>
          <input id="member-password-confirmation" v-model="form.password_confirmation" type="password" autocomplete="new-password" class="form-control" :class="{ 'is-invalid': errors.password_confirmation }" minlength="8" required />
          <div v-if="errors.password_confirmation" class="invalid-feedback">{{ errors.password_confirmation[0] }}</div>
        </div>
        <button type="submit" class="btn bg-color-main-darker text-color-white p-3 mt-3" :disabled="submitting">
          {{ submitting ? 'Mendaftarkan...' : 'Buat Akun' }}
        </button>
      </form>
    </section>

    <dialog ref="successDialog" class="product-dialog rounded-4" @click.self="closeSuccessDialog">
      <section class="p-5 text-center">
        <h2 class="mb-3">Selamat, Anda Telah Menjadi Member</h2>
        <p class="mb-4">Akun Anda berhasil dibuat dan sudah login.</p>
        <RouterLink
          :to="{ name: 'products' }"
          class="btn bg-color-main-darker text-color-white p-3"
          @click="closeSuccessDialog"
        >
          Lihat Koleksi Bunga
        </RouterLink>
      </section>
    </dialog>
  </main>
</template>
