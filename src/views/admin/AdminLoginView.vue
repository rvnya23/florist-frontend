<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { getErrorMessage, getValidationErrors } from '../../lib/http'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()
const form = reactive({ email: '', password: '', remember: false })
const errors = ref({})
const message = ref('')
const submitting = ref(false)

const submit = async () => {
  errors.value = {}
  message.value = ''
  submitting.value = true

  try {
    await login(form)
    await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'admin.dashboard' })
  } catch (error) {
    errors.value = getValidationErrors(error)
    message.value = getErrorMessage(error, 'Login gagal. Periksa kembali email dan password.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="auth-wrapper">
    <section class="auth-card" aria-labelledby="login-title">
      <div class="auth-brand"><h1 class="h2">Sudut<span class="brand-accent">Flora</span></h1></div>
      <p id="login-title" class="auth-title">Masuk ke Admin Panel</p>

      <div v-if="message" class="alert alert-danger admin-alert mb-3" role="alert">
        <i class="bi bi-exclamation-circle me-1" aria-hidden="true"></i> {{ message }}
      </div>

      <form class="admin-form" novalidate @submit.prevent="submit">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input id="email" v-model="form.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" required autofocus />
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email[0] }}</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input id="password" v-model="form.password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" required />
          <div v-if="errors.password" class="invalid-feedback">{{ errors.password[0] }}</div>
        </div>
        <div class="mb-3 form-check">
          <input id="remember" v-model="form.remember" type="checkbox" class="form-check-input" />
          <label class="form-check-label auth-remember" for="remember">Ingat saya</label>
        </div>
        <button type="submit" class="btn btn-admin-primary w-100 justify-content-center py-2" :disabled="submitting">
          <i class="bi bi-box-arrow-in-right" aria-hidden="true"></i>
          {{ submitting ? 'Memeriksa...' : 'Masuk' }}
        </button>
      </form>
    </section>
  </main>
</template>
