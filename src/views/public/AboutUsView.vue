<script setup>
import { onMounted, ref } from 'vue'
import ErrorState from '../../components/common/ErrorState.vue'
import LoadingState from '../../components/common/LoadingState.vue'
import { getErrorMessage } from '../../lib/http'
import { publicApi } from '../../services/api'

const sections = ref([])
const loading = ref(true)
const error = ref('')

const paragraphs = (content) => content.split('\n').map((paragraph) => paragraph.trim()).filter(Boolean)

const loadSections = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await publicApi.aboutUs()
    sections.value = response.data
  } catch (requestError) {
    error.value = getErrorMessage(requestError, 'Konten Tentang Kami belum dapat dimuat.')
  } finally {
    loading.value = false
  }
}

onMounted(loadSections)
</script>

<template>
  <main class="container my-5 min-vh-100">
    <h1 class="display-4 mb-5">Tentang Kami</h1>

    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" @retry="loadSections" />
    <p v-else-if="sections.length === 0" class="state-message">Belum ada konten.</p>
    <template v-else>
      <section
        v-for="section in sections"
        :key="section.id"
        class="my-5 w-100 p-4 border-color-main-darker rounded-3 bg-color-body"
      >
        <h2 class="h4 mb-2">{{ section.title }}</h2>
        <p v-for="paragraph in paragraphs(section.content)" :key="paragraph" class="mb-1">{{ paragraph }}</p>
      </section>
    </template>
  </main>
</template>
