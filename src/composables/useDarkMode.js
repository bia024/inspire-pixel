import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
    const toggleDarkMode = () => {
        isDark.value = !isDark.value
    }

    const setDarkMode = (value) => {
        isDark.value = value
    }

    onMounted(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            isDark.value = savedTheme === 'dark'
        } else {
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
    })

    watch(isDark, (newValue) => {
        if (newValue) {
            document.documentElement.classList.add('dark-mode')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark-mode')
            localStorage.setItem('theme', 'light')
        }
    }, { immediate: true })

    return {
        isDark,
        toggleDarkMode,
        setDarkMode
    }
}