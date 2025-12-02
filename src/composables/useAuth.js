import { ref, computed } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const userMode = ref(localStorage.getItem('userMode') || 'free')

export function useAuth() {
    const isPro = computed(() => userMode.value === 'pro')
    const isAuthenticated = computed(() => !!user.value)

    const login = (userData) => {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
        // Simulate restoring mode or default to free
        userMode.value = userData.mode || 'free'
        localStorage.setItem('userMode', userMode.value)
    }

    const register = (userData) => {
        // In a real app, this would call an API
        const newUser = { ...userData, id: Date.now(), mode: 'free' }
        login(newUser)
        return newUser
    }

    const logout = () => {
        user.value = null
        userMode.value = 'free'
        localStorage.removeItem('user')
        localStorage.setItem('userMode', 'free')
    }

    const upgradeToPro = () => {
        userMode.value = 'pro'
        localStorage.setItem('userMode', 'pro')
        if (user.value) {
            user.value.mode = 'pro'
            localStorage.setItem('user', JSON.stringify(user.value))
        }
    }

    return {
        user,
        userMode,
        isPro,
        isAuthenticated,
        login,
        register,
        logout,
        upgradeToPro
    }
}
