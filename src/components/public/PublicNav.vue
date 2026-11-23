<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useCart } from '../../composables/useCart'

const router = useRouter()
const { auth, loadUser, logout } = useAuth()
const { cart, loadCart, resetCart } = useCart()
const loggingOut = ref(false)
const logoutError = ref('')

const loadCustomerCart = async (force = false) => {
  if (auth.user?.role !== 'customer') return
  try {
    await loadCart(force)
  } catch {
    resetCart()
  }
}

const signOut = async () => {
  loggingOut.value = true
  logoutError.value = ''

  try {
    await logout()
    resetCart()
    await router.push({ name: 'home' })
  } catch {
    logoutError.value = 'Gagal keluar. Silakan coba lagi.'
  } finally {
    loggingOut.value = false
  }
}

watch(
  () => auth.user?.id,
  async () => {
    if (auth.user?.role === 'customer') await loadCustomerCart(true)
    else resetCart()
  },
)

onMounted(async () => {
  await loadUser()
  await loadCustomerCart()
})
</script>

<template>
  <nav class="navbar navbar-expand-lg" aria-label="Navigasi utama">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" :to="{ name: 'home' }">
        <span class="text-color-dark">Sudut</span>
        <span class="text-color-main-darker">Flora</span>
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Buka navigasi"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav m-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'home' }">Beranda</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'products' }">Produk</RouterLink>
          </li>
          <li v-if="auth.user?.role !== 'customer'" class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'register-member' }">Daftar Member</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'testimoni' }">Pesan &amp; Kesan</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'about-us' }">Tentang Kami</RouterLink>
          </li>
        </ul>
        <span v-if="!auth.loaded || auth.loading" class="navbar-text">Memuat...</span>
        <RouterLink
          v-else-if="!auth.user"
          class="btn bg-transparent text-color-dark px-4 py-2"
          :to="{ name: 'login' }"
        >
          Login
        </RouterLink>
        <div v-else class="dropdown">
          <button
            class="btn bg-transparent text-color-dark dropdown-toggle px-4 py-2"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ auth.user.name }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li v-if="auth.user.role === 'customer'">
              <RouterLink class="dropdown-item" :to="{ name: 'profile' }">Profil</RouterLink>
            </li>
            <li v-if="auth.user.role === 'customer'">
              <RouterLink class="dropdown-item d-flex justify-content-between gap-3" :to="{ name: 'cart' }">
                <span>Keranjang</span>
                <span class="badge text-bg-dark">{{ cart.data?.item_count ?? 0 }}</span>
              </RouterLink>
            </li>
            <li v-if="auth.user.role === 'customer'">
              <RouterLink class="dropdown-item" :to="{ name: 'orders' }">Riwayat Order</RouterLink>
            </li>
            <li>
              <button class="dropdown-item" type="button" :disabled="loggingOut" @click="signOut">
                {{ loggingOut ? 'Keluar...' : 'Keluar' }}
              </button>
            </li>
            <li v-if="logoutError"><span class="dropdown-item-text text-danger">{{ logoutError }}</span></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
