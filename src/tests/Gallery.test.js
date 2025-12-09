import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, reactive, computed } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { Icon } from '@iconify/vue'
import Gallery from '../components/Gallery.vue'

vi.useFakeTimers()

global.IntersectionObserver = class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

const mockIsPro = ref(false)
const mockIsAuthenticated = ref(true)
const mockFavorites = ref([1])
const mockToggleFavorite = vi.fn().mockResolvedValue({ success: true })
const mockUpdateUserData = vi.fn()

const mockImages = ref([
  {
    id: 1,
    title: 'Test Image 1',
    src: 'thumb1.jpg',
    category: 'nature'
  },
  {
    id: 2,
    title: 'Test Image 2',
    src: 'thumb2.jpg',
    category: 'city'
  }
])
const mockLoading = ref(false)
const mockHasMore = ref(true)
const mockFetchCuratedImages = vi.fn()
const mockSearchImages = vi.fn()
const mockLoadMore = vi.fn()

vi.mock('../composables/useFirebaseAuth', () => ({
  useFirebaseAuth: () => ({
    isPro: mockIsPro,
    isAuthenticated: mockIsAuthenticated,
    favorites: mockFavorites,
    toggleFavorite: mockToggleFavorite,
    updateUserData: mockUpdateUserData
  })
}))

vi.mock('../composables/usePexels', () => ({
  usePexels: () => ({
    images: mockImages,
    loading: mockLoading,
    hasMore: mockHasMore,
    fetchCuratedImages: mockFetchCuratedImages,
    searchImages: mockSearchImages,
    loadMore: mockLoadMore
  })
}))

const mockAddToast = vi.fn()
vi.mock('../composables/useToast', () => ({
  useToast: () => ({
    addToast: mockAddToast
  })
}))

const mockGenerateDescription = vi.fn()
const mockGetDescription = vi.fn(() => null)
const mockIsLoadingDescription = vi.fn(() => false)
vi.mock('../composables/useLLM', () => ({
  useLLM: () => ({
    generateDescription: mockGenerateDescription,
    getDescription: mockGetDescription,
    isLoadingDescription: mockIsLoadingDescription
  })
}))

const mockRouter = {
  push: vi.fn()
}
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRouter: () => mockRouter
  }
})

vi.mock('@iconify/vue', () => ({
  Icon: vi.fn(() => ({
    template: '<div class="mock-icon"></div>'
  }))
}))

vi.mock('../components/SkeletonCard.vue', () => ({
  default: {
    template: '<div class="mock-skeleton"></div>'
  }
}))

vi.mock('../components/AuthModal.vue', () => ({
  default: {
    template: '<div class="mock-auth-modal"></div>'
  }
}))

describe('Gallery.vue', () => {
  let wrapper
  let router

  beforeEach(async () => {
    vi.clearAllMocks()
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: {} },
        { path: '/mode-selection', name: 'mode-selection', component: {} }
      ]
    })
    wrapper = mount(Gallery, {
      props: {
        searchQuery: ''
      },
      global: {
        plugins: [router],
        stubs: {
          Icon: true,
          AuthModal: true
        }
      }
    })

    mockImages.value = [
      {
        id: 1,
        title: 'Test Image 1',
        src: 'thumb1.jpg',
        category: 'nature'
      },
      {
        id: 2,
        title: 'Test Image 2',
        src: 'thumb2.jpg',
        category: 'city'
      }
    ]
    await wrapper.vm.$nextTick()
  })

  it('renders gallery section with title', () => {
    expect(wrapper.find('.section-title').text()).toBe('Get Inspired')
  })

  it('renders tabs correctly', () => {
    const tabs = wrapper.findAll('.tabs button')
    expect(tabs.length).toBe(2)
    expect(tabs[0].text()).toContain('All Images')
    expect(tabs[1].text()).toContain('Favorites')
  })

  it('shows all images tab as active by default', () => {
    const allTab = wrapper.find('.tabs button').classes()
    expect(allTab).toContain('active')
  })

  it('switches to favorites tab on click', async () => {
    const favoritesTab = wrapper.findAll('.tabs button')[1]
    await favoritesTab.trigger('click')
    expect(wrapper.vm.activeTab).toBe('favorites')
  })

  it('renders category filters', () => {
    expect(wrapper.find('.category-filters').exists()).toBe(true)
    expect(wrapper.find('.category-btn.all-btn').exists()).toBe(true)
  })

  it('shows loading skeletons when loading and no images', async () => {
    mockImages.value = []
    mockLoading.value = true
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.mock-skeleton').length).toBe(6)
  })

  it('renders gallery grid with images', () => {
    expect(wrapper.find('.gallery').exists()).toBe(true)
    expect(wrapper.findAll('.image-card').length).toBe(2)
  })

  it('displays image information correctly', () => {
    const firstImage = wrapper.findAll('.image-card')[0]
    expect(firstImage.find('h3').text()).toBe('Test Image 1')
    expect(firstImage.find('.category').text()).toBe('nature')
  })

  it('shows favorite button and handles favorite toggle', async () => {
    const favoriteBtn = wrapper.find('.favorite-btn')
    expect(favoriteBtn.exists()).toBe(true)
    await favoriteBtn.trigger('click')
    expect(mockToggleFavorite).toHaveBeenCalledWith(1)
  })

  it('shows download button and handles download', async () => {
    const downloadBtn = wrapper.find('.download-btn')
    expect(downloadBtn.exists()).toBe(true)
    await downloadBtn.trigger('click')
    expect(mockAddToast).toHaveBeenCalled()
  })

  it('shows empty state when no favorites', async () => {
    mockFavorites.value = []
    await wrapper.vm.$nextTick()
    const favoritesTab = wrapper.findAll('.tabs button')[1]
    await favoritesTab.trigger('click')
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('handles category selection', async () => {
    const natureBtn = wrapper.find('.category-btn[aria-label="Nature category"]')
    await natureBtn.trigger('click')
    expect(mockSearchImages).toHaveBeenCalledWith('nature', 1)
  })

  it('shows load more button when hasMore and autoLoadCount >= limit', async () => {
    mockHasMore.value = true
    wrapper.vm.autoLoadCount = 3
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.load-more-btn').exists()).toBe(true)
  })

  it('handles manual load more', async () => {
    mockHasMore.value = true
    wrapper.vm.autoLoadCount = 3
    await wrapper.vm.$nextTick()
    await wrapper.find('.load-more-btn').trigger('click')
    expect(mockLoadMore).toHaveBeenCalled()
  })

  it('opens auth modal when not authenticated and trying to favorite', async () => {
    mockIsAuthenticated.value = false
    await wrapper.vm.$nextTick()
    const favoriteBtn = wrapper.find('.favorite-btn')
    await favoriteBtn.trigger('click')
    expect(wrapper.vm.isAuthModalOpen).toBe(true)
  })

  it('handles premium image click when not pro', async () => {
    mockIsPro.value = false
    mockIsAuthenticated.value = true
    mockImages.value = [{ id: 3, title: 'Premium Image', src: 'premium.jpg', category: 'premium', premium: true }]
    await wrapper.vm.$nextTick()
    const imageContainer = wrapper.find('.image-container.is-locked')
    await imageContainer.trigger('click')
    expect(mockAddToast).toHaveBeenCalled()
  })

  it('shows generate description button when no description', () => {
    mockGetDescription.mockReturnValue(null)
    expect(wrapper.find('.generate-desc-btn').exists()).toBe(true)
  })

  it('handles generate description', async () => {
    mockGetDescription.mockReturnValue(null)
    await wrapper.find('.generate-desc-btn').trigger('click')
    expect(mockGenerateDescription).toHaveBeenCalled()
  })

  it('watches searchQuery changes', async () => {
    await wrapper.setProps({ searchQuery: 'test search' })
    expect(mockSearchImages).toHaveBeenCalledWith('test search', 1)
  })
})
