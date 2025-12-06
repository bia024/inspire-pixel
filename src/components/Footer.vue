<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useToast } from '../composables/useToast'
import emailjs from '@emailjs/browser'

const { addToast } = useToast()
const newsletterEmail = ref('')
const isSubscribing = ref(false)

const subscribeNewsletter = async () => {
  if (!newsletterEmail.value) {
    addToast('Please enter your email.', 'warning')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newsletterEmail.value)) {
    addToast('Please enter a valid email address.', 'error')
    return
  }

  isSubscribing.value = true

  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (serviceId && templateId && publicKey) {
      const templateParams = {
        to_email: newsletterEmail.value,
        message: 'Thank you for subscribing to InspirePixel Newsletter! Stay tuned for updates.',
        user_email: newsletterEmail.value,
        subject: 'Newsletter Subscription Confirmation',
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      addToast('Successfully subscribed! Check your email.', 'success')
    } else {
      const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]')
      if (!subscribers.includes(newsletterEmail.value)) {
        subscribers.push(newsletterEmail.value)
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers))
      }
      addToast('Successfully subscribed to our newsletter!', 'success')
    }

    newsletterEmail.value = ''
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    addToast('Error subscribing. Please try again later.', 'error')
  } finally {
    isSubscribing.value = false
  }
}
</script>

<template>
  <footer class="footer">
    <section class="footer-content">
      <section class="footer-brand">
        <h3 class="brand-name">InspirePixel</h3>
        <p class="brand-tagline">Where creativity meets inspiration</p>
        <p class="brand-description">
          Discover stunning visuals that spark your imagination and bring your creative projects to
          life.
        </p>
        <nav aria-label="Social Media">
          <ul class="social-links">
            <li>
              <a href="#" aria-label="Facebook" class="social-icon">
                <Icon icon="mdi:facebook" />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Instagram" class="social-icon">
                <Icon icon="mdi:instagram" />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Twitter" class="social-icon">
                <Icon icon="mdi:twitter" />
              </a>
            </li>
            <li>
              <a href="#" aria-label="LinkedIn" class="social-icon">
                <Icon icon="mdi:linkedin" />
              </a>
            </li>
          </ul>
        </nav>
      </section>
      <nav class="footer-section" aria-label="Footer Navigation">
        <h4>Quick Links</h4>
        <ul>
          <li><router-link :to="{ name: 'home' }">Home</router-link></li>
          <li>
            <router-link :to="{ name: 'stories' }"
              >Music Stories <span class="new-badge">New</span></router-link
            >
          </li>
          <li><router-link :to="{ name: 'about' }">About Us</router-link></li>
          <li><router-link :to="{ name: 'contact' }">Contact</router-link></li>
          <li><router-link :to="{ name: 'mode-selection' }">Go Pro</router-link></li>
        </ul>
      </nav>
      <nav class="footer-section" aria-label="Legal Navigation">
        <h4>Legal</h4>
        <ul>
          <li><router-link :to="{ name: 'privacy' }">Privacy Policy</router-link></li>
          <li><router-link :to="{ name: 'terms' }">Terms of Use</router-link></li>
          <li><router-link :to="{ name: 'dmca' }">Copyright / DMCA</router-link></li>
        </ul>
      </nav>
    </section>
    <section class="newsletter-section">
      <div class="newsletter-content">
        <div class="newsletter-text">
          <h3>
            <Icon icon="material-symbols:mail-outline" class="newsletter-icon" />
            Subscribe to Our Newsletter
          </h3>
          <p>Get the latest updates, exclusive content, and inspiration delivered to your inbox.</p>
        </div>
        <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
          <div class="input-group">
            <Icon icon="material-symbols:mail-outline" class="input-icon" />
            <input
              type="email"
              v-model="newsletterEmail"
              placeholder="Enter your email"
              aria-label="Email for newsletter"
              :disabled="isSubscribing"
            />
            <button type="submit" :disabled="isSubscribing" aria-label="Subscribe to newsletter">
              <span v-if="!isSubscribing">Subscribe</span>
              <span v-else>
                <Icon icon="svg-spinners:ring-resize" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
    <section class="footer-bottom">
      <p>
        &copy; {{ new Date().getFullYear() }} <span class="highlight">InspirePixel</span>. All
        rights reserved.
      </p>
    </section>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #e2e8f0;
  padding: 4rem 2rem 1.5rem;
  margin-top: auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background: linear-gradient(90deg, #e74c3c 0%, #f39c12 50%, #e74c3c 100%);
    background-size: 200% 100%;
    animation: gradientShift 3s ease infinite;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }

  .footer-brand {
    .brand-name {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      letter-spacing: -0.5px;
    }

    .brand-tagline {
      font-size: 0.95rem;
      color: #94a3b8;
      font-style: italic;
      margin-bottom: 1rem;
    }

    .brand-description {
      color: #cbd5e1;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }
  }

  .footer-section {
    h4 {
      font-size: 1.1rem;
      margin-bottom: 1.25rem;
      color: #fff;
      font-weight: 600;
      position: relative;
      padding-bottom: 0.5rem;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 1.875rem;
        height: 0.125rem;
        background: linear-gradient(90deg, #e74c3c, #f39c12);
      }
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: 0.75rem;

        a {
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s;
          display: inline-block;
          font-size: 0.95rem;

          &:hover {
            color: #f39c12;
            transform: translateX(0.3125rem);
          }

          .new-badge {
            background: linear-gradient(135deg, #e1306c, #c13584);
            color: white;
            font-size: 0.7rem;
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            margin-left: 0.3125rem;
            vertical-align: middle;
          }
        }
      }
    }
  }

  .social-links {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    list-style: none;
    padding: 0;

    li {
      display: inline-flex;
    }

    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.625rem;
      height: 2.625rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      color: #cbd5e1;
      font-size: 1.4rem;
      transition: all 0.3s;
      border: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        background: linear-gradient(135deg, #e74c3c, #f39c12);
        color: #fff;
        transform: translateY(-0.1875rem);
        box-shadow: 0 0.3125rem 0.9375rem rgba(231, 76, 60, 0.3);
        border-color: transparent;
      }
    }
  }

  .newsletter-section {
    max-width: 75rem;
    margin: 0 auto 3rem;
    padding: 3rem;
    background: linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .newsletter-content {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
      }
    }

    .newsletter-text {
      flex: 1;
      min-width: 15.625rem;

      h3 {
        font-size: 1.5rem;
        color: #fff;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        @media (max-width: 768px) {
          justify-content: center;
        }

        .newsletter-icon {
          font-size: 1.8rem;
          color: #f39c12;
        }
      }

      p {
        color: #cbd5e1;
        font-size: 0.95rem;
        line-height: 1.6;
      }
    }

    .newsletter-form {
      flex: 1;
      min-width: 18.75rem;

      .input-group {
        display: flex;
        position: relative;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3.125rem;
        padding: 0.25rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s;

        &:focus-within {
          border-color: #f39c12;
          box-shadow: 0 0 0 0.1875rem rgba(243, 156, 18, 0.2);
        }

        .input-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1.2rem;
          pointer-events: none;
        }

        input {
          flex: 1;
          padding: 0.875rem 1rem 0.875rem 3rem;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1rem;
          outline: none;

          &::placeholder {
            color: #94a3b8;
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }

        button {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%);
          color: #fff;
          border: none;
          border-radius: 3.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 7.5rem;

          &:hover:not(:disabled) {
            transform: translateY(-0.125rem);
            box-shadow: 0 0.3125rem 0.9375rem rgba(231, 76, 60, 0.4);
          }

          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  .footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    font-size: 0.9rem;

    .highlight {
      background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 600;
    }
  }
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@media (max-width: 968px) {
  .footer {
    .footer-content {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;

      .footer-brand {
        grid-column: 1 / -1;
      }
    }
  }
}

@media (max-width: 640px) {
  .footer {
    padding: 3rem 1.5rem 1.5rem;

    .footer-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .footer-brand {
      .brand-name {
        font-size: 1.75rem;
      }
    }
  }
}
</style>
