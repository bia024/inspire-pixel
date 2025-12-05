<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'
import { useToast } from '../composables/useToast'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'register-success'])

const { login, register, resetPassword } = useFirebaseAuth()
const { addToast } = useToast()

const activeTab = ref('login')
const isLoading = ref(false)
const showPassword = ref(false)
const showRegisterPassword = ref(false)
const showForgotPassword = ref(false)
const forgotPasswordEmail = ref('')

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })

const passwordRequirements = computed(() => {
  const pwd = registerForm.value.password
  return {
    minLength: pwd.length >= 8,
    hasUpperCase: /[A-Z]/.test(pwd),
    hasLowerCase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  }
})

const passwordStrength = computed(() => {
  const reqs = passwordRequirements.value
  const metCount = Object.values(reqs).filter(Boolean).length
  const percentage = (metCount / 5) * 100

  if (percentage === 0) return { label: '', color: '', percentage: 0 }
  if (percentage <= 40) return { label: 'Weak', color: '#e74c3c', percentage }
  if (percentage <= 60) return { label: 'Fair', color: '#f39c12', percentage }
  if (percentage <= 80) return { label: 'Good', color: '#f1c40f', percentage }
  return { label: 'Strong', color: '#27ae60', percentage }
})

const isPasswordValid = computed(() => {
  return Object.values(passwordRequirements.value).every(Boolean)
})

const switchTab = (tab) => {
  activeTab.value = tab
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleRegisterPasswordVisibility = () => {
  showRegisterPassword.value = !showRegisterPassword.value
}

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    addToast('Please fill in all fields.', 'warning')
    return
  }

  isLoading.value = true

  try {
    const result = await login(loginForm.value.email, loginForm.value.password)

    if (result.success) {
      addToast(result.message, 'success')
      emit('close')
      loginForm.value = { email: '', password: '' }
    } else {
      addToast(result.message, 'error')
    }
  } catch (error) {
    console.error('Login error:', error)
    addToast('An error occurred during login.', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  if (!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
    addToast('Please fill in all fields.', 'warning')
    return
  }

  if (!isPasswordValid.value) {
    addToast('Password does not meet security requirements.', 'warning')
    return
  }

  isLoading.value = true

  try {
    const result = await register({
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password
    })

    if (result.success) {
      addToast(result.message, 'success')
      emit('close')
      emit('register-success')
      registerForm.value = { name: '', email: '', password: '' }
    } else {
      addToast(result.message, 'error')
    }
  } catch (error) {
    console.error('Registration error:', error)
    addToast('An error occurred during registration.', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!forgotPasswordEmail.value) {
    addToast('Please enter your email address.', 'warning')
    return
  }

  isLoading.value = true

  try {
    const result = await resetPassword(forgotPasswordEmail.value)

    if (result.success) {
      addToast(result.message, 'success')
      showForgotPassword.value = false
      forgotPasswordEmail.value = ''
    } else {
      addToast(result.message, 'error')
    }
  } catch (error) {
    console.error('Password reset error:', error)
    addToast('An error occurred. Please try again.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <transition name="modal">
    <div v-if="isOpen" class="auth-modal-overlay" @click="$emit('close')">
      <div class="auth-modal" role="dialog" aria-modal="true" @click.stop>
        <button class="close-btn" @click="$emit('close')" aria-label="Close modal">
          <Icon icon="material-symbols:close" />
        </button>
        <header class="auth-header">
          <nav class="tabs" role="tablist">
            <button :class="{ active: activeTab === 'login' }" @click="switchTab('login')" role="tab">
              Login
            </button>
            <button :class="{ active: activeTab === 'register' }" @click="switchTab('register')" role="tab">
              Register
            </button>
          </nav>
        </header>
        <main class="auth-body">
          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
            <fieldset class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:mail-outline" class="input-icon" />
                <input type="email" v-model="loginForm.email" placeholder="hello@example.com" required />
              </div>
            </fieldset>
            <fieldset class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:lock-outline" class="input-icon" />
                <input :type="showPassword ? 'text' : 'password'" v-model="loginForm.password" placeholder="••••••••"
                  required />
                <button type="button" class="toggle-password" @click="togglePasswordVisibility"
                  aria-label="Toggle password visibility">
                  <Icon :icon="showPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'" />
                </button>
              </div>
            </fieldset>
            <div class="forgot-password-link">
              <button type="button" @click="showForgotPassword = !showForgotPassword" class="link-button">
                {{ showForgotPassword ? 'Back to Login' : 'Forgot Password?' }}
              </button>
            </div>
            <div v-if="showForgotPassword" class="forgot-password-form">
              <fieldset class="form-group">
                <label>Email for Password Reset</label>
                <div class="input-wrapper">
                  <Icon icon="material-symbols:mail-outline" class="input-icon" />
                  <input type="email" v-model="forgotPasswordEmail" placeholder="hello@example.com" />
                </div>
              </fieldset>
              <button type="button" @click="handleForgotPassword" class="submit-btn" :disabled="isLoading">
                {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
              </button>
            </div>
            <button v-else type="submit" class="submit-btn" :disabled="isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
          <form v-else @submit.prevent="handleRegister" class="auth-form">
            <fieldset class="form-group">
              <label>Full Name</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:person-outline" class="input-icon" />
                <input type="text" v-model="registerForm.name" placeholder="John Doe" required />
              </div>
            </fieldset>
            <fieldset class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:mail-outline" class="input-icon" />
                <input type="email" v-model="registerForm.email" placeholder="hello@example.com" required />
              </div>
            </fieldset>
            <fieldset class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <Icon icon="material-symbols:lock-outline" class="input-icon" />
                <input :type="showRegisterPassword ? 'text' : 'password'" v-model="registerForm.password"
                  placeholder="••••••••" required />
                <button type="button" class="toggle-password" @click="toggleRegisterPasswordVisibility"
                  aria-label="Toggle password visibility">
                  <Icon
                    :icon="showRegisterPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'" />
                </button>
              </div>
              <aside v-if="registerForm.password" class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill"
                    :style="{ width: passwordStrength.percentage + '%', backgroundColor: passwordStrength.color }">
                  </div>
                </div>
                <span class="strength-label" :style="{ color: passwordStrength.color }">
                  {{ passwordStrength.label }}
                </span>
              </aside>
              <aside v-if="registerForm.password" class="password-requirements">
                <div class="requirement" :class="{ met: passwordRequirements.minLength }">
                  <Icon
                    :icon="passwordRequirements.minLength ? 'material-symbols:check-circle' : 'material-symbols:circle'" />
                  <span>At least 8 characters</span>
                </div>
                <div class="requirement" :class="{ met: passwordRequirements.hasUpperCase }">
                  <Icon
                    :icon="passwordRequirements.hasUpperCase ? 'material-symbols:check-circle' : 'material-symbols:circle'" />
                  <span>One uppercase letter</span>
                </div>
                <div class="requirement" :class="{ met: passwordRequirements.hasLowerCase }">
                  <Icon
                    :icon="passwordRequirements.hasLowerCase ? 'material-symbols:check-circle' : 'material-symbols:circle'" />
                  <span>One lowercase letter</span>
                </div>
                <div class="requirement" :class="{ met: passwordRequirements.hasNumber }">
                  <Icon
                    :icon="passwordRequirements.hasNumber ? 'material-symbols:check-circle' : 'material-symbols:circle'" />
                  <span>One number</span>
                </div>
                <div class="requirement" :class="{ met: passwordRequirements.hasSpecial }">
                  <Icon
                    :icon="passwordRequirements.hasSpecial ? 'material-symbols:check-circle' : 'material-symbols:circle'" />
                  <span>One special character (!@#$%...)</span>
                </div>
              </aside>
            </fieldset>
            <button type="submit" class="submit-btn" :disabled="isLoading">
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
        </main>
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
  max-width: 380px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  border: none;
  padding: 0;
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
  border: none;
  padding: 0;
  margin: 0;

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

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #9ca3af;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      transition: color 0.3s;

      &:hover {
        color: #e1306c;
      }
    }

    input {
      width: 100%;
      padding: 0.75rem 3rem 0.75rem 2.5rem;
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

  .password-strength {
    margin-top: 0.75rem;

    .strength-bar {
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 0.5rem;

      .strength-fill {
        height: 100%;
        transition: all 0.3s ease;
      }
    }

    .strength-label {
      font-size: 0.85rem;
      font-weight: 600;
    }
  }

  .password-requirements {
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 8px;

    .requirement {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #9ca3af;
      margin-bottom: 0.5rem;
      transition: color 0.3s;

      &:last-child {
        margin-bottom: 0;
      }

      &.met {
        color: #27ae60;

        svg {
          color: #27ae60;
        }
      }

      svg {
        font-size: 1rem;
        flex-shrink: 0;
      }
    }
  }
}

.forgot-password-link {
  text-align: right;
  margin-top: -0.5rem;
  margin-bottom: 1rem;

  .link-button {
    background: none;
    border: none;
    color: #e1306c;
    font-size: 0.9rem;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s;
    padding: 0;

    &:hover {
      color: #c13584;
      text-decoration: underline;
    }
  }
}

.forgot-password-form {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
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
