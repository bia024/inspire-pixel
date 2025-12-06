<script setup>
import { ref, computed, watch, onMounted } from 'vue'
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

onMounted(async () => {
  await fetchCuratedImages(1)
})

watch(selectedCategory, async (newCategory) => {
  if (newCategory === 'all') {
    await fetchCuratedImages(1)
  } else {
    await searchImages(newCategory, 1)
  }
})

watch(() => props.searchQuery, async (newQuery) => {
  if (newQuery && newQuery.trim() !== '') {
    await searchImages(newQuery, 1)
  } else if (selectedCategory.value === 'all') {
    await fetchCuratedImages(1)
  } else {
    await searchImages(selectedCategory.value, 1)
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

    addToast(isPro.value
      ? `Downloading "${img.title}"...`
      : 'Download started! Upgrade to Pro to remove watermark.', 'success'
    )
  } catch (error) {
    console.error('Download error:', error)
    addToast('Error preparing download.', 'error')
  }
}

const isFavorite = (imageId) => {
  if (typeof imageId !== 'number' || !Number.isInteger(imageId)) return false
  return favorites.value.includes(imageId)
}

const setActiveTab = (tab) => {
  const validTabs = ['all', 'favorites']
  if (!validTabs.includes(tab)) return
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
      <div class="category-filters" role="group" aria-label="Category filters">
        <button :class="{ active: selectedCategory === 'all' }" @click="selectedCategory = 'all'" class="category-btn">
          All
        </button>
        <button :class="{ active: selectedCategory === 'nature' }" @click="selectedCategory = 'nature'"
          class="category-btn">
          🌿 Nature
        </button>
        <button :class="{ active: selectedCategory === 'architecture' }" @click="selectedCategory = 'architecture'"
          class="category-btn">
          🏛️ Architecture
        </button>
        <button :class="{ active: selectedCategory === 'people' }" @click="selectedCategory = 'people'"
          class="category-btn">
          👥 People
        </button>
        <button :class="{ active: selectedCategory === 'abstract' }" @click="selectedCategory = 'abstract'"
          class="category-btn">
          🎨 Abstract
        </button>
        <button :class="{ active: selectedCategory === 'city' }" @click="selectedCategory = 'city'"
          class="category-btn">
          🌆 City
        </button>
      </div>
      <section class="gallery" :id="'tabpanel-' + activeTab" role="tabpanel" :aria-labelledby="'tab-' + activeTab"
        aria-live="polite">
        <template v-if="loading && images.length === 0">
          <SkeletonCard v-for="n in 6" :key="n" />
        </template>
        <template v-else>
          <article v-for="img in filteredImages" :key="img.id" class="image-card" role="article"
            :aria-label="'Image: ' + img.title + ', Category: ' + img.category">
            <figure class="image-container" :class="{ 'is-locked': img.premium && !isPro }"
              @click="handlePremiumClick(img)">
              <img :src="img.src" :alt="img.title + ' - ' + img.category + ' image'" loading="lazy" />
              <figcaption v-if="img.premium && !isPro" class="lock-overlay">
                <Icon icon="material-symbols:lock" class="lock-icon" />
                <span>Premium</span>
              </figcaption>
              <aside class="overlay" v-else>
                <button class="favorite-btn" :class="{ favorited: isFavorite(img.id) }"
                  @click.stop="toggleFavorite(img.id)" @keydown.stop="handleFavoriteKeydown($event, img.id)"
                  :aria-label="isFavorite(img.id)
                    ? 'Remove ' + img.title + ' from favorites'
                    : 'Add ' + img.title + ' to favorites'" :aria-pressed="isFavorite(img.id)" role="button"
                  tabindex="0">
                  <Icon :icon="isFavorite(img.id)
                    ? 'material-symbols:favorite'
                    : 'material-symbols:favorite-outline'" aria-hidden="true" />
                </button>
                <button class="download-btn" @click.stop="handleDownload(img)" :aria-label="'Download ' + img.title"
                  role="button" tabindex="0">
                  <Icon icon="material-symbols:download" aria-hidden="true" />
                </button>
              </aside>
              <figcaption class="image-info">
                <h3>{{ img.title }}</h3>
                <span class="category" role="text" :aria-label="'Category: ' + img.category">{{ img.category }}</span>
              </figcaption>
            </figure>
          </article>
        </template>
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

    button {
      padding: 1rem 2rem;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      background: var(--card-bg);
      color: var(--text-secondary);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;

      &.active {
        background: linear-gradient(135deg, #e74c3c, #f39c12);
        color: #fff;
      }

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

  .category-filters {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    .category-btn {
      padding: 0.6rem 1.5rem;
      border: 2px solid var(--border-color);
      border-radius: 50px;
      cursor: pointer;
      background: var(--card-bg);
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.3s;

      &.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: #fff;
        border-color: transparent;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      &:hover:not(.active) {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    .image-card {
      background: var(--card-bg);
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 10px 30px var(--card-shadow);
      position: relative;

      .image-container {
        position: relative;
        overflow: hidden;
        height: 250px;
        cursor: pointer;

        &.is-locked img {
          filter: blur(4px) grayscale(50%);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s, filter 0.3s;
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
          display: flex;
          gap: 0.5rem;
          transition: opacity 0.3s;
          z-index: 4;

          .favorite-btn,
          .download-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 1.5rem;
            border: none;
            transition: all 0.3s;
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
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            display: inline-block;
            backdrop-filter: blur(10px);
          }
        }

        &:hover .image-info {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
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
}

@media (max-width: 480px) {
  .gallery {
    grid-template-columns: 1fr;
  }

  .image-container {
    height: 200px;
  }
}
</style>
