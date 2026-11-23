<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { resourceConfigs } from '../../config/resources'
import { getErrorMessage, getValidationErrors } from '../../lib/http'
import { adminApi } from '../../services/api'

const route = useRoute()
const router = useRouter()
const resource = computed(() => route.meta.resource)
const config = computed(() => resourceConfigs[resource.value])
const editing = computed(() => Boolean(route.params.id))
const form = reactive({})
const errors = ref({})
const loading = ref(editing.value)
const submitting = ref(false)
const loadError = ref('')
const submitError = ref('')
const currentImage = ref('')

const initializeForm = (data = {}) => {
  for (const key of Object.keys(form)) delete form[key]

  for (const field of config.value.fields) {
    if (field.type === 'file') {
      form[field.key] = null
      continue
    }

    form[field.key] = data[field.key] ?? field.default ?? ''
  }
  currentImage.value = data.image_url ?? ''
}

const loadItem = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const response = await adminApi.find(resource.value, route.params.id)
    initializeForm(response.data)
  } catch (requestError) {
    loadError.value = getErrorMessage(requestError, `${config.value.singular} belum dapat dimuat.`)
  } finally {
    loading.value = false
  }
}

const handleFile = (event, key) => {
  form[key] = event.target.files?.[0] ?? null
}

const buildPayload = () => {
  if (resource.value !== 'products') return { ...form }

  const payload = new FormData()
  for (const [key, value] of Object.entries(form)) {
    if (value !== null && value !== '') payload.append(key, value)
  }
  return payload
}

const submit = async () => {
  errors.value = {}
  submitError.value = ''
  submitting.value = true

  try {
    const payload = buildPayload()
    const response = editing.value
      ? await adminApi.update(resource.value, route.params.id, payload, payload instanceof FormData)
      : await adminApi.create(resource.value, payload)

    await router.push({ name: `admin.${resource.value}.index`, query: { message: response.message } })
  } catch (requestError) {
    errors.value = getValidationErrors(requestError)
    submitError.value = getErrorMessage(requestError, `${config.value.singular} gagal disimpan.`)
  } finally {
    submitting.value = false
  }
}

const initializeRoute = () => {
  errors.value = {}
  submitError.value = ''
  loadError.value = ''
  initializeForm()
  loading.value = editing.value

  if (editing.value) return loadItem()

  return Promise.resolve()
}

watch(() => route.fullPath, initializeRoute)
onMounted(initializeRoute)
</script>

<template>
  <LoadingState v-if="loading" :label="`Memuat ${config.singular.toLowerCase()}...`" />
  <ErrorState v-else-if="loadError" :message="loadError" @retry="loadItem" />
  <section v-else class="admin-card admin-form-card">
    <div v-if="submitError" class="alert alert-danger admin-alert mb-3" role="alert">{{ submitError }}</div>

    <form class="admin-form" novalidate @submit.prevent="submit">
      <div v-for="field in config.fields" :key="field.key" class="mb-3">
        <label :for="field.key" class="form-label">{{ editing && field.type === 'file' ? 'Ganti Gambar (Opsional)' : field.label }}</label>

        <div v-if="field.type === 'file' && currentImage" class="mb-3">
          <img :src="currentImage" :alt="form.name || 'Gambar produk saat ini'" class="image-preview" width="120" height="120" />
        </div>

        <textarea
          v-if="field.type === 'textarea'"
          :id="field.key"
          v-model="form[field.key]"
          class="form-control"
          :class="{ 'is-invalid': errors[field.key] }"
          :rows="field.rows"
          :required="field.required"
        ></textarea>
        <input
          v-else-if="field.type === 'file'"
          :id="field.key"
          type="file"
          class="form-control"
          :class="{ 'is-invalid': errors[field.key] }"
          :accept="field.accept"
          :required="field.required && !editing"
          @change="handleFile($event, field.key)"
        />
        <input
          v-else
          :id="field.key"
          v-model="form[field.key]"
          :type="field.type"
          class="form-control"
          :class="{ 'is-invalid': errors[field.key] }"
          :min="field.min"
          :required="field.required"
        />

        <div v-if="errors[field.key]" class="invalid-feedback">{{ errors[field.key][0] }}</div>
        <div v-if="field.help" class="form-text">{{ editing && field.type === 'file' ? 'Kosongkan jika tidak ingin mengganti gambar.' : field.help }}</div>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-admin-primary" :disabled="submitting">
          <i class="bi bi-check-lg" aria-hidden="true"></i> {{ submitting ? 'Menyimpan...' : editing ? 'Perbarui' : 'Simpan' }}
        </button>
        <RouterLink :to="{ name: `admin.${resource}.index` }" class="btn btn-admin-outline">
          <i class="bi bi-arrow-left" aria-hidden="true"></i> Kembali
        </RouterLink>
      </div>
    </form>
  </section>
</template>
