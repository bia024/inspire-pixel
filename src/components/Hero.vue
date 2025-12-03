<script setup>
import { ref, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchTerm = ref('')
const emit = defineEmits(['search'])

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
    <div class="hero-content">
      <div class="hero-text">
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
      </div>

      <aside class="hero-showcase" aria-label="Premium Content Preview">
        <figure class="showcase-card">
          <div class="card-image">
            <img src="../assets/mountain.jpg" alt="Premium Image Preview" />
            <div class="premium-overlay">
              <Icon icon="material-symbols:lock" class="lock-icon" />
              <span>Premium Collection</span>
            </div>
          </div>
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
    </div>
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
    background: rgba(0, 0, 0, 0.5);
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
        border: none;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 0.9rem;
          color: #7f8c8d;
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
