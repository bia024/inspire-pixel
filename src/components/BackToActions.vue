<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isVisible = ref(false)

const isHomePage = () => route.name === 'home'

const handleScroll = () => {
  isVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const goHome = () => {
  router.push({ name: 'home' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <transition name="fade-slide">
    <div v-if="isVisible" class="back-to-actions">
      <button @click="scrollToTop" class="action-btn back-to-top" aria-label="Back to top" title="Back to top">
        <Icon icon="material-symbols:arrow-upward" />
      </button>

      <button v-if="!isHomePage()" @click="goHome" class="action-btn back-to-home" aria-label="Back to home"
        title="Back to home">
        <Icon icon="material-symbols:home" />
      </button>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.back-to-actions {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%);
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.5);
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }

  &.back-to-home {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

    &:hover {
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .back-to-actions {
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .action-btn {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
}
</style>
