<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AdminSidebar from '../components/admin/AdminSidebar.vue'

const route = useRoute()
const router = useRouter()
const { auth, logout } = useAuth()
const sidebarOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  },
)

const handleEscape = (event) => {
  if (event.key === 'Escape') sidebarOpen.value = false
}

const handleLogout = async () => {
  await logout()
  await router.push({ name: 'admin.login' })
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', handleEscape))
</script>

<template>
  <div class="admin-wrapper">
    <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <button
      v-if="sidebarOpen"
      type="button"
      class="admin-sidebar-backdrop"
      aria-label="Tutup menu admin"
      @click="sidebarOpen = false"
    ></button>

    <div class="admin-main">
      <header class="admin-topbar">
        <div class="d-flex align-items-center gap-2">
          <button
            type="button"
            class="btn admin-menu-toggle"
            aria-label="Buka menu admin"
            :aria-expanded="sidebarOpen"
            @click="sidebarOpen = !sidebarOpen"
          >
            <i class="bi bi-list" aria-hidden="true"></i>
          </button>
          <h1 class="page-title">{{ route.meta.title ?? 'Dashboard' }}</h1>
        </div>
        <div class="user-info">
          <i class="bi bi-person-circle" aria-hidden="true"></i>
          <span>{{ auth.user?.name }}</span>
          <button type="button" class="btn btn-sm btn-admin-outline admin-logout" @click="handleLogout">
            <i class="bi bi-box-arrow-right" aria-hidden="true"></i> Logout
          </button>
        </div>
      </header>

      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
