import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { Icon } from '@iconify/vue'
import Header from '../components/Header.vue'
import AuthModal from '../components/AuthModal.vue'

vi.useFakeTimers()

const mockIsDark = ref(false)
const mockToggleDarkMode = vi.fn()
vi.mock('../composables/useDarkMode', () => ({
  useDarkMode: () => ({
    isDark: mockIsDark,
    toggleDarkMode: mockToggleDarkMode
  })
}))

const mockUser = ref('Test User')
const mockIsPro = ref(false)
const mockLogout = vi.fn()
const mockUpdateUserData = vi.fn()
vi.mock('../composables/useFirebaseAuth', () => ({
  useFirebaseAuth: () => ({
    user: mockUser,
    isPro: mockIsPro,
    logout: mockLogout,
    updateUserData: mockUpdateUserData
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

vi.mock('../components/AuthModal.vue', () => ({
  default: {
    template: '<div class="mock-auth-modal"></div>'
  }
}))

describe('Header.vue', () => {
  let wrapper
  let router

  beforeEach(() => {
    vi.useFakeTimers()
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: {} },
        { path: '/mode-selection', name: 'mode-selection', component: {} }
      ]
    })
    wrapper = mount(Header, {
      global: {
        plugins: [router],
        stubs: {
          Icon: true,
          AuthModal: true
        }
      }
    })
    vi.advanceTimersByTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllTimers()
  })

  it('renders logo and navigation correctly', () => {
    expect(wrapper.find('.logo img').exists()).toBe(true)
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('.logo .free-badge').exists()).toBe(true)
  })

  it('toggles mobile menu on hamburger click', async () => {
    const hamburger = wrapper.find('.hamburger')
    await hamburger.trigger('click')
    expect(wrapper.vm.isMenuOpen).toBe(true)
    await hamburger.trigger('click')
    expect(wrapper.vm.isMenuOpen).toBe(false)
  })

  it('toggles dark mode on theme button click', async () => {
    const themeButton = wrapper.find('.theme-toggle')
    await themeButton.trigger('click')
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1)
  })

  it('handles search in header and navigates', async () => {
    const input = wrapper.find('input[placeholder="Search..."]')
    await input.setValue('test search')
    await input.trigger('keyup.enter')
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'home', query: { q: 'test search' } })
  })

  it('shows user greeting and allows editing', async () => {
    mockUser.value = { name: 'Test User' }
    mockIsPro.value = false
    wrapper.vm.displayedName = 'Test User'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.greeting-container').text()).toContain('Hi, Test User!')
    await wrapper.find('.greeting-container').trigger('click')
    expect(wrapper.find('.name-input').exists()).toBe(true)
  })

  it('handles logout', async () => {
    mockUser.value = { name: 'Test User' }
    await wrapper.vm.$nextTick()
    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    await wrapper.find('.logout-btn').trigger('click')
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'mode-selection' })
  })

  it('opens auth modal when not logged in', async () => {
    mockUser.value = null
    await wrapper.vm.$nextTick()
    const profileBtn = wrapper.find('.profile-btn')
    await profileBtn.trigger('click')
    expect(wrapper.vm.isAuthModalOpen).toBe(true)
  })
})
