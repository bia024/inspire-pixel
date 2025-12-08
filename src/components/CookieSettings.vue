<script setup>
import { useCookieConsent } from '../composables/useCookieConsent.mjs'

const { consents, setConsent, closeSettings, acceptAll, rejectAll } = useCookieConsent()

const cookieTypes = [
  {
    key: 'essentials',
    label: 'Essenciais (sempre ativados)',
    description: 'Necessários para o funcionamento básico do site.',
  },
  {
    key: 'preferences',
    label: 'Preferências',
    description: 'Lembrar configurações como tema escuro/claro.',
  },
  {
    key: 'analytics',
    label: 'Análise',
    description: 'Melhorar o site com dados de uso (ex: buscas de imagens, descrições AI).',
  },
  { key: 'marketing', label: 'Marketing', description: 'Integrações externas como Spotify.' },
]

const handleSave = () => {
  closeSettings()
}

const handleAcceptAll = () => {
  acceptAll()
  closeSettings()
}

const handleRejectAll = () => {
  rejectAll()
  closeSettings()
}
</script>

<template>
  <section
    class="cookie-settings-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="cookie-settings-title"
  >
    <div
      class="cookie-settings-backdrop"
      @click="closeSettings"
      aria-label="Fechar configurações"
    ></div>
    <dialog class="cookie-settings-dialog" open>
      <header class="cookie-settings-header">
        <h2 id="cookie-settings-title" class="cookie-settings-title">Configurações de Cookies</h2>
        <button
          class="cookie-settings-close"
          @click="closeSettings"
          aria-label="Fechar configurações"
        >
          ×
        </button>
      </header>

      <div class="cookie-settings-content">
        <p class="cookie-settings-description">
          Escolha os tipos de cookies que você deseja permitir. Os cookies essenciais sempre estarão
          ativados.
        </p>

        <ul class="cookie-settings-list">
          <div v-for="type in cookieTypes" :key="type.key" class="cookie-settings-item">
            <label class="cookie-settings-label">
              <input
                type="checkbox"
                :id="`cookie-${type.key}`"
                :checked="consents[type.key]"
                :disabled="type.key === 'essentials'"
                @change="setConsent(type.key, $event.target.checked)"
                class="cookie-settings-checkbox"
              />
              <span class="cookie-settings-checkbox-custom"></span>
              <div>
                <span class="cookie-settings-name">{{ type.label }}</span>
                <p class="cookie-settings-desc">{{ type.description }}</p>
              </div>
            </label>
          </div>
        </ul>
      </div>

      <footer class="cookie-settings-footer">
        <button
          class="cookie-settings-button cookie-settings-button--reject"
          @click="handleRejectAll"
        >
          Rejeitar Todos
        </button>
        <button
          class="cookie-settings-button cookie-settings-button--accept"
          @click="handleAcceptAll"
        >
          Aceitar Todos
        </button>
        <button class="cookie-settings-button cookie-settings-button--save" @click="handleSave">
          Salvar Configurações
        </button>
      </footer>
    </dialog>
  </section>
</template>

<style scoped lang="scss">
.cookie-settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.cookie-settings-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.cookie-settings-dialog {
  background: white;
  border-radius: 0.5rem;
  max-width: 500px;
  max-height: 90vh;
  width: 100%;
  overflow-y: auto;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
}

.cookie-settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.cookie-settings-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.cookie-settings-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
}

.cookie-settings-content {
  padding: 1.5rem;
}

.cookie-settings-description {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.cookie-settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cookie-settings-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
}

.cookie-settings-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  width: 100%;
}

.cookie-settings-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;

  &:disabled + .cookie-settings-checkbox-custom {
    background: #f3f4f6;
    border-color: #d1d5db;
    cursor: not-allowed;
  }
}

.cookie-settings-checkbox-custom {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
  transition: all 0.2s ease;

  &::after {
    content: '';
    width: 0.75rem;
    height: 0.4rem;
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(-45deg) scale(0);
    transition: transform 0.2s ease;
  }
}

.cookie-settings-checkbox:checked + .cookie-settings-checkbox-custom {
  background: #3b82f6;
  border-color: #3b82f6;

  &::after {
    transform: rotate(-45deg) scale(1);
  }
}

.cookie-settings-checkbox:focus + .cookie-settings-checkbox-custom {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.cookie-settings-name {
  display: block;
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
}

.cookie-settings-desc {
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1.4;
}

.cookie-settings-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.cookie-settings-button {
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

  &--save {
    background: #28a745;
    color: white;

    &:hover {
      background: #218838;
      box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
    }
  }

  @media (max-width: 480px) {
    flex: 1;
    min-width: unset;
  }
}

@media (max-width: 768px) {
  .cookie-settings-dialog {
    margin: 1rem;
    max-height: 95vh;
  }

  .cookie-settings-header {
    padding: 1rem;
  }

  .cookie-settings-content {
    padding: 1rem;
  }

  .cookie-settings-footer {
    padding: 1rem;
    flex-direction: column;
  }
}
</style>
