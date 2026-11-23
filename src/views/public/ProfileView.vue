<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { auth, logout } = useAuth()

const member = computed(() => auth.user?.member)
const loggingOut = ref(false)
const logoutError = ref('')

const signOut = async () => {
  loggingOut.value = true
  logoutError.value = ''

  try {
    await logout()
    await router.push({ name: 'home' })
  } catch {
    logoutError.value = 'Gagal keluar. Silakan coba lagi.'
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <main class="container my-5 min-vh-100">
    <h1 class="display-4 mb-5">Profil Member</h1>

    <section class="form-daftar-member rounded-4 p-5 bg-color-body">
      <div v-if="logoutError" class="alert alert-danger" role="alert">{{ logoutError }}</div>

      <dl class="row mb-4">
        <dt class="col-sm-4 mb-2">Nama</dt>
        <dd class="col-sm-8 mb-3">{{ auth.user?.name }}</dd>

        <dt class="col-sm-4 mb-2">Email</dt>
        <dd class="col-sm-8 mb-3">{{ auth.user?.email }}</dd>

        <dt class="col-sm-4 mb-2">No HP</dt>
        <dd class="col-sm-8 mb-3">{{ member?.phone || '-' }}</dd>

        <dt class="col-sm-4 mb-2">Alamat</dt>
        <dd class="col-sm-8 mb-3">{{ member?.address || '-' }}</dd>
      </dl>

      <button type="button" class="btn btn-outline-danger p-3" :disabled="loggingOut" @click="signOut">
        {{ loggingOut ? 'Keluar...' : 'Keluar' }}
      </button>
    </section>
  </main>
</template>
