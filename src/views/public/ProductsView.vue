<script setup>
import AOS from 'aos'
import { nextTick, onMounted, ref } from 'vue'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import ProductCard from '../../components/public/ProductCard.vue'
import ProductDialog from '../../components/public/ProductDialog.vue'
import { getErrorMessage } from '../../lib/http'
import { publicApi } from '../../services/api'

const products = ref([])
const loading = ref(true)
const error = ref('')
const productDialog = ref(null)

const loadProducts = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await publicApi.products()
    products.value = response.data
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Koleksi produk belum dapat dimuat.')
  } finally {
    loading.value = false
  }

  await nextTick()
  AOS.refreshHard()
}

onMounted(loadProducts)
</script>

<template>
  <main class="container my-5 min-vh-100">
    <h1 class="display-4 mb-4">Koleksi Kami</h1>

    <LoadingState v-if="loading" label="Memuat koleksi produk..." />
    <ErrorState v-else-if="error" :message="error" @retry="loadProducts" />
    <p v-else-if="products.length === 0" class="state-message">Belum ada produk tersedia.</p>
    <section v-else class="row g-3">
      <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-lg-4 col-xl-3 p-3">
        <ProductCard :product="product" show-description @select="productDialog.open($event)" />
      </div>
    </section>
  </main>

  <ProductDialog ref="productDialog" />
</template>
