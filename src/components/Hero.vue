<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

import ImgSwans from '../assets/swans.jpg'
import ImgSunset from '../assets/sunset.jpg'
import ImgBeach from '../assets/beach.png'
import ImgSunflowers from '../assets/sunflowers.jpg'
import ImgNight from '../assets/night.jpg'

const route = useRoute()
const { isPro } = useAuth()
const searchTerm = ref('')
const emit = defineEmits(['search'])

const premiumImages = [
  { src: ImgSwans, title: 'Graceful Swans' },
  { src: ImgSunset, title: 'Golden Sunset' },
  { src: ImgBeach, title: 'Paradise Beach' },
  { src: ImgSunflowers, title: 'Sunflower Field' },
  { src: ImgNight, title: 'Starry Night' }
]

const currentSlide = ref(0)
let slideInterval = null

const startSlideShow = () => {
  stopSlideShow()
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % premiumImages.length
  }, 3000)
}

const stopSlideShow = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % premiumImages.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + premiumImages.length) % premiumImages.length
}

const pauseSlideShow = () => {
  stopSlideShow()
}

const resumeSlideShow = () => {
  if (isPro.value) {
    startSlideShow()
  }
}

onMounted(() => {
  if (isPro.value) {
    startSlideShow()
  }
})

onUnmounted(() => {
  stopSlideShow()
})

watch(isPro, (newValue) => {
  if (newValue) {
    startSlideShow()
  } else {
    stopSlideShow()
  }
})

watch(() => route.query.q, (newQuery) => {
  if (newQuery !== undefined && newQuery !== searchTerm.value) {
    searchTerm.value = newQuery
    emit('search', newQuery)
  }
}, { immediate: true })

const handleSearch = () => {
  const term = searchTerm.value?.trim()
  if (term && term.length > 100) {
    searchTerm.value = term.substring(0, 100)
  }
  emit('search', searchTerm.value)
}

const executeSearch = () => {
  handleSearch()
  const gallery = document.getElementById('gallery') || document.querySelector('.gallery-section')
  if (gallery) {
    gallery.scrollIntoView({ behavior: 'smooth' })
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  emit('search', '')
}

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleSearch()
  }, 300)
}
</script>

<template>
  <section class="hero" id="hero" aria-label="Hero Section">
    <article class="hero-content">
      <header class="hero-text">
        <h2>Where landscapes turn into <span>inspiration</span></h2>
        <p>Discover colors, light, and scenery that spark new stories through the lens.</p>
        <form role="search" class="search-container" @submit.prevent="executeSearch">
          <button class="search-icon-btn" type="submit" aria-label="Search">
            <Icon icon="material-symbols:search" class="search-icon" />
          </button>
          <input type="text" v-model="searchTerm" placeholder="Search images..." @input="debouncedSearch"
            aria-label="Search images" />
          <button v-if="searchTerm" class="clear-search-btn" @click="clearSearch" aria-label="Clear search"
            type="button">
            <Icon icon="material-symbols:close" />
          </button>
        </form>
      </header>
      <aside v-if="isPro" class="hero-showcase pro-carousel" aria-label="Premium Collection">
        <article class="carousel-container" @mouseenter="pauseSlideShow" @mouseleave="resumeSlideShow">
          <transition-group name="slide" tag="section" class="carousel-slides">
            <figure v-for="(image, index) in premiumImages" :key="index" v-show="index === currentSlide"
              class="carousel-slide">
              <img :src="image.src" :alt="image.title" />
              <figcaption class="slide-caption">
                <Icon icon="material-symbols:workspace-premium" class="premium-badge" />
                <h3>{{ image.title }}</h3>
              </figcaption>
            </figure>
          </transition-group>
          <button class="carousel-nav prev" @click="prevSlide" aria-label="Previous slide">
            <Icon icon="material-symbols:chevron-left" />
          </button>
          <button class="carousel-nav next" @click="nextSlide" aria-label="Next slide">
            <Icon icon="material-symbols:chevron-right" />
          </button>
          <nav class="carousel-indicators" aria-label="Carousel navigation">
            <button v-for="(image, index) in premiumImages" :key="index" :class="{ active: index === currentSlide }"
              @click="currentSlide = index" :aria-label="'Go to slide ' + (index + 1)"></button>
          </nav>
        </article>
      </aside>
      <aside v-else class="hero-showcase" aria-label="Premium Content Preview">
        <figure class="showcase-card">
          <picture class="card-image">
            <img src="../assets/mountain.jpg" alt="Premium Image Preview" />
            <figcaption class="premium-overlay">
              <Icon icon="material-symbols:lock" class="lock-icon" />
              <span>Premium Collection</span>
            </figcaption>
          </picture>
          <figcaption class="card-content">
            <h3>Unlock the Extraordinary</h3>
            <p>Get unlimited access to 4K downloads and exclusive content.</p>
            <router-link :to="{ name: 'mode-selection' }" class="upgrade-link">
              Go Pro
              <Icon icon="material-symbols:arrow-forward" />
            </router-link>
          </figcaption>
        </figure>
      </aside>
    </article>
  </section>
</template>

<style scoped lang="scss">
.hero {
  background-image: url('../assets/beach.png');
  background-size: cover;
  background-position: center;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--overlay-bg);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4rem;
  }

  .hero-text {
    flex: 1;
    color: #fff;
    text-align: left;

    h2 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;

      span {
        color: #e1306c;
        font-style: italic;
      }
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      max-width: 500px;
      opacity: 0.9;
    }

    .search-container {
      position: relative;
      max-width: 500px;

      .search-icon-btn {
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #7f8c8d;
        transition: color 0.3s;
        z-index: 2;

        &:hover {
          color: #e1306c;
        }

        .search-icon {
          font-size: 1.2rem;
        }
      }

      input {
        width: 100%;
        padding: 1rem 3rem;
        font-size: 1.1rem;
        border-radius: 50px;
        border: 1px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
        box-shadow: 0 4px 15px var(--card-shadow);
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(225, 48, 108, 0.5);
        }
      }

      .clear-search-btn {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #999;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #333;
        }
      }
    }
  }

  .hero-showcase {
    flex: 0 0 350px;
    display: none;
    animation: float 6s ease-in-out infinite;

    .showcase-card {
      background: var(--overlay-light);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px var(--card-shadow);
      backdrop-filter: blur(10px);
      margin: 0;

      .card-image {
        position: relative;
        height: 200px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .premium-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          gap: 0.5rem;

          .lock-icon {
            font-size: 2rem;
            color: #f1c40f;
          }

          span {
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-size: 0.8rem;
          }
        }
      }

      .card-content {
        padding: 1.5rem;
        text-align: center;

        h3 {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .upgrade-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(90deg, #e74c3c, #f39c12);
          color: #fff;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s;

          &:hover {
            transform: translateY(-2px);
          }
        }
      }
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(-15px);
    }

    100% {
      transform: translateY(0px);
    }
  }

  .hero-showcase.pro-carousel {
    .carousel-container {
      background: var(--overlay-light);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px var(--card-shadow);
      backdrop-filter: blur(10px);
      position: relative;
      height: 350px;
    }

    .carousel-slides {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .carousel-slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .slide-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        padding: 2rem 1.5rem 1.5rem;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .premium-badge {
          font-size: 1.5rem;
          color: #f1c40f;
          flex-shrink: 0;
        }

        h3 {
          font-size: 1.3rem;
          margin: 0;
          font-weight: 600;
        }
      }
    }

    .carousel-indicators {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.5rem;
      z-index: 10;

      button {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid #fff;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s;
        padding: 0;

        &.active {
          background: #fff;
          width: 30px;
          border-radius: 5px;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .carousel-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      z-index: 10;
      opacity: 0;
      color: #2c3e50;
      font-size: 1.5rem;

      &:hover {
        background: #fff;
        transform: translateY(-50%) scale(1.1);
      }

      &.prev {
        left: 1rem;
      }

      &.next {
        right: 1rem;
      }
    }

    .carousel-container:hover .carousel-nav {
      opacity: 1;
    }
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.6s ease;
  }

  .slide-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }

  .slide-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }

  @media (min-width: 992px) {
    .hero-showcase {
      display: block;
    }
  }

  @media (max-width: 991px) {
    .hero-content {
      flex-direction: column;
      text-align: center;
    }

    .hero-text {
      text-align: center;

      .search-container {
        margin: 0 auto;
      }
    }
  }
}
</style>
