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
  top: 1.25rem;
  right: 1.25rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  background: var(--card-bg);
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.75rem var(--card-shadow);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 18.75rem;
  max-width: 25rem;
  border-left: 0.25rem solid #3498db;
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
    color: var(--text-primary);
    line-height: 1.4;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 0.25rem;
    display: flex;
    align-items: center;
    transition: color 0.2s;

    &:hover {
      color: var(--text-primary);
    }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(1.875rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(1.875rem);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(1.875rem);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 30rem) {
  .toast-container {
    top: auto;
    bottom: 1.25rem;
    right: 1.25rem;
    left: 1.25rem;
  }

  .toast {
    min-width: auto;
    width: 100%;
  }
}
</style>
