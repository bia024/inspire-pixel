<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '../composables/useToast'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'
import AuthModal from '../components/AuthModal.vue'

const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const isAuthModalOpen = ref(false)
const { addToast } = useToast()
const { user, isAuthenticated, upgradeToPro } = useFirebaseAuth()

onMounted(() => {
  if (route.query.redirect) {
    isAuthModalOpen.value = true
  }
})

const selectMode = (mode) => {
  if (mode === 'free') {
    if (!isAuthenticated.value) {
      isAuthModalOpen.value = true
      return
    }
    router.push({ name: 'home' })
  }
}

const openProModal = () => {
  if (!isAuthenticated.value) {
    isAuthModalOpen.value = true
    return
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleAuthSuccess = () => {
  isAuthModalOpen.value = false
  setTimeout(() => {
    const redirectPath = route.query.redirect || { name: 'home' }
    router.push(redirectPath)
  }, 300)
}

const showCongrats = ref(false)

const handleUpgrade = async () => {
  const result = await upgradeToPro()
  
  if (result.success) {
    closeModal()
    showCongrats.value = true
    
    setTimeout(() => {
      showCongrats.value = false
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 300)
    }, 3000)
  } else {
    addToast(result.message, 'error')
  }
}
</script>

<template>
  <main class="mode-selection">
    <div class="welcome-header">
      <img src="../assets/logo.svg" alt="InspirePixel Logo" class="official-logo" />
      <h1 class="brand-name">InspirePixel</h1>
      <p class="welcome-text">Welcome! Let's get started by choosing your plan.</p>
    </div>
    <section class="container">
      <header class="page-header">
        <h2 class="title">Choose Your Plan</h2>
        <p class="subtitle">Unlock the power of inspiration with our premium features</p>
      </header>
      <div class="plans">
        <article class="plan-card free-plan">
          <header class="plan-header">
            <h2>Free</h2>
            <div class="price">
              <span class="amount">$0</span>
              <span class="period">/month</span>
            </div>
          </header>
          <div class="plan-features">
            <ul>
              <li>
                <Icon icon="material-symbols:check" /> Access to 6 curated images
              </li>
              <li>
                <Icon icon="material-symbols:check" /> Basic search functionality
              </li>
              <li>
                <Icon icon="material-symbols:check" /> Favorite images
              </li>
              <li>
                <Icon icon="material-symbols:close" class="disabled" /> High-resolution downloads
              </li>
              <li>
                <Icon icon="material-symbols:close" class="disabled" /> Unlimited image access
              </li>
              <li>
                <Icon icon="material-symbols:close" class="disabled" /> Commercial use rights
              </li>
            </ul>
          </div>
          <button class="plan-button free-button" @click="selectMode('free')">
            Start for Free
          </button>
        </article>
        <article class="plan-card pro-plan">
          <div class="plan-badge">Most Popular</div>
          <header class="plan-header">
            <h2>Pro</h2>
            <div class="price">
              <span class="amount">$9.99</span>
              <span class="period">/month</span>
            </div>
          </header>
          <div class="plan-features">
            <ul>
              <li>
                <Icon icon="material-symbols:check" /> Unlimited image access
              </li>
              <li>
                <Icon icon="material-symbols:check" /> High-resolution downloads
              </li>
              <li>
                <Icon icon="material-symbols:check" /> Commercial use rights
              </li>
              <li>
                <Icon icon="material-symbols:check" /> Advanced search & filters
              </li>
              <li>
                <Icon icon="material-symbols:check" /> Priority support
              </li>
              <li>
                <Icon icon="material-symbols:check" /> Exclusive premium content
              </li>
            </ul>
          </div>
          <button class="plan-button pro-button" @click="openProModal">Upgrade to Pro</button>
        </article>
      </div>
      <div class="guarantee">
        <Icon icon="material-symbols:verified" />
        <span>30-day money-back guarantee</span>
      </div>
    </section>
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <header class="modal-header">
          <h2>Activate Pro Mode</h2>
          <button class="close-button" @click="closeModal">
            <Icon icon="material-symbols:close" />
          </button>
        </header>
        <div class="modal-body">
          <p>Confirm your upgrade to Pro Mode? You will get unlimited access to all premium features.</p>
          <div class="email-input-wrapper">
            <label for="user-email">Account Email</label>
            <div class="input-with-icon">
              <input 
                id="user-email"
                type="email" 
                :value="user?.email" 
                readonly 
                class="email-input"
              />
              <span class="lock-emoji" title="This field is read-only">🔒</span>
            </div>
          </div>
        </div>
        <footer class="modal-footer">
          <button class="cancel-button" @click="closeModal">Cancel</button>
          <button class="submit-button" @click="handleUpgrade">Confirm Upgrade</button>
        </footer>
      </div>
    </div>
    <AuthModal :is-open="isAuthModalOpen" @close="isAuthModalOpen = false" @register-success="handleAuthSuccess" />
    <transition name="congrats-fade">
      <div v-if="showCongrats" class="congrats-overlay">
        <div class="congrats-modal">
          <div class="confetti-container">
            <div class="confetti" v-for="n in 50" :key="n"></div>
          </div>
          <div class="congrats-content">
            <div class="success-icon">
              <Icon icon="material-symbols:check-circle" />
            </div>
            <h2 class="congrats-title">Congratulations! 🎉</h2>
            <p class="congrats-message">
              You're now a <strong>Pro Member</strong>!
            </p>
            <div class="pro-badge-large">PRO</div>
            <p class="congrats-subtitle">
              Enjoy unlimited access to all premium features
            </p>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<style scoped lang="scss">
.mode-selection {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  .welcome-header {
    text-align: center;
    margin-bottom: 3rem;
    animation: fadeInDown 0.6s ease;

    .official-logo {
      height: 80px;
      margin-bottom: 1rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    .brand-name {
      font-size: 2.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .welcome-text {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 300;
    }
  }

  .container {
    max-width: 1200px;
    width: 100%;
  }

  .title {
    font-size: 3rem;
    font-weight: 800;
    color: #fff;
    text-align: center;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    margin-bottom: 4rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .plan-card {
    background: #fff;
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
    }
  }

  .free-plan {
    border: 2px solid #e1e8ed;
  }

  .pro-plan {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #e74c3c, #f39c12);
    }
  }

  .plan-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #e74c3c, #f39c12);
    color: #fff;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .plan-header {
    text-align: center;
    margin-bottom: 2rem;

    h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
  }

  .price {
    .amount {
      font-size: 3rem;
      font-weight: 800;
    }

    .period {
      font-size: 1rem;
      opacity: 0.8;
    }
  }

  .plan-features {
    margin-bottom: 2rem;

    ul {
      list-style: none;
      padding: 0;

      li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        font-size: 1rem;

        .disabled {
          color: #e74c3c;
        }
      }
    }
  }

  .plan-button {
    width: 100%;
    padding: 1rem 2rem;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .free-button {
    background: #fff;
    color: #667eea;
    border: 2px solid #667eea;

    &:hover {
      background: #667eea;
      color: #fff;
      transform: translateY(-2px);
    }
  }

  .pro-button {
    background: linear-gradient(90deg, #e74c3c, #f39c12);
    color: #fff;
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
    }
  }

  .guarantee {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .mode-selection {
    padding: 1rem;

    .title {
      font-size: 2.5rem;
    }

    .plans {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .plan-card {
      padding: 2rem;
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.modal-body {
  padding: 2rem;

  p {
    margin-bottom: 1rem;
    color: #555;
    font-size: 1rem;
  }
}

.email-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    color: #7f8c8d;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
}

.cancel-button {
  background: #6c757d;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #5a6268;
  }
}

.submit-button {
  background: linear-gradient(90deg, #e74c3c, #f39c12);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100vh);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.email-input-wrapper {
  margin-top: 1.5rem;
  text-align: left;

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }

  .input-with-icon {
    position: relative;
    display: flex;
    align-items: center;

    .email-input {
      width: 100%;
      padding: 0.875rem 3rem 0.875rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      font-size: 1rem;
      background: var(--bg-secondary);
      color: #999;
      cursor: not-allowed;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        background: var(--bg-primary);
      }

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    }

    .lock-emoji {
      position: absolute;
      right: 1rem;
      font-size: 1.2rem;
      opacity: 0.6;
      transition: all 0.3s ease;
      cursor: help;
    }

    &:hover .lock-emoji {
      opacity: 1;
      transform: scale(1.2);
    }
  }
}

.mode-selection {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.congrats-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.congrats-modal {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 3rem;
  max-width: 500px;
  text-align: center;
  animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  overflow: hidden;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #f39c12;
  top: -10%;
  animation: confettiFall 3s linear infinite;
  
  &:nth-child(odd) {
    background: #e74c3c;
  }
  
  &:nth-child(3n) {
    background: #3498db;
  }
  
  &:nth-child(4n) {
    background: #2ecc71;
  }
  
  @for $i from 1 through 50 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      animation-delay: random(3000) * 0.001s;
      animation-duration: (2 + random(2)) * 1s;
    }
  }
}

@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}

.congrats-content {
  position: relative;
  z-index: 1;
}

.success-icon {
  font-size: 5rem;
  color: #2ecc71;
  margin-bottom: 1rem;
  animation: scaleIn 0.6s ease 0.3s both;
}

.congrats-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 1rem;
  animation: slideDown 0.6s ease 0.4s both;
}

.congrats-message {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1.5rem;
  animation: slideDown 0.6s ease 0.5s both;
  
  strong {
    color: #f39c12;
    font-weight: 700;
  }
}

.pro-badge-large {
  display: inline-block;
  background: linear-gradient(90deg, #e74c3c, #f39c12);
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  animation: scaleIn 0.6s ease 0.6s both;
  box-shadow: 0 4px 20px rgba(231, 76, 60, 0.4);
}

.congrats-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  animation: slideDown 0.6s ease 0.7s both;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideDown {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.congrats-fade-enter-active,
.congrats-fade-leave-active {
  transition: opacity 0.3s ease;
}

.congrats-fade-enter-from,
.congrats-fade-leave-to {
  opacity: 0;
}
</style>
