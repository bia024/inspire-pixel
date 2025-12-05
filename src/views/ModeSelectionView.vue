<script setup>
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '../composables/useToast'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'
import AuthModal from '../components/AuthModal.vue'

const router = useRouter()
const route = useRoute()
const { addToast } = useToast()
const { user, isAuthenticated, upgradeToPro } = useFirebaseAuth()

const showUpgradeModal = ref(false)
const isAuthModalOpen = ref(false)
const showCongrats = ref(false)
const isProcessingUpgrade = ref(false)

const confettiStyles = computed(() => {
  const styles = []
  for (let i = 0; i < 50; i++) {
    styles.push({
      '--delay': `${Math.random() * 2}s`,
      '--left': `${Math.random() * 100}%`,
      '--duration': `${2 + Math.random() * 3}s`
    })
  }
  return styles
})

onMounted(() => {
  if (route.query.redirect) {
    isAuthModalOpen.value = true
  }
})

/* * obs.: @param param o {string} mode */
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
  showUpgradeModal.value = true
}

const closeUpgradeModal = () => {
  showUpgradeModal.value = false
}

const handleAuthSuccess = () => {
  isAuthModalOpen.value = false
  setTimeout(() => {
    const redirectPath = route.query.redirect || { name: 'home' }
    router.push(redirectPath)
  }, 300)
}

const handleUpgrade = async () => {
  if (isProcessingUpgrade.value) return

  isProcessingUpgrade.value = true

  const result = await upgradeToPro()

  if (result.success) {
    closeUpgradeModal()
    showCongrats.value = true
    addToast('Upgrade successful! Welcome to Pro.', 'success')

    setTimeout(() => {
      showCongrats.value = false
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 300)
    }, 3000)
  } else {
    const errorMessage = result.message || 'Upgrade failed. Please try again.'
    addToast(errorMessage, 'error')
  }

  isProcessingUpgrade.value = false
}
</script>

<template>
  <main class="mode-selection">
    <header class="welcome-header">
      <figure class="brand-identity">
        <img src="../assets/logo.svg" alt="InspirePixel Logo" class="official-logo"
          aria-label="InspirePixel Official Logo" />
        <figcaption class="brand-name">InspirePixel</figcaption>
      </figure>
      <p class="welcome-text">Welcome! Let's get started by choosing your plan.</p>
    </header>
    <section class="container" aria-labelledby="choose-plan-title">
      <header class="page-header">
        <h2 id="choose-plan-title" class="title">Choose Your Plan</h2>
        <p class="subtitle">Unlock the power of inspiration with our premium features</p>
      </header>
      <div class="plans" role="radiogroup" aria-label="Subscription Plans">
        <article class="plan-card free-plan" role="radio" aria-checked="false" tabindex="0" @click="selectMode('free')">
          <header class="plan-header">
            <h2>Free</h2>
            <p class="price">
              <span class="amount">$0</span>
              <span class="period">/month</span>
            </p>
          </header>
          <ul class="plan-features-list" role="list">
            <li role="listitem">
              <Icon icon="material-symbols:check" aria-hidden="true" /> Access to 6 curated images
            </li>
            <li role="listitem">
              <Icon icon="material-symbols:check" aria-hidden="true" /> Basic search functionality
            </li>
            <li role="listitem">
              <Icon icon="material-symbols:check" aria-hidden="true" /> Favorite images
            </li>
            <li role="listitem" class="feature-disabled">
              <Icon icon="material-symbols:close" class="disabled" aria-hidden="true" /> High-resolution downloads
            </li>
            <li role="listitem" class="feature-disabled">
              <Icon icon="material-symbols:close" class="disabled" aria-hidden="true" /> Unlimited image access
            </li>
            <li role="listitem" class="feature-disabled">
              <Icon icon="material-symbols:close" class="disabled" aria-hidden="true" /> Commercial use rights
            </li>
          </ul>
          <button class="plan-button free-button" @click.stop="selectMode('free')" aria-label="Select Free Plan">
            Start for Free
          </button>
        </article>
        <article class="plan-card pro-plan" role="radio" aria-checked="false" tabindex="0" @click="openProModal">
          <span class="plan-badge">Most Popular</span>
          <header class="plan-header">
            <h2>Pro</h2>
            <p class="price">
              <span class="amount">$9.99</span>
              <span class="period">/month</span>
            </p>
          </header>
          <ul class="plan-features-list" role="list">
            <li role="listitem">
              <Icon icon="material-symbols:check" aria-hidden="true" /> Unlimited image access
            </li>
            <li role="listitem">
              <Icon icon="material-symbols:check" aria-hidden="true" /> High-resolution downloads
            </li>
            <li role="listitem">
              <Icon icon="material-symbols:check" aria-hidden="true" /> Commercial use rights
            </li>
            <li role="listitem">
              <Icon icon="material-symbols:check" aria-hidden="true" /> Advanced search & filters
            </li>
            <li role="listitem">
              <Icon icon="material-symbols:check" aria-hidden="true" /> Priority support
            </li>
            <li role="listitem">
              <Icon icon="material-symbols:check" aria-hidden="true" /> Exclusive premium content
            </li>
          </ul>
          <button class="plan-button pro-button" @click.stop="openProModal" aria-label="Upgrade to Pro Plan">
            Upgrade to Pro
          </button>
        </article>
      </div>
      <footer class="guarantee">
        <Icon icon="material-symbols:verified" aria-hidden="true" />
        <span>30-day money-back guarantee</span>
      </footer>
    </section>
    <div v-if="showUpgradeModal" class="modal-overlay" @click="closeUpgradeModal" role="dialog" aria-modal="true"
      aria-labelledby="modal-upgrade-title">
      <section class="modal-content" @click.stop>
        <header class="modal-header">
          <h2 id="modal-upgrade-title">Activate Pro Mode</h2>
          <button class="close-button" @click="closeUpgradeModal" aria-label="Close upgrade modal">
            <Icon icon="material-symbols:close" aria-hidden="true" />
          </button>
        </header>
        <div class="modal-padding-content">
          <p>Confirm your upgrade to Pro Mode? You will get unlimited access to all premium features.</p>
          <div class="email-input-wrapper">
            <label for="user-email">Account Email</label>
            <div class="input-with-icon">
              <input id="user-email" type="email" :value="user?.email" readonly class="email-input"
                aria-describedby="email-readonly-info" />
              <span class="lock-emoji" title="This field is read-only" id="email-readonly-info"
                aria-hidden="true">🔒</span>
            </div>
          </div>
        </div>
        <footer class="modal-footer">
          <button class="cancel-button" @click="closeUpgradeModal">Cancel</button>
          <button class="submit-button" @click="handleUpgrade" :disabled="isProcessingUpgrade">
            {{ isProcessingUpgrade ? 'Processing...' : 'Confirm Upgrade' }}
          </button>
        </footer>
      </section>
    </div>
    <AuthModal :is-open="isAuthModalOpen" @close="isAuthModalOpen = false" @register-success="handleAuthSuccess" />
    <transition name="congrats-fade">
      <div v-if="showCongrats" class="congrats-overlay" role="alert" aria-live="assertive">
        <section class="congrats-modal">
          <div class="confetti-container">
            <div class="confetti" v-for="(style, n) in confettiStyles" :key="n" :style="style"></div>
          </div>
          <div class="congrats-content-inner">
            <div class="success-icon">
              <Icon icon="material-symbols:check-circle" aria-hidden="true" />
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
        </section>
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
}

.welcome-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease;

  .brand-identity {
    margin: 0;

    .official-logo {
      height: 5rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 0.25rem 0.5rem rgba(0, 0, 0, 0.2));
    }

    .brand-name {
      font-size: 2.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 0.5rem;
      text-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.2);
    }
  }

  .welcome-text {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 300;
  }
}

.container {
  max-width: 75rem;
  width: 100%;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 4rem;
  max-width: 37.5rem;
  margin-left: auto;
  margin-right: auto;
}

.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(21.875rem, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.plan-card {
  background: #fff;
  border-radius: 1.25rem;
  padding: 2.5rem;
  box-shadow: 0 1.25rem 2.5rem rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-0.625rem);
    box-shadow: 0 1.875rem 3.75rem rgba(0, 0, 0, 0.2);
  }
}

.free-plan {
  border: 0.125rem solid #e1e8ed;
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
    height: 0.25rem;
    background: linear-gradient(90deg, #e74c3c, #f39c12);
  }
}

.plan-badge {
  position: absolute;
  top: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #e74c3c, #f39c12);
  color: #fff;
  padding: 0.5rem 1.5rem;
  border-radius: 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
}

.plan-header {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;

    .pro-plan & {
      color: #fff;
    }
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

.plan-features-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;

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

  .feature-disabled {
    color: #7f8c8d;
    opacity: 0.8;
  }
}

.plan-button {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 3.125rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.03125rem;
}

.free-button {
  background: #fff;
  color: #667eea;
  border: 0.125rem solid #667eea;

  &:hover {
    background: #667eea;
    color: #fff;
    transform: translateY(-0.125rem);
  }
}

.pro-button {
  background: linear-gradient(90deg, #e74c3c, #f39c12);
  color: #fff;
  box-shadow: 0 0.25rem 0.9375rem rgba(231, 76, 60, 0.3);

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.375rem 1.25rem rgba(231, 76, 60, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  margin-top: 3rem;
}

@media (max-width: 48rem) {
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
  border-radius: 1.25rem;
  width: 90%;
  max-width: 31.25rem;
  box-shadow: 0 1.25rem 2.5rem rgba(0, 0, 0, 0.2);
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

.modal-padding-content {
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
  border: 0.125rem solid #e1e8ed;
  border-radius: 0.625rem;
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

  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.cancel-button {
  background: #6c757d;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.625rem;
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
  border-radius: 0.625rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-0.125rem);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-1.25rem);
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
      border: 0.125rem solid var(--border-color);
      border-radius: 0.75rem;
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
        box-shadow: 0 0 0 0.1875rem rgba(102, 126, 234, 0.1);
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
  border-radius: 1.5rem;
  padding: 3rem;
  max-width: 31.25rem;
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
  width: 0.625rem;
  height: 0.625rem;
  background: #f39c12;
  top: -0.625rem;
  animation: confettiFall var(--duration) linear infinite var(--delay);
}

@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
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
  border-radius: 3.125rem;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.125rem;
  margin-bottom: 1rem;
  animation: scaleIn 0.6s ease 0.6s both;
  box-shadow: 0 0.25rem 1.25rem rgba(231, 76, 60, 0.4);
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
    transform: translateY(-1.25rem);
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