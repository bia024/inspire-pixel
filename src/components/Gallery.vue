<script setup>
// defineProps({
//   searchQuery: String,
// })
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
// import ImgRocky from '../assets/rocky-ocean.jpg'
// import ImgKayak from '../assets/kayak-lagoon.jpg'

import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { useRouter } from 'vue-router'
import AuthModal from './AuthModal.vue'

const props = defineProps({ searchQuery: String })
const { isPro, isAuthenticated } = useAuth()
const { addToast } = useToast()
const router = useRouter()

const isAuthModalOpen = ref(false)

const activeTab = ref('all')
const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

const loadFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem('favorites')
    if (!stored) return []

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      console.warn('Invalid favorites data format, resetting to empty array')
      return []
    }

    const validIds = parsed.filter(
      (id) => typeof id === 'number' && id > 0 && id <= 12 && Number.isInteger(id)
    )

    if (validIds.length !== parsed.length) {
      console.warn('Some invalid favorite IDs were filtered out')
    }

    return validIds
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error)
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
  { id: 11, src: ImgWaterfall, title: 'Powerful Waterfall', category: 'nature', premium: false },
  { id: 12, src: ImgNight, title: 'Starry Night', category: 'nature', premium: true },
  // { id: 13, src: ImgKayak, title: 'Kayaking in River', category: 'nature', premium: false },
  // { id: 14, src: ImgRocky, title: 'Rocky Ocean', category: 'nature', premium: true },
])

const filteredImages = computed(() => {
  let result = images.value

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
    if (!isAuthenticated.value) {
      isAuthModalOpen.value = true
      return
    }
    addToast('This is a Premium image. Upgrade to Pro to access!', 'warning')
    router.push({ name: 'mode-selection' })
    return
  }
}

const toggleFavorite = (imageId) => {
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

  if (!isAuthenticated.value) {
    isAuthModalOpen.value = true
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

const handleRegisterSuccess = () => {
  isAuthModalOpen.value = false
  setTimeout(() => {
    router.push({ name: 'mode-selection' })
  }, 300)
}

const handleDownload = (img) => {
  if (img.premium && !isPro.value) {
    addToast('This is a Premium image. Upgrade to Pro to download!', 'warning')
    router.push({ name: 'mode-selection' })
    return
  }

  const link = document.createElement('a')
  link.href = img.src
  link.download = `${img.title.toLowerCase().replace(/\s+/g, '-')}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  addToast(`Downloading "${img.title}"...`, 'success')
}

const isFavorite = (imageId) => {
  if (typeof imageId !== 'number' || !Number.isInteger(imageId)) {
    console.warn(`Invalid imageId for isFavorite check: ${imageId}`)
    return false
  }
  return favorites.value.includes(imageId)
}

const webpMedia = computed(() => {
  if (typeof window === 'undefined') return '(min-width: 769px)'
  return window.innerWidth > 768 ? '(min-width: 769px)' : '(max-width: 768px)'
})

const setActiveTab = (tab) => {
  const validTabs = ['all', 'favorites']
  if (!validTabs.includes(tab)) {
    console.error(`Invalid tab: ${tab}. Must be one of: ${validTabs.join(', ')}`)
    return
  }
  activeTab.value = tab
}

const handleTabKeydown = (event, tab) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    setActiveTab(tab)
  }
}

const handleFavoriteKeydown = (event, imageId) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleFavorite(imageId)
  }
}

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
      rootMargin: '50px 0px',
      threshold: 0.1,
    }
  )
}

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

const imageLoadStates = ref(new Map())

const handleImageLoad = (imageId) => {
  imageLoadStates.value.set(imageId, 'loaded')
}

const handleImageError = (imageId) => {
  imageLoadStates.value.set(imageId, 'error')
  console.warn(`Failed to load image with ID: ${imageId}`)
}

const getWebpSrc = (src) => {
  return src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
}

const getResponsiveSrcset = (src) => {
  const baseSrc = src.replace(/\.(jpg|jpeg|png)$/i, '')
  const extension = src.split('.').pop().toLowerCase()

  const sizes = [
    { width: 400, descriptor: '400w' },
    { width: 800, descriptor: '800w' },
    { width: 1200, descriptor: '1200w' },
  ]

  return sizes.map((size) => `${baseSrc}-${size.width}.${extension} ${size.descriptor}`).join(', ')
}

onMounted(() => {
  setupIntersectionObserver()

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
        <button :class="{ active: activeTab === 'all' }" @click="setActiveTab('all')"
          @keydown="handleTabKeydown($event, 'all')" role="tab" :aria-selected="activeTab === 'all'"
          :aria-controls="'tabpanel-all'" :tabindex="activeTab === 'all' ? 0 : -1" aria-label="View all images">
          All Images
        </button>
        <button :class="{ active: activeTab === 'favorites' }" @click="setActiveTab('favorites')"
          @keydown="handleTabKeydown($event, 'favorites')" role="tab" :aria-selected="activeTab === 'favorites'"
          :aria-controls="'tabpanel-favorites'" :tabindex="activeTab === 'favorites' ? 0 : -1"
          :aria-label="'View favorite images (' + favorites.length + ' items)'">
          <Icon icon="material-symbols:favorite" aria-hidden="true" />
          Favorites ({{ favorites.length }})
        </button>
      </nav>
      <section class="gallery" :id="'tabpanel-' + activeTab" role="tabpanel" :aria-labelledby="'tab-' + activeTab"
        aria-live="polite">
        <article v-for="img in filteredImages" :key="img.id" class="image-card" role="article"
          :aria-label="'Image: ' + img.title + ', Category: ' + img.category">
          <figure class="image-container" :class="{ 'is-locked': img.premium && !isPro }"
            @click="handlePremiumClick(img)">
            <picture>
              <source :data-srcset="getWebpSrc(img.src)" type="image/webp" :media="webpMedia" />
              <img :data-src="img.src" :data-srcset="getResponsiveSrcset(img.src)"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                :alt="img.title + ' - ' + img.category + ' image'" @load="handleImageLoad(img.id)"
                @error="handleImageError(img.id)" :class="{ loaded: imageLoadStates.get(img.id) === 'loaded' }"
                loading="lazy" />
            </picture>
            <figcaption v-if="img.premium && !isPro" class="lock-overlay">
              <Icon icon="material-symbols:lock" class="lock-icon" />
              <span>Premium</span>
            </figcaption>
            <aside class="overlay" v-else>
              <button class="favorite-btn" :class="{ favorited: isFavorite(img.id) }"
                @click.stop="toggleFavorite(img.id)" @keydown.stop="handleFavoriteKeydown($event, img.id)" :aria-label="isFavorite(img.id)
                  ? 'Remove ' + img.title + ' from favorites'
                  : 'Add ' + img.title + ' to favorites'
                  " :aria-pressed="isFavorite(img.id)" role="button" tabindex="0">
                <Icon :icon="isFavorite(img.id)
                  ? 'material-symbols:favorite'
                  : 'material-symbols:favorite-outline'
                  " aria-hidden="true" />
              </button>
              <button class="download-btn" @click.stop="handleDownload(img)" :aria-label="'Download ' + img.title"
                role="button" tabindex="0">
                <Icon icon="material-symbols:download" aria-hidden="true" />
              </button>
            </aside>
          </figure>
          <figcaption class="image-info">
            <h3>{{ img.title }}</h3>
            <span class="category" role="text" :aria-label="'Category: ' + img.category">{{
              img.category
              }}</span>
          </figcaption>
        </article>
      </section>
      <aside v-if="activeTab === 'favorites' && favorites.length === 0" class="empty-state" role="status"
        aria-live="polite" aria-label="No favorite images">
        <Icon icon="material-symbols:favorite-outline" aria-hidden="true" />
        <p>No favorite images yet.</p>
        <p>Explore the gallery and click the heart to add to favorites!</p>
      </aside>
    </div>
    <AuthModal :is-open="isAuthModalOpen" @close="isAuthModalOpen = false" @register-success="handleRegisterSuccess" />
  </section>
</template>

<style scoped lang="scss">
.gallery-section {
  padding: 4rem 2rem;
  background: var(--gradient-hero);
  min-height: 100vh;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
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
    background: var(--card-bg);
    color: var(--text-secondary);
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
    background: var(--card-bg);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px var(--card-shadow);
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
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    }

    span {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
  }

  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    gap: 0.5rem;
  }

  .image-card:hover .overlay {
    opacity: 1;
  }

  .favorite-btn,
  .download-btn {
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
    font-size: 1.5rem;
  }

  .favorite-btn.favorited {
    background: #e74c3c;
    color: #fff;
  }

  .download-btn {
    background: rgba(255, 255, 255, 0.9);
    color: #2c3e50;

    &:hover {
      background: #3498db;
      color: #fff;
      transform: scale(1.1);
    }
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
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .image-info .category {
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-transform: capitalize;
    background: var(--bg-tertiary);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    display: inline-block;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);

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
