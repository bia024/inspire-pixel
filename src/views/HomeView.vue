<script setup>
import Header from '../components/Header.vue'
import Hero from '../components/Hero.vue'
import Gallery from '../components/Gallery.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')

watch(() => route.query.q, (newQuery) => {
  searchQuery.value = newQuery || ''
}, { immediate: true })

const handleSearch = (query) => {
  searchQuery.value = query
  router.replace({ query: { ...route.query, q: query || undefined } })
}
</script>

<template>
  <div class="home-view">
    <Header />
    <Hero @search="handleSearch" />
    <main>
      <Gallery :search-query="searchQuery" />
    </main>
  </div>
</template>

<style scoped>
main {
  margin-top: 2rem;
}
</style>
