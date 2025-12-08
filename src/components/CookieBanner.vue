<script setup>
import { useCookieConsent } from '../composables/useCookieConsent.mjs'
import CookieSettings from './CookieSettings.vue'

const { needsConsent, acceptCookies, rejectCookies, showSettings, openSettings } =
  useCookieConsent()
</script>

<template>
  <aside
    v-if="needsConsent"
    class="cookie-banner"
    role="banner"
    aria-live="polite"
    aria-label="Banner de consentimento de cookies"
  >
    <div class="cookie-banner__content">
      <p class="cookie-banner__text">
        Usamos cookies para melhorar sua experiência no site.
        <a href="/privacy" class="cookie-banner__link">Saiba mais</a>
      </p>
      <div class="cookie-banner__actions">
        <button
          class="cookie-banner__button cookie-banner__button--settings"
          @click="openSettings"
          aria-label="Configurações de cookies"
        >
          Configurações
        </button>
        <button
          class="cookie-banner__button cookie-banner__button--reject"
          @click="rejectCookies"
          aria-label="Rejeitar cookies"
        >
          Rejeitar
        </button>
        <button
          class="cookie-banner__button cookie-banner__button--accept"
          @click="acceptCookies"
          aria-label="Aceitar cookies"
        >
          Aceitar
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  padding: 1rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
}

.cookie-banner__content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.cookie-banner__text {
  margin: 0;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
}

.cookie-banner__link {
  color: #007bff;
  text-decoration: underline;
  font-weight: 500;

  &:hover {
    color: #0056b3;
  }
}

.cookie-banner__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cookie-banner__button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  @media (min-width: 768px) {
    min-width: auto;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &--accept {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #0056b3, #004494);
      box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
    }
  }

  &--reject {
    background: #f8f9fa;
    color: #6c757d;
    border: 1px solid #dee2e6;

    &:hover {
      background: #e9ecef;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
