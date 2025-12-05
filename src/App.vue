<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Footer from './components/Footer.vue'
import ToastNotification from './components/ToastNotification.vue'
import BackToActions from './components/BackToActions.vue'

const route = useRoute()

const showGlobalComponents = computed(() => !['mode-selection', 'stories', 'callback'].includes(route.name))

const transitionName = computed(() => {
  return route.name === 'mode-selection' ? 'slide-up' : 'fade'
})
</script>

<template>
  <div class="app-container">
    <ToastNotification />
    <BackToActions v-if="showGlobalComponents" />
    <router-view v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Footer v-if="showGlobalComponents" />
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
  transform: translateY(100vh);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
