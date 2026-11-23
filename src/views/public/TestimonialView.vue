<script setup>
import { computed, onMounted } from 'vue'
import { publicApi } from '../../services/api'
import { useApiForm } from '../../composables/useApiForm'
import { useAuth } from '../../composables/useAuth'

const { auth, loadUser } = useAuth()
const isLoggedInMember = computed(() => auth.user?.role === 'customer' && auth.user.member)

const submitTestimonial = (payload) =>
  publicApi.submitTestimonial(isLoggedInMember.value ? { message: payload.message } : payload)

const { form, errors, message, submitting, submit } = useApiForm(
  { name: '', email: '', message: '' },
  submitTestimonial,
)

onMounted(loadUser)
</script>

<template>
  <main class="container my-5 min-vh-100">
    <h1 class="display-4 mb-5">Pesan &amp; Kesan</h1>

    <div v-if="message" :class="['alert', Object.keys(errors).length ? 'alert-danger' : 'alert-success']" role="status">
      {{ message }}
    </div>

    <section class="form-pesan-kesan rounded-4 p-5 bg-color-body mt-5">
      <p>Kami sangat menghargai umpan balik dari Anda. Bagikan pengalaman berbelanja bucket bunga di sini, atau tinggalkan pesan untuk tim kami.</p>
      <p>Setiap masukan membantu kami menjadi lebih baik!</p>
      <p v-if="isLoggedInMember" class="small text-secondary">Dikirim sebagai {{ auth.user.name }}.</p>
      <p v-if="!auth.loaded" class="mb-0">Memuat formulir...</p>
      <form v-else novalidate @submit.prevent="submit">
        <div v-if="!isLoggedInMember" class="mb-3">
          <label for="testimonial-name" class="form-label">Nama</label>
          <input id="testimonial-name" v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" required />
          <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
        </div>
        <div v-if="!isLoggedInMember" class="mb-3">
          <label for="testimonial-email" class="form-label">Email</label>
          <input id="testimonial-email" v-model="form.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" aria-describedby="testimonial-email-help" required />
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email[0] }}</div>
          <div id="testimonial-email-help" class="form-text">Kami tidak akan pernah membagikan alamat email kamu kepada pihak lain.</div>
        </div>
        <div class="mb-3">
          <label for="testimonial-message" class="form-label">Pesan &amp; Kesan</label>
          <textarea id="testimonial-message" v-model="form.message" class="form-control" :class="{ 'is-invalid': errors.message }" rows="3" required></textarea>
          <div v-if="errors.message" class="invalid-feedback">{{ errors.message[0] }}</div>
        </div>
        <button type="submit" class="btn bg-color-main-darker text-color-white p-3 mt-3" :disabled="submitting">
          {{ submitting ? 'Mengirim...' : 'Kirim' }}
        </button>
      </form>
    </section>
  </main>
</template>
