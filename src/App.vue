<script setup>
import Footer from './components/Footer.vue'
import ToastNotification from './components/ToastNotification.vue'
</script>

<template>
  <div class="app-container">
    <ToastNotification />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Footer />
  </div>
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
