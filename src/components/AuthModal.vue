<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const { login, register } = useAuth()
const { addToast } = useToast()

const activeTab = ref('login')
const isLoading = ref(false)

// Form Data
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })

const switchTab = (tab) => {
  activeTab.value = tab
}

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    addToast('Please fill in all fields.', 'warning')
    return
  }

  isLoading.value = true
  
  // Simulate API delay
  setTimeout(() => {
    const result = login(loginForm.value.email, loginForm.value.password)
    
    if (result.success) {
      addToast(result.message, 'success')
      emit('close')
      loginForm.value = { email: '', password: '' }
    } else {
      addToast(result.message, 'error')
    }
    
    isLoading.value = false
  }, 800)
}

const handleRegister = async () => {
  if (!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
    addToast('Please fill in all fields.', 'warning')
    return
  }

  if (registerForm.value.password.length < 6) {
    addToast('Password must be at least 6 characters.', 'warning')
    return
  }

  isLoading.value = true
  
  // Simulate API delay
  setTimeout(() => {
    const result = register({
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password
    })
    
    if (result.success) {
      addToast(result.message, 'success')
      emit('close')
      registerForm.value = { name: '', email: '', password: '' }
    } else {
      addToast(result.message, 'error')
    }
    
    isLoading.value = false
  }, 800)
}
</script>

<template>
  <transition name="modal">
    <div v-if="isOpen" class="auth-modal-overlay" @click="$emit('close')">
      <div class="auth-modal" @click.stop>
        <button class="close-btn" @click="$emit('close')" aria-label="Close modal">
          <Icon icon="material-symbols:close" />
        </button>

        <div class="auth-header">
          <div class="tabs">
            <button 
              :class="{ active: activeTab === 'login' }" 
              @click="switchTab('login')"
            >
              Login
            </button>
            <button 
              :class="{ active: activeTab === 'register' }" 
              @click="switchTab('register')"
            >
              Register
            </button>
          </div>
        </div>

        <div class="auth-body">
          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:mail-outline" class="input-icon" />
                <input 
                  type="email" 
                  v-model="loginForm.email" 
                  placeholder="hello@example.com"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:lock-outline" class="input-icon" />
                <input 
                  type="password" 
                  v-model="loginForm.password" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="auth-form">
            <div class="form-group">
              <label>Full Name</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:person-outline" class="input-icon" />
                <input 
                  type="text" 
                  v-model="registerForm.name" 
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:mail-outline" class="input-icon" />
                <input 
                  type="email" 
                  v-model="registerForm.email" 
                  placeholder="hello@example.com"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:lock-outline" class="input-icon" />
                <input 
                  type="password" 
                  v-model="registerForm.password" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="isLoading">
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.auth-modal {
  background: #fff;
  width: 90%;
  max-width: 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    color: #374151;
  }
}

.auth-header {
  padding: 2rem 2rem 0;
  
  .tabs {
    display: flex;
    gap: 1rem;
    border-bottom: 2px solid #e5e7eb;
    
    button {
      background: none;
      border: none;
      padding-bottom: 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: #9ca3af;
      cursor: pointer;
      position: relative;
      transition: color 0.3s;
      
      &.active {
        color: #e1306c;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #e1306c;
        }
      }
    }
  }
}

.auth-body {
  padding: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  .input-wrapper {
    position: relative;
    
    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      font-size: 1.2rem;
    }
    
    input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s;
      
      &:focus {
        outline: none;
        border-color: #e1306c;
        box-shadow: 0 0 0 3px rgba(225, 48, 108, 0.1);
      }
    }
  }
}

.submit-btn {
  background: linear-gradient(135deg, #e1306c 0%, #c13584 100%);
  color: #fff;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(225, 48, 108, 0.25);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
  
  .auth-modal {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  
  .auth-modal {
    transform: scale(0.9) translateY(20px);
  }
}
</style>
