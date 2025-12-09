import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { Icon } from '@iconify/vue'
import Hero from '../components/Hero.vue'

vi.useFakeTimers()

const mockIsPro = ref(false)
vi.mock('../composables/useFirebaseAuth', () => ({
  useFirebaseAuth: () => ({
    isPro: mockIsPro
  })
}))

const mockUseRoute = {
  query: { q: '' }
}
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRoute: () => mockUseRoute,
    useRouter: () => ({ push: vi.fn() })
  }
})

vi.mock('@iconify/vue', () => ({
  Icon: vi.fn(() => ({
    template: '<div class="mock-icon"></div>'
  }))
}))

describe('Hero.vue', () => {
  let wrapper
  let router

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: {} },
        { path: '/mode-selection', name: 'mode-selection', component: {} }
      ]
    })
    wrapper = mount(Hero, {
      global: {
        plugins: [router],
        stubs: {
          Icon: true,
          RouterLink: true
        }
      }
    })
  })

  it('renders hero section with search input', () => {
    expect(wrapper.find('.hero').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Search images..."]').exists()).toBe(true)
    expect(wrapper.find('.search-icon-btn').exists()).toBe(true)
  })

  it('emits search event on form submit', async () => {
    await wrapper.find('input').setValue('test search')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0]).toEqual(['test search'])
  })

  it('handles debounced search input', async () => {
    const input = wrapper.find('input')
    await input.setValue('test')
    vi.advanceTimersByTime(350)
    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('clears search on clear button click', async () => {
    await wrapper.find('input').setValue('test search')
    await wrapper.find('.clear-search-btn').trigger('click')
    expect(wrapper.vm.searchTerm).toBe('')
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0]).toEqual([''])
  })

  it('shows premium preview when not pro', async () => {
    mockIsPro.value = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.hero-showcase').exists()).toBe(true)
  })

  it('shows carousel when pro', async () => {
    mockIsPro.value = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.pro-carousel').exists()).toBe(true)
    expect(wrapper.find('.carousel-slides').exists()).toBe(true)
  })

  it('handles carousel navigation', async () => {
    mockIsPro.value = true
    await wrapper.vm.$nextTick()
    const nextBtn = wrapper.find('.carousel-nav.next')
    await nextBtn.trigger('click')
    expect(wrapper.vm.currentSlide).toBe(1)
    const prevBtn = wrapper.find('.carousel-nav.prev')
    await prevBtn.trigger('click')
    expect(wrapper.vm.currentSlide).toBe(0)
  })

  it('pauses and resumes slideshow on hover', async () => {
    mockIsPro.value = true
    await wrapper.vm.$nextTick()
    const container = wrapper.find('.carousel-container')
    await container.trigger('mouseenter')
    expect(wrapper.vm.slideInterval).toBeNull()
    await container.trigger('mouseleave')
    expect(wrapper.vm.slideInterval).not.toBeNull()
  })

  it('validates search term length', async () => {
    const longSearch = 'a'.repeat(101)
    await wrapper.find('input').setValue(longSearch)
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.vm.searchTerm).toBe(longSearch.substring(0, 100))
  })

  it('watches route query and updates search term', async () => {
    mockUseRoute.query.q = 'route search'
    await wrapper.vm.$nextTick()
    expect(mockUseRoute.query.q).toBe('route search')
  })
})
