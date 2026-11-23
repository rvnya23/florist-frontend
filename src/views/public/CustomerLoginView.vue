<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { getErrorMessage, getValidationErrors } from '../../lib/http'

const route = useRoute()
const router = useRouter()
const { customerLogin } = useAuth()
const form = reactive({ email: '', password: '', remember: false })
const errors = ref({})
const message = ref('')
const submitting = ref(false)

const submit = async () => {
  errors.value = {}
  message.value = ''
  submitting.value = true

  try {
    await customerLogin(form)
    await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'profile' })
  } catch (error) {
    errors.value = getValidationErrors(error)
    message.value = getErrorMessage(error, 'Login gagal. Periksa kembali email dan password.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="container my-5 min-vh-100">
    <h1 class="display-4 mb-5">Login Member</h1>

    <section class="form-daftar-member rounded-4 p-5 bg-color-body">
      <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>

      <form novalidate @submit.prevent="submit">
        <div class="mb-3">
          <label for="customer-email" class="form-label">Email</label>
          <input
            id="customer-email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            required
            autofocus
          />
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email[0] }}</div>
        </div>
        <div class="mb-3">
          <label for="customer-password" class="form-label">Password</label>
          <input
            id="customer-password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            required
          />
          <div v-if="errors.password" class="invalid-feedback">{{ errors.password[0] }}</div>
        </div>
        <div class="mb-3 form-check">
          <input id="customer-remember" v-model="form.remember" type="checkbox" class="form-check-input" />
          <label class="form-check-label" for="customer-remember">Ingat saya</label>
        </div>
        <button type="submit" class="btn bg-color-main-darker text-color-white p-3" :disabled="submitting">
          {{ submitting ? 'Memeriksa...' : 'Login' }}
        </button>
      </form>

      <p class="mt-4 mb-0">
        Belum menjadi member?
        <RouterLink :to="{ name: 'register-member' }">Daftar Member</RouterLink>
      </p>
    </section>
  </main>
</template>
