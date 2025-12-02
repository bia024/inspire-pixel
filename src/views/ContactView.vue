<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import emailjs from '@emailjs/browser'
import { useToast } from '../composables/useToast'

const name = ref('')
const email = ref('')
const message = ref('')
const isSubmitting = ref(false)
const { addToast } = useToast()

const submitForm = async () => {
  if (!name.value || !email.value || !message.value) {
    addToast('Please fill in all fields.', 'warning')
    return
  }

  isSubmitting.value = true

  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    // Check if keys are configured
    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS configuration missing.')
      addToast('System configuration error: Email service not configured.', 'error')
      return
    }

    const templateParams = {
      from_name: name.value,
      from_email: email.value,
      message: message.value,
    }

    await emailjs.send(serviceId, templateId, templateParams, publicKey)

    addToast('Message sent successfully! We will get back to you soon.', 'success')
    name.value = ''
    email.value = ''
    message.value = ''
  } catch (error) {
    console.error('Error sending message:', error)
    addToast('Error sending message. Please try again later.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="contact-view">
    <section class="container">
      <header class="page-header">
        <h1 class="page-title">Contact & Support</h1>
        <p class="page-subtitle">We'd love to hear from you. Send us a message!</p>
      </header>

      <div class="contact-content">
        <address class="contact-info">
          <article class="info-item">
            <Icon icon="material-symbols:mail-outline" class="icon" />
            <div>
              <h3>Email Us</h3>
              <p>support@inspirapixel.com</p>
            </div>
          </article>
          <article class="info-item">
            <Icon icon="material-symbols:location-on-outline" class="icon" />
            <div>
              <h3>Location</h3>
              <p>123 Creative Ave, Design City, DC 10101</p>
            </div>
          </article>
          <article class="info-item">
            <Icon icon="material-symbols:schedule-outline" class="icon" />
            <div>
              <h3>Business Hours</h3>
              <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </article>
        </address>

        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="name" placeholder="Your Name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Your Email" required />
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="message"
              rows="5"
              placeholder="How can we help you?"
              required
            ></textarea>
          </div>
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.contact-view {
  padding: 4rem 2rem;
  background-color: #f8f9fa;
  flex: 1;

  .container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .page-title {
    text-align: center;
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .page-subtitle {
    text-align: center;
    color: #7f8c8d;
    margin-bottom: 4rem;
    font-size: 1.1rem;
  }

  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 4rem;
    background: #fff;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  .contact-info {
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 2rem;

      .icon {
        font-size: 2rem;
        color: #e74c3c;
        background: rgba(231, 76, 60, 0.1);
        padding: 0.5rem;
        border-radius: 50%;
      }

      h3 {
        font-size: 1.1rem;
        margin-bottom: 0.2rem;
        color: #2c3e50;
      }

      p {
        color: #7f8c8d;
      }
    }
  }

  .contact-form {
    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #2c3e50;
        font-weight: 600;
      }

      input,
      textarea {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #e1e8ed;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s;

        &:focus {
          outline: none;
          border-color: #e74c3c;
        }
      }
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(90deg, #e74c3c, #f39c12);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-2px);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .contact-view {
    padding: 2rem 1rem;

    .contact-content {
      grid-template-columns: 1fr;
      gap: 3rem;
      padding: 2rem;
    }
  }
}
</style>
