<script setup>
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import Gallery from './components/Gallery.vue'
import ModeSelection from './components/ModeSelection.vue'
import { ref } from 'vue'

const searchQuery = ref('')
const userMode = ref(localStorage.getItem('userMode') || null)

const handleSearch = (query) => {
  searchQuery.value = query
}

const handleModeSelect = (mode) => {
  userMode.value = mode
}
</script>

<template>
  <div>
    <ModeSelection v-if="!userMode" @select-mode="handleModeSelect" />
    <div v-else>
      <Header />
      <Hero @search="handleSearch" />
      <main>
        <Gallery :search-query="searchQuery" :user-mode="userMode" />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
main {
  margin-top: 2rem;
}
</style>
