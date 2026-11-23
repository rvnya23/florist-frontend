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
    const response = await publicApi.products(4)
    products.value = response.data
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Produk populer belum dapat dimuat.')
  } finally {
    loading.value = false
  }

  await nextTick()
  AOS.refreshHard()
}

onMounted(loadProducts)
</script>

<template>
  <header class="public-hero w-100 d-flex">
    <div class="container m-auto">
      <div class="row justify-content-center align-items-center h-100">
        <section class="col-lg-6" data-aos="fade-up">
          <h1 class="display-2 w-100 mb-5">
            <span>Koleksi</span><br />
            <span>Bunga Mawar Cantik &amp; Unik</span>
          </h1>
          <p>Di mana bunga menjadi inspirasi kami untuk menciptakan kenangan yang abadi.</p>
          <p>Apapun kesempatan yang ada, bunga kami akan membuatnya menjadi istimewa.</p>
          <RouterLink
            :to="{ name: 'products' }"
            class="bg-color-dark text-color-white px-5 py-3 text-decoration-none d-inline-block cta"
          >
            Pilih Favoritmu
          </RouterLink>
        </section>
        <section class="col-lg-6 d-flex align-items-center justify-content-center">
          <div class="cta-image-container d-flex align-items-center justify-content-center" data-aos="fade-up">
            <img src="/assets/images/2.png" alt="Rangkaian bunga Sudut Flora" width="640" height="960" fetchpriority="high" />
          </div>
        </section>
      </div>
    </div>
  </header>

  <section class="container my-3 py-5" aria-label="Pencapaian Sudut Flora">
    <div class="row g-4">
      <div class="col-6 col-lg-3 d-flex flex-column align-items-center gap-3" data-aos="fade-up">
        <h2 class="h4 fw-bold">600+</h2><span>Kreasi Bucket</span>
      </div>
      <div class="col-6 col-lg-3 d-flex flex-column align-items-center gap-3" data-aos="fade-up">
        <h2 class="h4 fw-bold">5000+</h2><span>Bucket Terjual</span>
      </div>
      <div class="col-6 col-lg-3 d-flex flex-column align-items-center gap-3" data-aos="fade-up">
        <h2 class="h4 fw-bold">4500+</h2><span>Kepuasan Pembeli</span>
      </div>
      <div class="col-6 col-lg-3 d-flex flex-column align-items-center gap-3" data-aos="fade-up">
        <h2 class="h4 fw-bold">5+</h2><span>Tahun Merangkai</span>
      </div>
    </div>
  </section>

  <section class="my-3 py-5 bg-color-white">
    <div class="container">
      <div class="row gap-5">
        <div class="col-lg d-flex flex-column gap-5 justify-content-center">
          <h2 class="display-5">Temukan rangkaian bunga<br />yang sempurna untuk kamu</h2>
          <p class="lead">
            Paduan mawar berwarna soft dan perhatian tulus adalah cara terbaik untuk menunjukkan kasih sayang.
            Bucket bulat minimalis ini dirancang untuk memperindah setiap sudut ruangan Anda.
          </p>
          <div>
            <RouterLink
              :to="{ name: 'register-member' }"
              class="bg-transparent text-color-main-darker text-decoration-none px-5 py-3 cta border-color-dark"
            >
              Daftar Member
            </RouterLink>
          </div>
        </div>
        <div class="col-lg d-flex flex-column gap-4">
          <div class="row g-2">
            <div class="col-6"><img data-aos="fade-up" class="overview-image rounded-3 object-fit-cover" src="/assets/images/mix2 biru.jpg" alt="Rangkaian bunga biru" width="400" height="400" loading="lazy" /></div>
            <div class="col-6"><img data-aos="fade-up" class="overview-image rounded-3 object-fit-cover" src="/assets/images/mix3 putih.jpg" alt="Rangkaian bunga putih" width="400" height="400" loading="lazy" /></div>
            <div class="col-6"><img data-aos="fade-up" class="overview-image rounded-3 object-fit-cover" src="/assets/images/mix3 pink.jpg" alt="Rangkaian bunga merah muda" width="400" height="400" loading="lazy" /></div>
            <div class="col-6"><img data-aos="fade-up" class="overview-image rounded-3 object-fit-cover" src="/assets/images/mix3 biru.jpg" alt="Rangkaian bunga biru dan putih" width="400" height="400" loading="lazy" /></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="my-3 py-5 container">
    <h2 class="display-6 mb-4">Edisi Terpopuler</h2>
    <LoadingState v-if="loading" label="Memuat produk populer..." />
    <ErrorState v-else-if="error" :message="error" @retry="loadProducts" />
    <p v-else-if="products.length === 0" class="state-message">Belum ada produk tersedia.</p>
    <div v-else class="row g-3">
      <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-xl-3">
        <ProductCard :product="product" @select="productDialog.open($event)" />
      </div>
    </div>
  </section>

  <section class="my-3 py-5 container">
    <h2 class="display-6 mb-4">Ruang Reputasi</h2>
    <div class="row g-3">
      <article class="card-testimonial rounded-4 col-lg d-flex gap-3 flex-column p-3" data-aos="fade-up">
        <img src="/assets/images/p1.jpg" alt="Foto pelanggan lavcuttie" class="card-testimonial-image" width="50" height="50" loading="lazy" />
        <h3 class="h5 fw-bold text-color-main-darker">lavcuttie</h3><span>Bucket Elegi Malam</span>
        <p>Bucket bunganya terlihat sangat eksklusif dan berkarakter, susunan mawar rapi dengan hiasan bucket yang elegan membuat tampilannya benar-benar berbeda dan berkesan premium.</p>
      </article>
      <article class="card-testimonial rounded-4 col-lg d-flex gap-3 flex-column p-3" data-aos="fade-up">
        <img src="/assets/images/p2.jpg" alt="Foto pelanggan fl4weries" class="card-testimonial-image" width="50" height="50" loading="lazy" />
        <h3 class="h5 fw-bold text-color-main-darker">fl4weries</h3><span>Bucket Isyarat Manis</span>
        <p>Ukurannya pas dan tampilannya manis, rangkaian mawar terlihat fresh dengan hiasan bucket yang simpel namun tetap cantik, cocok untuk hadiah kecil yang penuh perhatian.</p>
      </article>
      <article class="card-testimonial rounded-4 col-lg d-flex gap-3 flex-column p-3" data-aos="fade-up">
        <img src="/assets/images/p3.jpg" alt="Foto pelanggan bbearthyv" class="card-testimonial-image" width="50" height="50" loading="lazy" />
        <h3 class="h5 fw-bold text-color-main-darker">bbearthyv</h3><span>Bucket Langka Mimpi</span>
        <p>Rangkaiannya terlihat mewah dan unik, mawar tersusun rapi dengan hiasan bucket yang modern sehingga memberikan kesan istimewa dan tidak biasa untuk momen spesial.</p>
      </article>
    </div>
  </section>

  <section class="my-3 py-5 container">
    <h2 class="display-6 mb-4">Studio Kami</h2>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4970.3574037623375!2d112.62404777593412!3d-7.937972992086081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd629e6b8f41bcf%3A0x8b409da605dc7bd9!2sINSTITUT%20ASIA!5e1!3m2!1sen!2sid!4v1769606386150!5m2!1sen!2sid"
      title="Lokasi studio Sudut Flora"
      class="w-100 studio-map"
      width="1200"
      height="450"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </section>

  <ProductDialog ref="productDialog" />
</template>
