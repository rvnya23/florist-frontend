<script setup>
defineProps({
  product: { type: Object, required: true },
  showDescription: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <article class="card-catalog bg-color-body p-4 rounded-4 d-flex flex-column w-100 h-100" data-aos="fade-up">
    <img
      class="card-catalog-image rounded-3 object-fit-cover"
      :src="product.image_url"
      :alt="product.name"
      width="400"
      height="400"
      loading="lazy"
    />
    <div class="card-catalog-description d-flex flex-column flex-grow-1">
      <div class="mt-4">
        <h2 class="h5">{{ product.name }}</h2>
        <p>{{ product.formatted_price }}</p>
        <p v-if="showDescription" class="text">{{ product.description }}</p>
      </div>
      <div class="d-flex justify-content-center mt-auto">
        <button
          type="button"
          class="bg-color-dark text-color-white px-4 py-3 mt-3 text-decoration-none d-flex gap-2"
          @click="$emit('select', product)"
        >
          <span>Lihat Detail</span>
          <i class="bi bi-flower1" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </article>
</template>
