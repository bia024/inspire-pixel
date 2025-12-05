<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'

// Importações de Imagens
import ImgSwans from '../assets/swans.jpg'
import ImgSunset from '../assets/sunset.jpg'
import ImgBeach from '../assets/beach.png'
import ImgSunflowers from '../assets/sunflowers.jpg'
import ImgNight from '../assets/night.jpg'
import ImgMountain from '../assets/mountain.jpg' // Importa a imagem de preview para o modo não-pro

const route = useRoute()
const { isPro } = useFirebaseAuth() // Estado reativo se o usuário é Pro
const searchTerm = ref('')
const emit = defineEmits(['search'])

// Imagens Exclusivas para Usuários Pro
const premiumImages = [
  { src: ImgSwans, title: 'Graceful Swans' },
  { src: ImgSunset, title: 'Golden Sunset' },
  { src: ImgBeach, title: 'Paradise Beach' },
  { src: ImgSunflowers, title: 'Sunflower Field' },
  { src: ImgNight, title: 'Starry Night' }
]

// Estado do Carrossel
const currentSlide = ref(0)
let slideInterval = null

// --- Lógica do Carrossel ---
const startSlideShow = () => {
  stopSlideShow()
  // Avança a cada 3 segundos (3000ms)
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
  // Garante que o índice não seja negativo
  currentSlide.value = (currentSlide.value - 1 + premiumImages.length) % premiumImages.length
}

const pauseSlideShow = () => {
  stopSlideShow()
}

const resumeSlideShow = () => {
  // Retorna o carrossel automático apenas se o usuário for Pro
  if (isPro.value) {
    startSlideShow()
  }
}

// --- Hooks de Ciclo de Vida ---
onMounted(() => {
  // Inicia o carrossel se o usuário for Pro ao montar o componente
  if (isPro.value) {
    startSlideShow()
  }
})

onUnmounted(() => {
  // Limpa o intervalo ao desmontar o componente
  stopSlideShow()
})

// --- Watchers ---
// Reage à mudança de status Pro (e.g., após um login)
watch(isPro, (newValue) => {
  if (newValue) {
    startSlideShow()
  } else {
    stopSlideShow()
  }
})

// Observa a query string 'q' da rota e atualiza o estado local e dispara a pesquisa
watch(() => route.query.q, (newQuery) => {
  if (newQuery !== undefined && newQuery !== searchTerm.value) {
    searchTerm.value = newQuery
    emit('search', newQuery)
  }
}, { immediate: true }) // Roda imediatamente para pegar o valor inicial da URL

// --- Lógica de Pesquisa ---
const handleSearch = () => {
  const term = searchTerm.value?.trim()
  
  // Limitação de comprimento (máximo 100 caracteres)
  if (term && term.length > 100) {
    searchTerm.value = term.substring(0, 100)
  }
  
  // Emite o evento de pesquisa para o componente pai
  emit('search', searchTerm.value)
}

const executeSearch = () => {
  handleSearch()
  
  // Role para a seção de galeria após a pesquisa
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
// Função de debounce para evitar múltiplas pesquisas enquanto o usuário digita
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
      
      <!-- Carrossel para Usuários PRO -->
      <aside v-if="isPro" class="hero-showcase pro-carousel" aria-label="Premium Collection Carousel">
        <article class="carousel-container" @mouseenter="pauseSlideShow" @mouseleave="resumeSlideShow">
          <transition-group name="slide" tag="section" class="carousel-slides">
            <figure v-for="(image, index) in premiumImages" :key="index" v-show="index === currentSlide"
              class="carousel-slide" role="img" :aria-label="image.title">
              <img :src="image.src" :alt="image.title" loading="lazy" />
              <figcaption class="slide-caption">
                <Icon icon="material-symbols:workspace-premium" class="premium-badge" />
                <h3>{{ image.title }}</h3>
              </figcaption>
            </figure>
          </transition-group>
          
          <!-- Botões de Navegação -->
          <button class="carousel-nav prev" @click="prevSlide" aria-label="Previous slide">
            <Icon icon="material-symbols:chevron-left" />
          </button>
          <button class="carousel-nav next" @click="nextSlide" aria-label="Next slide">
            <Icon icon="material-symbols:chevron-right" />
          </button>
          
          <!-- Indicadores de Slide -->
          <nav class="carousel-indicators" aria-label="Carousel navigation">
            <button v-for="(image, index) in premiumImages" :key="index" :class="{ active: index === currentSlide }"
              @click="currentSlide = index" :aria-label="'Go to slide ' + (index + 1)"></button>
          </nav>
        </article>
      </aside>
      
      <!-- Preview para Não-Usuários PRO -->
      <aside v-else class="hero-showcase" aria-label="Premium Content Preview">
        <figure class="showcase-card">
          <picture class="card-image">
            <img :src="ImgMountain" alt="Premium Image Preview" loading="lazy" />
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

// Variáveis de Tema (Adaptadas para usar no SCSS)
// Note: Em um ambiente Vue real, é melhor definir estas em um arquivo global ou usar Tailwind.
// Para este exemplo, assumimos que :root (ou body) define:
// --overlay-bg: rgba(0, 0, 0, 0.5);
// --overlay-light: rgba(255, 255, 255, 0.15);
// --card-shadow: rgba(0, 0, 0, 0.5);
// --bg-primary: #fff;
// --text-primary: #333;
// --text-secondary: #666;

.hero {
  // Garante que a imagem de fundo seja carregada
  background-image: url('../assets/beach.png');
  background-size: cover;
  background-position: center;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 2rem;
  font-family: 'Inter', sans-serif;
  z-index: 1; // Garante que a seção hero esteja acima de qualquer elemento de fundo fora dela

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); // Usando um valor padrão para overlay
    z-index: 0; // O overlay está no fundo, mas acima da imagem de fundo
  }

  .hero-content {
    position: relative;
    z-index: 2; // Conteúdo acima do overlay
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
      font-size: clamp(2.5rem, 4vw, 3.5rem); // Font size responsivo
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
          font-size: 1.5rem;
        }
      }

      input {
        width: 100%;
        padding: 1rem 3rem;
        font-size: 1.1rem;
        border-radius: 50px;
        border: 2px solid #fff;
        background: rgba(255, 255, 255, 0.95);
        color: #333;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #e1306c;
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
        font-size: 1.4rem;
        color: #999;
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
    flex: 0 0 350px;
    display: none; /* Escondido por padrão em mobile */
    animation: float 6s ease-in-out infinite;

    .showcase-card {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
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
            filter: drop-shadow(0 0 5px rgba(241, 196, 15, 0.8));
          }

          span {
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-size: 0.9rem;
          }
        }
      }

      .card-content {
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
          background: linear-gradient(90deg, #e1306c, #f77737); // Cor mais Instagram/Vibrante
          color: #fff;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          transition: transform 0.3s, box-shadow 0.3s;

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(225, 48, 108, 0.4);
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

  // --- Estilos Específicos do Carrossel PRO ---
  .hero-showcase.pro-carousel {
    .carousel-container {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      position: relative;
      height: 350px;
      border: 1px solid rgba(255, 255, 255, 0.2);
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
          border-color: #e1306c;
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
      background: rgba(255, 255, 255, 0.7); // Levemente mais transparente
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
      color: #333;
      font-size: 1.5rem;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

      &:hover {
        background: #fff;
        transform: translateY(-50%) scale(1.1);
        opacity: 1;
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

  // --- Transições ---
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
    // O slide sai para a esquerda, mas mantém-se à frente do slide que entra
    transform: translateX(-100%); 
  }
  
  // Evita que o slide de saída e entrada colidam completamente
  .slide-enter-active {
    position: absolute;
    width: 100%;
  }

  // --- Responsividade ---
  @media (min-width: 992px) {
    .hero-showcase {
      display: block; // Mostra o carrossel/preview em desktop
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