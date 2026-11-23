<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPagination from '../../components/admin/AdminPagination.vue'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { resourceConfigs } from '../../config/resources'
import { getErrorMessage } from '../../lib/http'
import { adminApi } from '../../services/api'

const route = useRoute()
const router = useRouter()
const items = ref([])
const meta = ref(null)
const loading = ref(true)
const error = ref('')
const message = ref(typeof route.query.message === 'string' ? route.query.message : '')
const deletingId = ref(null)
const resource = computed(() => route.meta.resource)
const config = computed(() => resourceConfigs[resource.value])

const formatDate = (value) =>
  value ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '-'

const displayValue = (item, column) => {
  const value = item[column.key]
  if (column.type === 'date') return formatDate(value)
  return value || '-'
}

const loadItems = async (page = Number(route.query.page) || 1) => {
  loading.value = true
  error.value = ''

  try {
    const response = await adminApi.list(resource.value, page)
    items.value = response.data
    meta.value = response.meta
  } catch (requestError) {
    error.value = getErrorMessage(requestError, `${config.value.title} belum dapat dimuat.`)
  } finally {
    loading.value = false
  }
}

const changePage = async (page) => {
  await router.replace({ query: { ...route.query, page, message: undefined } })
  await loadItems(page)
}

const removeItem = async (item) => {
  if (!window.confirm(`Yakin ingin menghapus ${config.value.singular.toLowerCase()} ini?`)) return

  deletingId.value = item.id
  message.value = ''

  try {
    const response = await adminApi.remove(resource.value, item.id)
    message.value = response.message
    await loadItems(meta.value.current_page)
  } catch (requestError) {
    error.value = getErrorMessage(requestError, `${config.value.singular} gagal dihapus.`)
  } finally {
    deletingId.value = null
  }
}

watch(resource, () => {
  message.value = ''
  loadItems(1)
})

onMounted(loadItems)
</script>

<template>
  <div v-if="message" class="alert alert-success admin-alert" role="status">
    <i class="bi bi-check-circle me-1" aria-hidden="true"></i> {{ message }}
  </div>

  <div class="d-flex justify-content-between align-items-center gap-3 mb-4">
    <p class="admin-list-total">Total: {{ meta?.total ?? 0 }} {{ config.singular.toLowerCase() }}</p>
    <RouterLink :to="{ name: `admin.${resource}.create` }" class="btn btn-admin-primary">
      <i class="bi bi-plus-lg" aria-hidden="true"></i> Tambah {{ config.singular }}
    </RouterLink>
  </div>

  <LoadingState v-if="loading" :label="`Memuat ${config.title.toLowerCase()}...`" />
  <ErrorState v-else-if="error" :message="error" @retry="loadItems()" />
  <section v-else class="admin-card p-0">
    <div v-if="items.length > 0" class="table-responsive">
      <table class="admin-table">
        <thead>
          <tr><th>#</th><th v-for="column in config.columns" :key="column.key">{{ column.label }}</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item.id">
            <td>{{ index + 1 + ((meta.current_page - 1) * meta.per_page) }}</td>
            <td v-for="column in config.columns" :key="column.key" :class="{ 'admin-cell-truncate': column.truncate }">
              <img v-if="column.type === 'image'" :src="item[column.key]" :alt="item.name" class="product-thumb" width="50" height="50" />
              <code v-else-if="column.type === 'code'">{{ displayValue(item, column) }}</code>
              <strong v-else-if="column.strong">{{ displayValue(item, column) }}</strong>
              <span v-else>{{ displayValue(item, column) }}</span>
            </td>
            <td>
              <div class="action-buttons">
                <RouterLink :to="{ name: `admin.${resource}.edit`, params: { id: item.id } }" class="btn btn-admin-secondary">
                  <i class="bi bi-pencil" aria-hidden="true"></i> Edit
                </RouterLink>
                <button type="button" class="btn btn-admin-danger" :disabled="deletingId === item.id" @click="removeItem(item)">
                  <i class="bi bi-trash" aria-hidden="true"></i> {{ deletingId === item.id ? 'Menghapus...' : 'Hapus' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <AdminPagination v-if="meta" :meta="meta" @change="changePage" />
    </div>
    <div v-else class="empty-state">
      <i class="bi bi-inbox d-block" aria-hidden="true"></i>
      <p>Belum ada {{ config.singular.toLowerCase() }}.</p>
      <RouterLink :to="{ name: `admin.${resource}.create` }" class="btn btn-admin-primary">
        <i class="bi bi-plus-lg" aria-hidden="true"></i> Tambah {{ config.singular }} Pertama
      </RouterLink>
    </div>
  </section>
</template>
