import { createApp } from 'vue'
import './style.css'
import './assets/theme.css'
import App from './App.vue'
import router from './router'
import { useToast } from './composables/useToast.js'

const app = createApp(App)
app.use(router)

app.config.errorHandler = (err, instance, info) => {
  console.error('Global Vue error:', err, info)
  const { addToast } = useToast()
  addToast('An unexpected error occurred. Please try again.', 'error')
}
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason)
  const { addToast } = useToast()
  addToast('An unexpected error occurred. Please try again.', 'error')
})

app.mount('#app')


// avaliar se mantenho ou n
