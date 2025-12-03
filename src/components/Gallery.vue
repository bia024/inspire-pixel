<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'

import ImgSki from '../assets/ski.jpg'
import ImgSwans from '../assets/swans.jpg'
import ImgBridge from '../assets/bridge.jpg'
import ImgSunset from '../assets/sunset.jpg'
import ImgSeascape from '../assets/sunset-seascape.jpg'
import ImgBeach from '../assets/beach.png'
import ImgCanoe from '../assets/canoe.png'
import ImgSunflowers from '../assets/sunflowers.jpg'
import ImgMountain from '../assets/mountain.jpg'
import ImgRocks from '../assets/rocks.png'
import ImgWaterfall from '../assets/waterfall.png'
import ImgNight from '../assets/night.jpg'

import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { useRouter } from 'vue-router'

const props = defineProps({ searchQuery: String })
const { isPro } = useAuth()
const { addToast } = useToast()
const router = useRouter()

const activeTab = ref('all')
const isLoading = ref(true)

// Simulate initial loading for skeleton demo (optional, remove in production if not needed)
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

// Safe localStorage operations with comprehensive error handling
const loadFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem('favorites')
    if (!stored) return []

    const parsed = JSON.parse(stored)
    // Validate that parsed data is an array of numbers
    if (!Array.isArray(parsed)) {
      console.warn('Invalid favorites data format, resetting to empty array')
      return []
    }

    // Filter out invalid IDs (non-numbers or invalid ranges)
    const validIds = parsed.filter(
      (id) => typeof id === 'number' && id > 0 && id <= 12 && Number.isInteger(id)
    )

    if (validIds.length !== parsed.length) {
      console.warn('Some invalid favorite IDs were filtered out')
    }

    return validIds
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error)
    // Clear corrupted data
    try {
      localStorage.removeItem('favorites')
    } catch (clearError) {
      console.error('Error clearing corrupted favorites data:', clearError)
    }
    return []
  }
}

const saveFavoritesToStorage = (favoritesArray) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favoritesArray))
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error)
    // Could implement fallback storage here if needed
  }
}

const favorites = ref(loadFavoritesFromStorage())

const images = ref([
  { id: 1, src: ImgSki, title: 'Skiing in Mountains', category: 'nature', premium: false },
  { id: 2, src: ImgSwans, title: 'Swans', category: 'nature', premium: true },
  { id: 3, src: ImgBridge, title: 'Old Bridge', category: 'architecture', premium: false },
  { id: 4, src: ImgSunset, title: 'Sunset', category: 'nature', premium: true },
  { id: 5, src: ImgSeascape, title: 'Seascape Sunset', category: 'nature', premium: false },
  { id: 6, src: ImgBeach, title: 'Paradise Beach', category: 'nature', premium: true },
  { id: 7, src: ImgCanoe, title: 'Canoe on Lake', category: 'nature', premium: false },
  { id: 8, src: ImgSunflowers, title: 'Sunflower Field', category: 'nature', premium: true },
  { id: 9, src: ImgMountain, title: 'Majestic Mountain', category: 'nature', premium: false },
  { id: 10, src: ImgRocks, title: 'Sea Rocks', category: 'nature', premium: true },
  {
    id: 11,
    src: ImgWaterfall,
    title: 'Powerful Waterfall',
    category: 'nature',
    premium: false,
  },
  { id: 12, src: ImgNight, title: 'Starry Night', category: 'nature', premium: true },
])

const filteredImages = computed(() => {
  let result = images.value

  // No longer slicing for free users, instead we show them locked
  // if (props.userMode === 'free') {
  //   result = result.slice(0, 6)
  // }

  if (activeTab.value === 'favorites')
    result = images.value.filter((img) => favorites.value.includes(img.id))
  if (props.searchQuery)
    result = result.filter(
      (img) =>
        img.title.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(props.searchQuery.toLowerCase())
    )
  return result
})

const handlePremiumClick = (img) => {
  if (img.premium && !isPro.value) {
    addToast('This is a Premium image. Upgrade to Pro to access!', 'warning')
    router.push({ name: 'mode-selection' })
    return
  }
  // Logic for opening image (lightbox) would go here
}

const toggleFavorite = (imageId) => {
  // Validate imageId parameter
  if (
    typeof imageId !== 'number' ||
    !Number.isInteger(imageId) ||
    imageId < 1 ||
    imageId > images.value.length
  ) {
    console.error(
      `Invalid imageId: ${imageId}. Must be an integer between 1 and ${images.value.length}`
    )
    return
  }

  try {
    const index = favorites.value.indexOf(imageId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(imageId)
    }
    saveFavoritesToStorage(favorites.value)
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

const isFavorite = (imageId) => {
  // Validate imageId parameter
  if (typeof imageId !== 'number' || !Number.isInteger(imageId)) {
    console.warn(`Invalid imageId for isFavorite check: ${imageId}`)
    return false
  }
  return favorites.value.includes(imageId)
}

const webpMedia = computed(() => {
  if (typeof window === 'undefined') return '(min-width: 769px)' // SSR safe default
  return window.innerWidth > 768 ? '(min-width: 769px)' : '(max-width: 768px)'
})

const setActiveTab = (tab) => {
  // Validate tab parameter
  const validTabs = ['all', 'favorites']
  if (!validTabs.includes(tab)) {
    console.error(`Invalid tab: ${tab}. Must be one of: ${validTabs.join(', ')}`)
    return
  }
  activeTab.value = tab
}

// Keyboard navigation for tabs
const handleTabKeydown = (event, tab) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    setActiveTab(tab)
  }
}

// Keyboard navigation for favorite buttons
const handleFavoriteKeydown = (event, imageId) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleFavorite(imageId)
  }
}

// Performance optimizations: Intersection Observer for enhanced lazy loading
const imageObserver = ref(null)
const loadedImages = ref(new Set())

const setupIntersectionObserver = () => {
  if (!('IntersectionObserver' in window)) return

  imageObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.dataset.src
          if (src && !loadedImages.value.has(src)) {
            img.src = src
            img.classList.add('loaded')
            loadedImages.value.add(src)
            imageObserver.value.unobserve(img)
          }
        }
      })
    },
    {
      rootMargin: '50px 0px', // Start loading 50px before image enters viewport
      threshold: 0.1,
    }
  )
}

// Preload critical images (first 3 images)
const preloadCriticalImages = () => {
  const criticalImages = images.value.slice(0, 3)
  criticalImages.forEach((img) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = img.src
    document.head.appendChild(link)
  })
}

// Image loading state management
const imageLoadStates = ref(new Map())

const handleImageLoad = (imageId) => {
  imageLoadStates.value.set(imageId, 'loaded')
}

const handleImageError = (imageId) => {
  imageLoadStates.value.set(imageId, 'error')
  console.warn(`Failed to load image with ID: ${imageId}`)
}

// Helper functions for responsive images and WebP support
const getWebpSrc = (src) => {
  // Convert image path to WebP format (assuming images are processed by Vite)
  return src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
}

const getResponsiveSrcset = (src) => {
  // Generate responsive image srcset for different screen sizes
  const baseSrc = src.replace(/\.(jpg|jpeg|png)$/i, '')
  const extension = src.split('.').pop().toLowerCase()

  // Create srcset with different sizes
  const sizes = [
    { width: 400, descriptor: '400w' },
    { width: 800, descriptor: '800w' },
    { width: 1200, descriptor: '1200w' },
  ]

  return sizes.map((size) => `${baseSrc}-${size.width}.${extension} ${size.descriptor}`).join(', ')
}

// Lifecycle hooks for performance optimizations
onMounted(() => {
  setupIntersectionObserver()
  // preloadCriticalImages() // Commented out to avoid preload warning

  // Observe all images after component mount
  nextTick(() => {
    const imageElements = document.querySelectorAll('.gallery img[data-src]')
    imageElements.forEach((img) => {
      if (imageObserver.value) {
        imageObserver.value.observe(img)
      }
    })
  })
})

onUnmounted(() => {
  if (imageObserver.value) {
    imageObserver.value.disconnect()
  }
})
</script>

<template>
  <section class="gallery-section" id="gallery" aria-labelledby="gallery-title">
    <div class="container">
      <h2 id="gallery-title" class="section-title">Get Inspired</h2>

      <nav class="tabs" role="tablist" aria-label="Gallery navigation">
        <button
          :class="{ active: activeTab === 'all' }"
          @click="setActiveTab('all')"
          @keydown="handleTabKeydown($event, 'all')"
          role="tab"
          :aria-selected="activeTab === 'all'"
          :aria-controls="'tabpanel-all'"
          :tabindex="activeTab === 'all' ? 0 : -1"
          aria-label="View all images"
        >
          All Images
        </button>
        <button
          :class="{ active: activeTab === 'favorites' }"
          @click="setActiveTab('favorites')"
          @keydown="handleTabKeydown($event, 'favorites')"
          role="tab"
          :aria-selected="activeTab === 'favorites'"
          :aria-controls="'tabpanel-favorites'"
          :tabindex="activeTab === 'favorites' ? 0 : -1"
          :aria-label="'View favorite images (' + favorites.length + ' items)'"
        >
          <Icon icon="material-symbols:favorite" aria-hidden="true" />
          Favorites ({{ favorites.length }})
        </button>
      </nav>

      <section
        class="gallery"
        :id="'tabpanel-' + activeTab"
        role="tabpanel"
        :aria-labelledby="'tab-' + activeTab"
        aria-live="polite"
      >
        <article
          v-for="img in filteredImages"
          :key="img.id"
          class="image-card"
          role="article"
          :aria-label="'Image: ' + img.title + ', Category: ' + img.category"
        >
          <div 
            class="image-container" 
            :class="{ 'is-locked': img.premium && !isPro }"
            @click="handlePremiumClick(img)"
          >
            <picture>
              <!-- WebP format for modern browsers -->
              <source
                :data-srcset="getWebpSrc(img.src)"
                type="image/webp"
                :media="webpMedia"
              />
              <!-- Fallback to original format -->
              <img
                :data-src="img.src"
                :data-srcset="getResponsiveSrcset(img.src)"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                :alt="img.title + ' - ' + img.category + ' image'"
                @load="handleImageLoad(img.id)"
                @error="handleImageError(img.id)"
                :class="{ loaded: imageLoadStates.get(img.id) === 'loaded' }"
                loading="lazy"
              />
            </picture>
            
            <!-- Premium Lock Overlay -->
            <div v-if="img.premium && !isPro" class="lock-overlay">
              <Icon icon="material-symbols:lock" class="lock-icon" />
              <span>Premium</span>
            </div>

            <div class="overlay" v-else>
              <button
                class="favorite-btn"
                :class="{ favorited: isFavorite(img.id) }"
                @click.stop="toggleFavorite(img.id)"
                @keydown.stop="handleFavoriteKeydown($event, img.id)"
                :aria-label="
                  isFavorite(img.id)
                    ? 'Remove ' + img.title + ' from favorites'
                    : 'Add ' + img.title + ' to favorites'
                "
                :aria-pressed="isFavorite(img.id)"
                role="button"
                tabindex="0"
              >
                <Icon
                  :icon="
                    isFavorite(img.id)
                      ? 'material-symbols:favorite'
                      : 'material-symbols:favorite-outline'
                  "
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
          <div class="image-info">
            <h3>{{ img.title }}</h3>
            <span class="category" role="text" :aria-label="'Category: ' + img.category">{{
              img.category
            }}</span>
          </div>
        </article>
      </section>

      <aside
        v-if="activeTab === 'favorites' && favorites.length === 0"
        class="empty-state"
        role="status"
        aria-live="polite"
        aria-label="No favorite images"
      >
        <Icon icon="material-symbols:favorite-outline" aria-hidden="true" />
        <p>No favorite images yet.</p>
        <p>Explore the gallery and click the heart to add to favorites!</p>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.gallery-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 3rem;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #e74c3c, #f39c12);
      border-radius: 2px;
    }
  }

  .tabs {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }
  .tabs button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    background: #fff;
    color: #7f8c8d;
    font-weight: 600;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.active {
      background: linear-gradient(135deg, #e74c3c, #f39c12);
      color: #fff;
    }
    &:hover {
      transform: translateY(-2px);
    }
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .image-card {
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  .image-container {
    position: relative;
    overflow: hidden;
    height: 250px;
    cursor: pointer;

    &.is-locked img {
      filter: blur(4px) grayscale(50%);
    }
  }
  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s, filter 0.3s;
  }
  .image-container:hover img {
    transform: scale(1.1);
  }

  .lock-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    z-index: 2;
    
    .lock-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      color: #f1c40f;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }

    span {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
  }

  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .image-card:hover .overlay {
    opacity: 1;
  }

  .favorite-btn {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
  }
  .favorite-btn.favorited {
    background: #e74c3c;
    color: #fff;
  }
  .favorite-btn:hover {
    transform: scale(1.1);
  }

  .image-info {
    padding: 1.5rem;
  }
  .image-info h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  .image-info .category {
    font-size: 0.9rem;
    color: #7f8c8d;
    text-transform: capitalize;
    background: #ecf0f1;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    display: inline-block;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #7f8c8d;
    p {
      font-size: 1.2rem;
      margin: 1rem 0;
    }
  }
}

@media (max-width: 768px) {
  .gallery-section {
    padding: 2rem 1rem;
  }
  .section-title {
    font-size: 2rem;
  }
  .gallery {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  .tabs {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .gallery {
    grid-template-columns: 1fr;
  }
  .image-container {
    height: 200px;
  }
}

/* Skeleton Loading Styles */
.skeleton-card {
  pointer-events: none;
}

.skeleton-image {
  width: 100%;
  height: 100%;
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: 1.5s shine linear infinite;
}

.absolute-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.skeleton-text {
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: 1.5s shine linear infinite;
  border-radius: 4px;
}

.skeleton-text.title {
  height: 24px;
  width: 70%;
  margin-bottom: 0.5rem;
}

.skeleton-text.category {
  height: 20px;
  width: 40%;
  border-radius: 20px;
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>

<!-- <script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import ImgEsqui from '../assets/esqui.jpg';
import ImgCisneys from '../assets/cisneys.jpg';
import ImgPoint from '../assets/point.jpg';
import ImgPordoSol from '../assets/por-do-sol.jpg';
import ImgSunset from '../assets/sunset-seascape.jpg';
import ImgPraia from '../assets/beach.png';
import ImgCanoa from '../assets/canoa.png';
import ImgGirassois from '../assets/girassois.jpg';
import ImgMountain from '../assets/mountain.jpg';
import ImgRocks from '../assets/rocks.png';
import ImgWaterfall from '../assets/waterfall.png';
import ImgNight from '../assets/night.jpg';

const activeTab = ref('all');
let favoritesData = [];
try {
  const storedFavorites = localStorage.getItem('favorites');
  favoritesData = storedFavorites ? JSON.parse(storedFavorites) : [];
} catch (error) {
  console.error('Error loading favorites from localStorage:', error);
  favoritesData = [];
}
const favorites = ref(favoritesData);

const images = ref([
  { id: 1, src: ImgEsqui, title: 'Esqui nas Montanhas', category: 'nature' },
  { id: 2, src: ImgCisneys, title: 'Cisneys Castle', category: 'architecture' },
  { id: 3, src: ImgPoint, title: 'Ponte Antiga', category: 'architecture' },
  { id: 4, src: ImgPordoSol, title: 'Pôr do Sol', category: 'nature' },
  { id: 5, src: ImgSunset, title: 'Sunset Seascape', category: 'nature' },
  { id: 6, src: ImgPraia, title: 'Praia Paradisíaca', category: 'nature' },
  { id: 7, src: ImgCanoa, title: 'Canoa no Lago', category: 'nature' },
  { id: 8, src: ImgGirassois, title: 'Campo de Girassóis', category: 'nature' },
  { id: 9, src: ImgMountain, title: 'Montanha Majestosa', category: 'nature' },
  { id: 10, src: ImgRocks, title: 'Rochas Marinhas', category: 'nature' },
  { id: 11, src: ImgWaterfall, title: 'Cachoeira Poderosa', category: 'nature' },
  { id: 12, src: ImgNight, title: 'Noite Estrelada', category: 'nature' }
]);

const filteredImages = computed(() => {
  if (activeTab.value === 'favorites') {
    return images.value.filter(img => favorites.value.includes(img.id));
  }
  return images.value;
});

const toggleFavorite = (imageId) => {
  const index = favorites.value.indexOf(imageId);
  if (index > -1) {
    favorites.value.splice(index, 1);
  } else {
    favorites.value.push(imageId);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites.value));
};

const isFavorite = (imageId) => {
  return favorites.value.includes(imageId);
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};
</script>

<template>
  <main class="main-section">
    <div class="container">
      <h2 class="section-title">Get Inspired</h2>

      <nav class="tabs">
        <button
          :class="['tab-button', { active: activeTab === 'all' }]"
          @click="setActiveTab('all')"
        >
          Todas as Imagens
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'favorites' }]"
          @click="setActiveTab('favorites')"
        >
          <Icon icon="material-symbols:favorite" />
          Favoritas ({{ favorites.length }})
        </button>
      </nav>

      <section class="gallery">
        <article
          v-for="image in filteredImages"
          :key="image.id"
          class="image-card"
        >
          <div class="image-container">
            <img
              :src="image.src"
              :alt="image.title"
              class="gallery-image"
              loading="lazy"
            />
            <div class="image-overlay">
              <button
                class="favorite-btn"
                @click="toggleFavorite(image.id)"
                :class="{ favorited: isFavorite(image.id) }"
              >
                <Icon
                  :icon="isFavorite(image.id) ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'"
                />
              </button>
            </div>
          </div>
          <div class="image-info">
            <h3 class="image-title">{{ image.title }}</h3>
            <span class="image-category">{{ image.category }}</span>
          </div>
        </article>
      </section>

      <aside v-if="activeTab === 'favorites' && favorites.length === 0" class="empty-state">
        <Icon icon="material-symbols:favorite-outline" />
        <p>Nenhuma imagem favorita ainda.</p>
        <p>Explore as imagens e clique no coração para adicionar aos favoritos!</p>
      </aside>
    </div>
  </main>
</template>

<style scoped lang="scss">
.main-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 3rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #e74c3c, #f39c12);
    border-radius: 2px;
  }
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  background: white;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  &.active {
    background: linear-gradient(135deg, #e74c3c, #f39c12);
    color: white;
  }
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.image-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
}

.image-container {
  position: relative;
  overflow: hidden;
  height: 250px;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-card:hover .gallery-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.favorite-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
    background: white;
  }

  &.favorited {
    background: #e74c3c;
    color: white;
  }
}

.image-info {
  padding: 1.5rem;
}

.image-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.image-category {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-transform: capitalize;
  background: #ecf0f1;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;

  p {
    font-size: 1.2rem;
    margin: 1rem 0;
  }
}

// Responsividade
@media (max-width: 768px) {
  .main-section {
    padding: 2rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .gallery {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .tabs {
    flex-direction: column;
    align-items: center;
  }

  .tab-button {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .gallery {
    grid-template-columns: 1fr;
  }

  .image-container {
    height: 200px;
  }
}
</style> -->
