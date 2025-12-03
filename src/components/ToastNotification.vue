<script setup>
import { useToast } from '../composables/useToast'
import { Icon } from '@iconify/vue'

const { toasts, removeToast } = useToast()

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return 'material-symbols:check-circle'
    case 'error':
      return 'material-symbols:error'
    case 'warning':
      return 'material-symbols:warning'
    default:
      return 'material-symbols:info'
  }
}
</script>

<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type" role="alert">
        <Icon :icon="getIcon(toast.type)" class="toast-icon" />
        <span class="toast-message">{{ toast.message }}</span>
        <button @click="removeToast(toast.id)" class="close-btn" aria-label="Close notification">
          <Icon icon="material-symbols:close" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
  border-left: 4px solid #3498db;
  animation: slideIn 0.3s ease;

  &.success {
    border-left-color: #2ecc71;

    .toast-icon {
      color: #2ecc71;
    }
  }

  &.error {
    border-left-color: #e74c3c;

    .toast-icon {
      color: #e74c3c;
    }
  }

  &.warning {
    border-left-color: #f1c40f;

    .toast-icon {
      color: #f1c40f;
    }
  }

  .toast-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .toast-message {
    flex-grow: 1;
    font-size: 0.95rem;
    color: #2c3e50;
    line-height: 1.4;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #95a5a6;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;

    &:hover {
      color: #2c3e50;
    }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 480px) {
  .toast-container {
    top: auto;
    bottom: 20px;
    right: 20px;
    left: 20px;
  }

  .toast {
    min-width: auto;
    width: 100%;
  }
}
</style>
