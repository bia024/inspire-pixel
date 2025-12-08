import { ref, computed } from 'vue'

const consentGiven = ref(false)
const consentRejected = ref(false)
const showSettings = ref(false)
const consents = ref({
  essentials: true,
  preferences: false,
  analytics: false,
  marketing: false,
})

export function useCookieConsent() {
  const needsConsent = computed(() => !consentGiven.value && !consentRejected.value)

  const acceptCookies = () => {
    consentGiven.value = true
    consents.value = {
      essentials: true,
      preferences: true,
      analytics: true,
      marketing: true,
    }
    localStorage.setItem('cookieConsent', 'accepted')
    localStorage.setItem('cookieConsents', JSON.stringify(consents.value))
  }

  const rejectCookies = () => {
    consentRejected.value = true
    consents.value = {
      essentials: true,
      preferences: false,
      analytics: false,
      marketing: false,
    }
    localStorage.setItem('cookieConsent', 'rejected')
    localStorage.setItem('cookieConsents', JSON.stringify(consents.value))
  }

  const setConsent = (type, value) => {
    consents.value[type] = value
  }

  const acceptAll = () => {
    consentGiven.value = true
    consents.value = {
      essentials: true,
      preferences: true,
      analytics: true,
      marketing: true,
    }
    localStorage.setItem('cookieConsent', 'accepted')
    localStorage.setItem('cookieConsents', JSON.stringify(consents.value))
  }

  const rejectAll = () => {
    consentRejected.value = true
    consents.value = {
      essentials: true,
      preferences: false,
      analytics: false,
      marketing: false,
    }
    localStorage.setItem('cookieConsent', 'rejected')
    localStorage.setItem('cookieConsents', JSON.stringify(consents.value))
  }

  const openSettings = () => {
    showSettings.value = true
  }

  const closeSettings = () => {
    showSettings.value = false
    if (Object.values(consents.value).some((v) => v)) {
      consentGiven.value = true
      localStorage.setItem('cookieConsent', 'custom')
      localStorage.setItem('cookieConsents', JSON.stringify(consents.value))
    }
  }

  const storedConsent = localStorage.getItem('cookieConsent')
  const storedConsents = localStorage.getItem('cookieConsents')
  if (storedConsents) {
    consents.value = JSON.parse(storedConsents)
  }
  if (storedConsent === 'accepted') {
    consentGiven.value = true
  } else if (storedConsent === 'rejected') {
    consentRejected.value = true
  } else if (storedConsent === 'custom') {
    consentGiven.value = true
  }

  return {
    needsConsent,
    acceptCookies,
    rejectCookies,
    consents,
    setConsent,
    acceptAll,
    rejectAll,
    showSettings,
    openSettings,
    closeSettings,
  }
}
