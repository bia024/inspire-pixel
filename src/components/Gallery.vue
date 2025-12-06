<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'
import { usePexels } from '../composables/usePexels'
import { useToast } from '../composables/useToast'
import { useRouter } from 'vue-router'
import AuthModal from './AuthModal.vue'
import SkeletonCard from './SkeletonCard.vue'
import { addWatermark } from '../utils/watermark'

const props = defineProps({ searchQuery: String })
const { isPro, isAuthenticated, favorites, toggleFavorite: authToggleFavorite } = useFirebaseAuth()
const { images, loading, error, hasMore, fetchCuratedImages, searchImages, loadMore } = usePexels()
const { addToast } = useToast()
const router = useRouter()

const isAuthModalOpen = ref(false)
const activeTab = ref('all')
const selectedCategory = ref('all')

const autoLoadCount = ref(0)
const AUTO_LOAD_LIMIT = 3

const observerEl = ref(null)
let observer = null

onMounted(async () => {
  await fetchCuratedImages(1)
  autoLoadCount.value = 0

  observer = new IntersectionObserver(
    (entries) => {
      const firstEntry = entries[0]
      if (
        firstEntry.isIntersecting &&
        hasMore.value &&
        !loading.value &&
        autoLoadCount.value < AUTO_LOAD_LIMIT
      ) {
        loadMore()
      }
    },
    { threshold: 0.8 }
  )
  if (observerEl.value) observer.observe(observerEl.value)
})

onUnmounted(() => {
  if (observer && observerEl.value) observer.unobserve(observerEl.value)
})

watch(selectedCategory, async (newCategory) => {
  autoLoadCount.value = 0
  if (newCategory === 'all') {
    await fetchCuratedImages(1)
  } else {
    await searchImages(newCategory, 1)
  }
  observer.observe(observerEl.value)
})

watch(
  () => props.searchQuery,
  async (newQuery) => {
    autoLoadCount.value = 0
    if (newQuery && newQuery.trim() !== '') {
      await searchImages(newQuery, 1)
    } else if (selectedCategory.value === 'all') {
      await fetchCuratedImages(1)
    } else {
      await searchImages(selectedCategory.value, 1)
    }
    observer.observe(observerEl.value)
  }
)

watch(loading, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    autoLoadCount.value++
  }
})

const filteredImages = computed(() => {
  let result = images.value

  if (activeTab.value === 'favorites') {
    result = images.value.filter((img) => favorites.value.includes(img.id))
  }

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

const toggleFavorite = async (imageId) => {
  if (!isAuthenticated.value) {
    isAuthModalOpen.value = true
    return
  }

  const result = await authToggleFavorite(imageId)
  if (!result.success) addToast(result.message, 'error')
}

const handleRegisterSuccess = () => {
  isAuthModalOpen.value = false
  setTimeout(() => {
    router.push({ name: 'mode-selection' })
  }, 300)
}

const handleDownload = async (img) => {
  if (!isAuthenticated.value) {
    isAuthModalOpen.value = true
    addToast('Please login to download images.', 'warning')
    return
  }

  if (img.premium && !isPro.value) {
    addToast('This is a Premium image. Upgrade to Pro to download!', 'warning')
    router.push({ name: 'mode-selection' })
    return
  }

  try {
    let downloadUrl = img.src
    let fileName = `${img.title.toLowerCase().replace(/\s+/g, '-')}`

    if (isPro.value) {
      const response = await fetch(img.srcOriginal)
      if (!response.ok) throw new Error('Failed to fetch image')
      const blob = await response.blob()
      downloadUrl = URL.createObjectURL(blob)
    } else {
      addToast('Adding watermark (Free Plan)...', 'info')
      downloadUrl = await addWatermark(img.src)
      fileName += '-watermarked'
    }

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${fileName}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (isPro.value) URL.revokeObjectURL(downloadUrl)

    addToast(
      isPro.value
        ? `Downloading "${img.title}"...`
        : 'Download started! Upgrade to Pro to remove watermark.',
      'success'
    )
  } catch (error) {
    console.error('Download error:', error)
    addToast('Error preparing download.', 'error')
  }
}

const handleManualLoadMore = () => {
  autoLoadCount.value = 0
  loadMore()
}

const isFavorite = (imageId) => {
  if (typeof imageId !== 'number' || !Number.isInteger(imageId)) return false
  return favorites.value.includes(imageId)
}

const setActiveTab = async (tab) => {
  const validTabs = ['all', 'favorites']
  if (!validTabs.includes(tab)) return
  activeTab.value = tab
  if (tab === 'all') {
    selectedCategory.value = 'all'
    autoLoadCount.value = 0
    await fetchCuratedImages(1)
    if (observer && observerEl.value) observer.observe(observerEl.value)
  }
}

const handleTabKeydown = (event, tab) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    setActiveTab(tab)
  }
}

const categoryFilters = ref(null)

const scrollPosition = ref({ left: 0, width: 0, scrollWidth: 0 })

onMounted(() => {
  const el = categoryFilters.value
  if (el) {
    const update = () => {
      scrollPosition.value.left = el.scrollLeft
      scrollPosition.value.width = el.clientWidth
      scrollPosition.value.scrollWidth = el.scrollWidth
    }
    el.addEventListener('scroll', update)
    update()
    onUnmounted(() => el.removeEventListener('scroll', update))
  }
})

const smoothScrollLeft = () => {
  if (categoryFilters.value) {
    categoryFilters.value.scrollBy({ left: -200, behavior: 'smooth' })
  }
}

const smoothScrollRight = () => {
  if (categoryFilters.value) {
    categoryFilters.value.scrollBy({ left: 200, behavior: 'smooth' })
  }
}

const isLeftDisabled = computed(() => scrollPosition.value.left <= 0)

const isRightDisabled = computed(() => scrollPosition.value.left + scrollPosition.value.width >= scrollPosition.value.scrollWidth - 1)

const handleFavoriteKeydown = (event, imageId) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleFavorite(imageId)
  }
}
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
      <nav class="category-filters-container" aria-label="Category filters">
        <button
          class="scroll-btn scroll-left"
          @click="smoothScrollLeft"
          aria-label="Scroll categories left"
          :disabled="isLeftDisabled"
        >
          <Icon icon="material-symbols:chevron-left" aria-hidden="true" />
        </button>
        <div ref="categoryFilters" class="category-filters">
          <button
            :class="{ active: selectedCategory === 'all' }"
            @click="selectedCategory = 'all'"
            class="category-btn all-btn"
            aria-label="All categories"
          >
            <span>All</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'nature' }"
            @click="selectedCategory = 'nature'"
            class="category-btn"
            aria-label="Nature category"
          >
            <span>🌿</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'architecture' }"
            @click="selectedCategory = 'architecture'"
            class="category-btn"
            aria-label="Architecture category"
          >
            <span>🏛️</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'people' }"
            @click="selectedCategory = 'people'"
            class="category-btn"
            aria-label="People category"
          >
            <span>👥</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'abstract' }"
            @click="selectedCategory = 'abstract'"
            class="category-btn"
            aria-label="Abstract category"
          >
            <span>🎨</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'city' }"
            @click="selectedCategory = 'city'"
            class="category-btn"
            aria-label="City category"
          >
            <span>🌆</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'animals' }"
            @click="selectedCategory = 'animals'"
            class="category-btn"
            aria-label="Animals category"
          >
            <span>🐾</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'food' }"
            @click="selectedCategory = 'food'"
            class="category-btn"
            aria-label="Food category"
          >
            <span>🍕</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'technology' }"
            @click="selectedCategory = 'technology'"
            class="category-btn"
            aria-label="Technology category"
          >
            <span>💻</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'travel' }"
            @click="selectedCategory = 'travel'"
            class="category-btn"
            aria-label="Travel category"
          >
            <span>✈️</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'sports' }"
            @click="selectedCategory = 'sports'"
            class="category-btn"
            aria-label="Sports category"
          >
            <span>⚽</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'fashion' }"
            @click="selectedCategory = 'fashion'"
            class="category-btn"
            aria-label="Fashion category"
          >
            <span>👗</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'landscape' }"
            @click="selectedCategory = 'landscape'"
            class="category-btn"
            aria-label="Landscape category"
          >
            <span>🏞️</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'portrait' }"
            @click="selectedCategory = 'portrait'"
            class="category-btn"
            aria-label="Portrait category"
          >
            <span>📸</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'black-and-white' }"
            @click="selectedCategory = 'black-and-white'"
            class="category-btn"
            aria-label="Black and White category"
          >
            <span>⚫</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'wallpaper' }"
            @click="selectedCategory = 'wallpaper'"
            class="category-btn"
            aria-label="Wallpaper category"
          >
            <span>🖼️</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'background' }"
            @click="selectedCategory = 'background'"
            class="category-btn"
            aria-label="Background category"
          >
            <span>🎭</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'macro' }"
            @click="selectedCategory = 'macro'"
            class="category-btn"
            aria-label="Macro category"
          >
            <span>🔍</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'aerial' }"
            @click="selectedCategory = 'aerial'"
            class="category-btn"
            aria-label="Aerial category"
          >
            <span>✈️</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'vintage' }"
            @click="selectedCategory = 'vintage'"
            class="category-btn"
            aria-label="Vintage category"
          >
            <span>🕰️</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'minimalist' }"
            @click="selectedCategory = 'minimalist'"
            class="category-btn"
            aria-label="Minimalist category"
          >
            <span>🌀</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'ocean' }"
            @click="selectedCategory = 'ocean'"
            class="category-btn"
            aria-label="Ocean category"
          >
            <span>🌊</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'forest' }"
            @click="selectedCategory = 'forest'"
            class="category-btn"
            aria-label="Forest category"
          >
            <span>🌲</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'mountain' }"
            @click="selectedCategory = 'mountain'"
            class="category-btn"
            aria-label="Mountain category"
          >
            <span>🏔️</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'beach' }"
            @click="selectedCategory = 'beach'"
            class="category-btn"
            aria-label="Beach category"
          >
            <span>🏖️</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'flower' }"
            @click="selectedCategory = 'flower'"
            class="category-btn"
            aria-label="Flower category"
          >
            <span>🌸</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'car' }"
            @click="selectedCategory = 'car'"
            class="category-btn"
            aria-label="Car category"
          >
            <span>🚗</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'building' }"
            @click="selectedCategory = 'building'"
            class="category-btn"
            aria-label="Building category"
          >
            <span>🏢</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'art' }"
            @click="selectedCategory = 'art'"
            class="category-btn"
            aria-label="Art category"
          >
            <span>🎨</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'music' }"
            @click="selectedCategory = 'music'"
            class="category-btn"
            aria-label="Music category"
          >
            <span>🎵</span>
          </button>
          <button
            :class="{ active: selectedCategory === 'dance' }"
            @click="selectedCategory = 'dance'"
            class="category-btn"
            aria-label="Dance category"
          >
            <span>💃</span>
          </button>
        </div>
        <button
          class="scroll-btn scroll-right"
          @click="smoothScrollRight"
          aria-label="Scroll categories right"
          :disabled="isRightDisabled"
        >
          <Icon icon="material-symbols:chevron-right" aria-hidden="true" />
        </button>
      </nav>
      <section
        class="gallery"
        :id="'tabpanel-' + activeTab"
        role="tabpanel"
        :aria-labelledby="'tab-' + activeTab"
        aria-live="polite"
      >
        <template v-if="loading && images.length === 0">
          <SkeletonCard v-for="n in 6" :key="n" />
        </template>
        <template v-else>
          <article
            v-for="img in filteredImages"
            :key="img.id"
            class="image-card"
            role="article"
            :aria-label="'Image: ' + img.title + ', Category: ' + img.category"
          >
            <figure
              class="image-container"
              :class="{ 'is-locked': img.premium && !isPro }"
              @click="handlePremiumClick(img)"
            >
              <img
                :src="img.src"
                :alt="img.title + ' - ' + img.category + ' image'"
                loading="lazy"
              />
              <figcaption v-if="img.premium && !isPro" class="lock-overlay">
                <Icon icon="material-symbols:lock" class="lock-icon" />
                <span>Premium</span>
              </figcaption>
              <aside class="overlay" v-else>
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
                <button
                  class="download-btn"
                  @click.stop="handleDownload(img)"
                  :aria-label="'Download ' + img.title"
                  role="button"
                  tabindex="0"
                >
                  <Icon icon="material-symbols:download" aria-hidden="true" />
                </button>
              </aside>
              <figcaption class="image-info">
                <h3>{{ img.title }}</h3>
                <span class="category" role="text" :aria-label="'Category: ' + img.category">{{
                  img.category
                }}</span>
              </figcaption>
            </figure>
          </article>
        </template>
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
    <div ref="observerEl" class="scroll-observer"></div>
    <div
      v-if="loading && images.length > 0 && autoLoadCount < AUTO_LOAD_LIMIT"
      class="loading-more-state"
    >
      <Icon icon="svg-spinners:ring-resize" />
    </div>
    <div v-if="hasMore && autoLoadCount >= AUTO_LOAD_LIMIT" class="load-more-container">
      <button @click="handleManualLoadMore" :disabled="loading" class="load-more-btn">
        <span v-if="loading"> <Icon icon="svg-spinners:ring-resize" /> Loading...</span>
        <span v-else>View More</span>
      </button>
    </div>
    <AuthModal
      :is-open="isAuthModalOpen"
      @close="isAuthModalOpen = false"
      @register-success="handleRegisterSuccess"
    />
  </section>
</template>

<style scoped lang="scss">
.gallery-section {
  padding: 4rem 2rem;
  background: var(--gradient-hero);
  min-height: 100vh;

  .container {
    max-width: 75rem;
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
      bottom: -0.625rem;
      left: 50%;
      transform: translateX(-50%);
      width: 5rem;
      height: 0.25rem;
      background: linear-gradient(90deg, #e74c3c, #f39c12);
      border-radius: 0.125rem;
    }
  }

  .tabs {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;

    button {
      padding: 1rem 2rem;
      border: none;
      border-radius: 3.125rem;
      cursor: pointer;
      background: var(--card-bg);
      color: var(--text-secondary);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-0.125rem);
      }

      &.active {
        background: linear-gradient(135deg, #e74c3c, #f39c12);
        color: #fff;
      }
    }
  }

  .category-filters-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 2rem;
    padding: 0 2rem;

    .scroll-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 10;
      font-size: 1.5rem;
      color: var(--text-secondary);

      &:hover:not(:disabled) {
        background: var(--hover-bg);
        border-color: var(--primary-color);
        color: var(--primary-color);
        transform: translateY(-50%) scale(1.1);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.scroll-left {
        left: 1rem;
      }

      &.scroll-right {
        right: 1rem;
      }
    }

    .category-filters {
      display: flex;
      justify-content: flex-start;
      gap: 0.4rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      padding: 0 4rem;
      margin: 0 auto;
      max-width: calc(10 * 3.5rem + 9 * 0.4rem + 2rem);
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .category-btn {
        flex-shrink: 0;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 50%;
        cursor: pointer;
        background: var(--card-bg);
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 1.25rem;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 3rem;
        min-height: 3rem;
        aspect-ratio: 1;

        &:focus {
          outline: 0.125rem solid var(--primary-color);
          outline-offset: 0.125rem;
        }

        &.active {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: #fff;
          border-color: transparent;
          box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.15);
          font-weight: 600;
        }

        &:hover:not(.active) {
          background: var(--hover-bg);
          border-color: var(--primary-color);
          color: var(--primary-color);
          transform: translateY(-0.0625rem) scale(1.05);
          box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.1);
        }

        &:active {
          transform: translateY(0) scale(1);
          box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
        }

        span {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .category-btn.all-btn {
        border-radius: 1.5625rem;
        width: auto;
      }

      .category-btn:not(.all-btn) {
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
      }
    }
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(18.75rem, 1fr));
    gap: 2rem;

    .image-card {
      background: var(--card-bg);
      border-radius: 0.9375rem;
      overflow: hidden;
      box-shadow: 0 0.625rem 1.875rem var(--card-shadow);
      transition: all 0.3s ease;
      height: 15.625rem;
      cursor: pointer;

      &:hover {
        transform: translateY(-0.5rem);
        box-shadow: 0 1.25rem 3.75rem var(--card-shadow);
      }

      .image-container {
        position: relative;
        overflow: hidden;
        height: 100%;
        cursor: pointer;

        &.is-locked img {
          filter: blur(0.25rem) grayscale(50%);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition:
            transform 0.3s ease,
            filter 0.3s ease;
        }

        &:hover img {
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
            filter: drop-shadow(0 0.125rem 0.25rem rgba(0, 0, 0, 0.5));
          }

          span {
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.0625rem;
            text-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.5);
          }
        }

        .overlay {
          position: absolute;
          top: 0;
          right: 0;
          padding: 1rem;
          opacity: 0;
          display: flex;
          gap: 0.5rem;
          transition: opacity 0.3s ease;
          z-index: 4;

          .favorite-btn,
          .download-btn {
            width: 3.125rem;
            height: 3.125rem;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 1.5rem;
            border: none;
            transition: all 0.3s ease;
          }

          .favorite-btn:hover:not(.favorited) {
            background: #e74c3c;
            color: #fff;
            transform: scale(1.1);
          }

          .favorite-btn.favorited {
            background: #e74c3c;
            color: #fff;
          }

          .download-btn {
            color: #2c3e50;

            &:hover {
              background: #3498db;
              color: #fff;
              transform: scale(1.1);
            }
          }
        }

        &:hover .overlay {
          opacity: 1;
        }

        .image-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), transparent);
          transform: translateY(100%);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 3;

          h3 {
            font-size: 1.2rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 0.5rem;
          }

          .category {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.9);
            text-transform: capitalize;
            background: rgba(255, 255, 255, 0.2);
            padding: 0.1875rem 0.5rem;
            border-radius: 1.25rem;
            display: inline-block;
            backdrop-filter: blur(0.625rem);
          }
        }

        &:hover .image-info {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }

  .premium-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: linear-gradient(135deg, #e74c3c, #f39c12);
    color: #fff;
    padding: 0.25rem 0.75rem;
    border-radius: 1.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 5;
  }

  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);

    h3 {
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    p {
      margin-bottom: 2rem;
      font-size: 1rem;
    }
  }

  .loading {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18.75rem, 1fr));
    gap: 2rem;
    max-width: 75rem;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 48rem) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 0 1rem;
    }

    .skeleton-card {
      height: 18.75rem;
      background: var(--card-bg);
      border-radius: 1.25rem;
      overflow: hidden;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        animation: shimmer 1.5s infinite;
      }
    }
  }

  .search-info {
    text-align: center;
    margin: 2rem 0;
    color: var(--text-secondary);
    font-size: 1rem;

    strong {
      color: var(--text-primary);
    }
  }

  .pro-upgrade-prompt {
    background: linear-gradient(135deg, #e74c3c, #f39c12);
    color: #fff;
    padding: 2rem;
    border-radius: 1.25rem;
    text-align: center;
    margin: 2rem 0;
    box-shadow: 0 0.5rem 1.875rem rgba(231, 76, 60, 0.3);

    h3 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    p {
      margin: 0 0 1.5rem 0;
      font-size: 1rem;
    }

    button {
      background: #fff;
      color: #e74c3c;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 3.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .load-more-container {
    position: relative;
    text-align: center;
    margin-top: 2rem;
    padding-bottom: 2rem;

    .load-more-btn {
      padding: 1rem 3rem;
      background: linear-gradient(135deg, #e74c3c, #f39c12);
      color: #fff;
      border: none;
      border-radius: 3.125rem;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 0.3125rem 1.25rem rgba(225, 48, 108, 0.3);

      &:hover:not(:disabled) {
        transform: translateY(-0.1875rem);
        box-shadow: 0 0.5rem 1.5625rem rgba(225, 48, 108, 0.4);
      }

      &:disabled {
        opacity: 0.7;
        cursor: wait;
      }

      span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
  }

  .scroll-observer {
    height: 3.125rem;
  }

  .loading-more-state {
    display: flex;
    justify-content: center;
    padding: 2rem;
    font-size: 2rem;
    color: var(--text-secondary);
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

@media (max-width: 48rem) {
  .gallery-section {
    padding: 2rem 1rem;

    .section-title {
      font-size: 2rem;
    }

    .gallery {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 0 1rem;
    }

    .tabs {
      flex-direction: column;
    }
  }
}

@media (max-width: 30rem) {
  .gallery {
    grid-template-columns: 1fr;
  }

  .image-container {
    height: 12.5rem;
  }
}
</style>
