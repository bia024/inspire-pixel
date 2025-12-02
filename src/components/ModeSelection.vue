<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import emailjs from '@emailjs/browser'

const emit = defineEmits(['selectMode'])

const showModal = ref(false)
const email = ref('')

const selectMode = (mode) => {
  localStorage.setItem('userMode', mode)
  emit('selectMode', mode)
}

const openProModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  email.value = ''
}

const submitRegistration = async () => {
  if (email.value) {
    try {
      // Configurações do EmailJS usando variáveis de ambiente
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        alert('Configuração do EmailJS incompleta. Verifique as variáveis de ambiente.')
        return
      }

      const templateParams = {
        to_email: email.value,
        message: 'Bem-vindo ao Modo Pro! Aqui estão as instruções para ativar seu plano premium.',
        user_email: email.value,
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      alert(`Email enviado com sucesso para ${email.value}! Verifique sua caixa de entrada.`)
      selectMode('pro')
      closeModal()
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      alert('Erro ao enviar email. Tente novamente mais tarde.')
    }
  } else {
    alert('Por favor, insira um email válido.')
  }
}
</script>

<template>
  <section class="mode-selection">
    <div class="container">
      <h1 class="title">Escolha Seu Plano</h1>
      <p class="subtitle">Desbloqueie o poder da inspiração com nossos recursos premium</p>

      <div class="plans">
        <div class="plan-card free-plan">
          <div class="plan-header">
            <h2>Free</h2>
            <div class="price">
              <span class="amount">$0</span>
              <span class="period">/month</span>
            </div>
          </div>
          <div class="plan-features">
            <ul>
              <li><Icon icon="material-symbols:check" /> Acesso a 6 imagens curadas</li>
              <li><Icon icon="material-symbols:check" /> Funcionalidade básica de busca</li>
              <li><Icon icon="material-symbols:check" /> Favoritar imagens</li>
              <li>
                <Icon icon="material-symbols:close" class="disabled" /> Downloads em alta resolução
              </li>
              <li>
                <Icon icon="material-symbols:close" class="disabled" /> Acesso ilimitado a imagens
              </li>
              <li>
                <Icon icon="material-symbols:close" class="disabled" /> Direitos de uso comercial
              </li>
            </ul>
          </div>
          <button class="plan-button free-button" @click="selectMode('free')">
            Começar Grátis
          </button>
        </div>

        <div class="plan-card pro-plan">
          <div class="plan-badge">Most Popular</div>
          <div class="plan-header">
            <h2>Pro</h2>
            <div class="price">
              <span class="amount">$9.99</span>
              <span class="period">/month</span>
            </div>
          </div>
          <div class="plan-features">
            <ul>
              <li><Icon icon="material-symbols:check" /> Acesso ilimitado a imagens</li>
              <li><Icon icon="material-symbols:check" /> Downloads em alta resolução</li>
              <li><Icon icon="material-symbols:check" /> Direitos de uso comercial</li>
              <li><Icon icon="material-symbols:check" /> Busca avançada e filtros</li>
              <li><Icon icon="material-symbols:check" /> Suporte prioritário</li>
              <li><Icon icon="material-symbols:check" /> Conteúdo premium exclusivo</li>
            </ul>
          </div>
          <button class="plan-button pro-button" @click="openProModal">Atualizar para Pro</button>
        </div>
      </div>

      <div class="guarantee">
        <Icon icon="material-symbols:verified" />
        <span>Garantia de reembolso de 30 dias</span>
      </div>
    </div>

    <!-- Modal de Cadastro Pro -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Ativar Modo Pro</h2>
          <button class="close-button" @click="closeModal">
            <Icon icon="material-symbols:close" />
          </button>
        </div>
        <div class="modal-body">
          <p>Insira seu email para receber instruções de ativação do modo Pro.</p>
          <input
            v-model="email"
            type="email"
            placeholder="Seu email"
            class="email-input"
            @keyup.enter="submitRegistration"
          />
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="closeModal">Cancelar</button>
          <button class="submit-button" @click="submitRegistration">Enviar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.mode-selection {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

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

// Modal Styles
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
</style>
