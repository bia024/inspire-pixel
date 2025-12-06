<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'
import ImgSwans from '../assets/swans.jpg'
import ImgSunset from '../assets/sunset.jpg'
import ImgBeach from '../assets/beach.png'
import ImgSunflowers from '../assets/sunflowers.jpg'
import ImgNight from '../assets/night.jpg'
import ImgMountain from '../assets/mountain.jpg'

const route = useRoute()
const { isPro } = useFirebaseAuth()
const searchTerm = ref('')
const emit = defineEmits(['search'])

const premiumImages = [
  { src: ImgSwans, title: 'Graceful Swans' },
  { src: ImgSunset, title: 'Golden Sunset' },
  { src: ImgBeach, title: 'Paradise Beach' },
  { src: ImgSunflowers, title: 'Sunflower Field' },
  { src: ImgNight, title: 'Starry Night' },
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

watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery !== undefined && newQuery !== searchTerm.value) {
      searchTerm.value = newQuery
      emit('search', newQuery)
    }
  },
  { immediate: true }
)

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
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search images..."
            @input="debouncedSearch"
            aria-label="Search images"
          />
          <button
            v-if="searchTerm"
            class="clear-search-btn"
            @click="clearSearch"
            aria-label="Clear search"
            type="button"
          >
            <Icon icon="material-symbols:close" />
          </button>
        </form>
      </header>
      <aside
        v-if="isPro"
        class="hero-showcase pro-carousel"
        aria-label="Premium Collection Carousel"
      >
        <article
          class="carousel-container"
          @mouseenter="pauseSlideShow"
          @mouseleave="resumeSlideShow"
        >
          <transition-group name="slide" tag="section" class="carousel-slides">
            <figure
              v-for="(image, index) in premiumImages"
              :key="index"
              v-show="index === currentSlide"
              class="carousel-slide"
              role="img"
              :aria-label="image.title"
            >
              <img :src="image.src" :alt="image.title" loading="lazy" />
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
            <button
              v-for="(image, index) in premiumImages"
              :key="index"
              :class="{ active: index === currentSlide }"
              @click="currentSlide = index"
              :aria-label="'Go to slide ' + (index + 1)"
            ></button>
          </nav>
        </article>
      </aside>
      <aside v-else class="hero-showcase" aria-label="Premium Content Preview">
        <figure class="showcase-card">
          <img :src="ImgMountain" alt="Premium Image Preview" loading="lazy" />
          <figcaption class="premium-overlay">
            <Icon icon="material-symbols:lock" class="lock-icon" />
            <span>Premium Collection</span>
          </figcaption>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.hero {
  background-image: url('../assets/beach.png');
  background-size: cover;
  background-position: center;
  height: 37.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 2rem;
  font-family: 'Inter', sans-serif;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 75rem;
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
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.2;

      span {
        color: #e1306c;
        font-style: italic;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
      }
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      max-width: 31.25rem;
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
        color: var(--text-secondary);
        transition: color 0.3s;
        z-index: 2;

        &:hover {
          color: #e1306c;
        }

        .search-icon {
          font-size: 1.5rem;
        }
      }

      input {
        width: 100%;
        padding: 1rem 3rem;
        font-size: 1.1rem;
        border-radius: 3.125rem;
        border: 0.125rem solid transparent;
        background: #fff;
        color: #333;

        [data-theme='dark'] & {
          background: #2c3e50;
          color: #fff;
          border-color: #3498db;
        }

        box-shadow: 0 0.5rem 1.875rem var(--card-shadow);
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #e1306c;
          box-shadow: 0 0 0 0.1875rem rgba(225, 48, 108, 0.5);
        }
      }

      .clear-search-btn {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
        transition: color 0.3s;
        z-index: 2;

        &:hover {
          color: #e1306c;
        }
      }
    }
  }

  .hero-showcase {
    flex: 0 0 21.875rem;
    display: none;
    animation: float 6s ease-in-out infinite;

    .showcase-card {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin: 0;

      img {
        width: 100%;
        height: 12.5rem;
        object-fit: cover;
        display: block;
      }

      .premium-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 12.5rem;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        gap: 0.5rem;

        .lock-icon {
          font-size: 2.5rem;
          color: #f1c40f;
        }

        span {
          font-weight: 600;
          letter-spacing: 0.0625rem;
          text-transform: uppercase;
          font-size: 0.9rem;
        }
      }

      .card-content {
        min-height: 11.25rem;
        width: 100%;
        padding: 1.5rem;
        text-align: center;
        background: rgba(255, 255, 255, 0.9);

        h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .upgrade-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(90deg, #e1306c, #f77737);
          color: #fff;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          transition:
            transform 0.3s,
            box-shadow 0.3s;

          &:hover {
            transform: translateY(-0.1875rem);
            box-shadow: 0 0.625rem 1.25rem rgba(225, 48, 108, 0.4);
          }
        }
      }
    }
  }

  .carousel-container {
    position: relative;
    width: 100%;
    aspect-ratio: 21.875 / 23.75;
    border-radius: 1.25rem;
    overflow: hidden;
    box-shadow: 0 1.25rem 2.5rem rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(0.625rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.2);
  }

  .carousel-slides {
    width: 100%;
    height: 100%;
  }

  .carousel-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .slide-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    color: white;
    text-align: left;

    .premium-badge {
      color: #f1c40f;
      margin-right: 0.5rem;
      font-size: 1.2rem;
      vertical-align: middle;
    }

    h3 {
      display: inline;
      vertical-align: middle;
      font-size: 1rem;
    }
  }

  .carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.7);
    border: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #333;
    font-size: 1.5rem;
    opacity: 0;
    transition:
      opacity 0.3s,
      transform 0.3s;

    &.prev {
      left: 0.625rem;
    }

    &.next {
      right: 0.625rem;
    }

    &:hover {
      background: #fff;
      transform: translateY(-50%) scale(1.1);
    }
  }

  .carousel-container:hover .carousel-nav {
    opacity: 1;
  }

  .carousel-indicators {
    position: absolute;
    bottom: 0.625rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;

    button {
      width: 0.625rem;
      height: 0.625rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      border: none;
      cursor: pointer;
      transition: background 0.3s;

      &.active {
        background: #fff;
      }
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0rem);
    }

    50% {
      transform: translateY(-0.9375rem);
    }

    100% {
      transform: translateY(0rem);
    }
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
      gap: 2rem;
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
