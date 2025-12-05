<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useFirebaseAuth } from '../composables/useFirebaseAuth'
import { useDarkMode } from '../composables/useDarkMode'
import AuthModal from './AuthModal.vue'

const router = useRouter()
const { user, isPro, logout, updateUserData } = useFirebaseAuth()
const { isDark, toggleDarkMode } = useDarkMode()

const isMenuOpen = ref(false)
const headerSearchTerm = ref('')
const isAuthModalOpen = ref(false)

const displayedName = ref('')
const isEditingName = ref(false)
const nameInputRef = ref(null)
let isMounted = false

const startTypeWriterLoop = async () => {
  while (isMounted) {
    const text = user.value?.name || ''

    if (isEditingName.value || !text) {
      await new Promise(resolve => setTimeout(resolve, 500))
      continue
    }

    for (let i = 0; i <= text.length; i++) {
      if (isEditingName.value || !isMounted) break
      displayedName.value = text.substring(0, i)
      const randomDelay = 150 + Math.random() * 50
      await new Promise(resolve => setTimeout(resolve, randomDelay))
    }

    if (isEditingName.value || !isMounted) continue
    await new Promise(resolve => setTimeout(resolve, 2000))

    for (let i = text.length; i >= 0; i--) {
      if (isEditingName.value || !isMounted) break
      displayedName.value = text.substring(0, i)
      await new Promise(resolve => setTimeout(resolve, 75))
    }

    if (isEditingName.value || !isMounted) continue
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

onMounted(() => {
  isMounted = true
  startTypeWriterLoop()
})

onUnmounted(() => {
  isMounted = false
})

const startEditingName = async () => {
  isEditingName.value = true
  displayedName.value = user.value.name
  await nextTick()
  nameInputRef.value?.focus()
}

const finishEditingName = () => {
  isEditingName.value = false
  if (displayedName.value.trim() !== '') {
    updateUserData({ name: displayedName.value.trim() })
  } else {
    displayedName.value = user.value.name
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleHeaderSearch = () => {
  closeMenu()
  if (headerSearchTerm.value.trim()) {
    router.push({ name: 'home', query: { q: headerSearchTerm.value } })
    headerSearchTerm.value = ''
  }
}

const openAuthModal = () => {
  isAuthModalOpen.value = true
  closeMenu()
}

const handleLogout = () => {
  logout()
  router.push({ name: 'mode-selection' })
}
</script>

<template>
  <header class="header">
    <div class="logo">
      <router-link :to="{ name: 'home' }" aria-label="Back to home" @click="closeMenu">
        <img src="../assets/logo.svg" alt="InspirePixel Logo" />
      </router-link>
      <template v-if="user">
        <span v-if="isPro" class="pro-badge">PRO</span>
        <span v-else class="free-badge">FREE</span>
      </template>
    </div>
    <button class="hamburger" @click="toggleMenu" aria-label="Toggle navigation menu">
      <Icon v-if="isMenuOpen" icon="material-symbols:close" class="close-icon" />
      <img v-else src="../assets/icon-mobile.svg" alt="Menu" />
    </button>
    <nav :class="{ 'nav-open': isMenuOpen }" aria-label="Main Navigation">
      <ul>
        <li><router-link :to="{ name: 'home' }" @click="closeMenu">Home</router-link></li>
        <li>
          <router-link :to="{ name: 'home', hash: '#gallery' }" @click="closeMenu">Gallery</router-link>
        </li>
        <li class="mobile-only search-item">
          <div class="search-input-wrapper">
            <Icon icon="material-symbols:search" class="search-icon" />
            <input type="text" placeholder="Search..." aria-label="Search" v-model="headerSearchTerm"
              @keyup.enter="handleHeaderSearch" />
          </div>
        </li>
        <li class="desktop-only">
          <button aria-label="Search" class="icon-button">
            <Icon icon="material-symbols:search" />
          </button>
        </li>
        <li>
          <button @click="toggleDarkMode" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            class="icon-button theme-toggle">
            <Icon :icon="isDark ? 'material-symbols:light-mode' : 'material-symbols:dark-mode'" />
            <span class="mobile-only">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>
        </li>
        <li>
          <div v-if="user" class="user-menu">
            <div class="greeting-container" @click="startEditingName" title="Click to edit your name">
              <span class="greeting-text">Hi, </span>
              <input v-if="isEditingName" ref="nameInputRef" v-model="displayedName" @blur="finishEditingName"
                @keyup.enter="finishEditingName" class="name-input" />
              <span v-else class="typewriter-text">{{ displayedName }}<span class="cursor">!</span></span>
              <Icon icon="material-symbols:edit" class="edit-icon" />
            </div>
            <button @click="handleLogout" class="icon-button logout-btn" aria-label="Logout">
              <Icon icon="material-symbols:logout" />
            </button>
          </div>
          <button v-else @click="openAuthModal" aria-label="User Profile" class="icon-button profile-btn"
            :class="{ 'is-pro': isPro }">
            <Icon :icon="isPro ? 'material-symbols:verified' : 'material-symbols:person-outline'" />
            <span class="mobile-only">{{ isPro ? 'Pro Member' : 'Login / Register' }}</span>
          </button>
        </li>
      </ul>
    </nav>
    <AuthModal :is-open="isAuthModalOpen" @close="isAuthModalOpen = false" />
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: var(--bg-primary);
  box-shadow: 0 2px 10px var(--card-shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    img {
      height: 50px;
    }
  }

  .pro-badge {
    background: linear-gradient(135deg, #f1c40f, #f39c12);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 5px rgba(243, 156, 18, 0.3);
  }

  .free-badge {
    background: linear-gradient(135deg, #a29bfe, #6c5ce7);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 5px rgba(108, 92, 231, 0.3);
  }

  .theme-toggle {
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
      transform: rotate(20deg);
      color: #f39c12;
    }
  }

  .hamburger {
    display: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    z-index: 1001;

    img {
      width: 40px;
      height: 40px;
      display: block;
    }

    .close-icon {
      font-size: 2.5rem;
      color: #E1306C;
      transition: transform 0.3s ease;

      &:hover {
        transform: rotate(90deg);
      }
    }
  }

  .mobile-only {
    display: none;
  }

  nav ul {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;

    a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      transition: color 0.3s;
    }

    a:hover {
      color: #E1306C;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      padding: 0.6rem 1.5rem;
      background-color: #f8f9fa;
      border: 1px solid #e1e8ed;
      border-radius: 50px;
      min-width: 200px;
      justify-content: space-between;
      transition: all 0.3s ease;

      &:hover {
        background-color: #fff;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        border-color: #d1d8dd;
      }

      .user-name {
        display: none;
      }

      .greeting-container {
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;

        &:hover .edit-icon {
          opacity: 1;
        }
      }

      .greeting-text {
        color: #2c3e50;
        margin-right: 4px;
        font-weight: 500;
      }

      .typewriter-text {
        font-family: 'Courier New', Courier, monospace;
        color: #7f8c8d;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .name-input {
        border: none;
        background: transparent;
        font-family: 'Courier New', Courier, monospace;
        color: #7f8c8d;
        font-weight: 600;
        font-size: 1rem;
        width: 120px;
        outline: none;
        border-bottom: 1px solid #e1e8ed;
        padding: 0;
      }

      .cursor {
        display: inline-block;
        color: #E1306C;
        animation: blink 1s infinite;
        margin-left: 1px;
        font-weight: 700;
      }

      .edit-icon {
        font-size: 0.9rem;
        color: #bdc3c7;
        margin-left: 8px;
        opacity: 0;
        transition: opacity 0.3s;
      }

      @keyframes blink {

        0%,
        100% {
          opacity: 1;
        }

        50% {
          opacity: 0;
        }
      }

      .logout-btn {
        color: #95a5a6;
        padding: 4px;
        border-radius: 50%;
        transition: all 0.2s;

        &:hover {
          color: #e74c3c;
          background: rgba(231, 76, 60, 0.1);
        }
      }
    }

    .icon-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.4rem;
      color: #333;
      transition: color 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        color: #E1306C;
      }
    }
  }
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;

    .hamburger {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .desktop-only {
      display: none;
    }

    .mobile-only {
      display: block;
    }

    nav {
      position: fixed;
      top: 0;
      right: -100%;
      width: 85%;
      max-width: 400px;
      height: 100vh;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
      padding: 6rem 2rem 2rem;
      transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      overflow-y: auto;

      &.nav-open {
        right: 0;
      }

      ul {
        flex-direction: column;
        align-items: flex-start;
        gap: 2rem;

        li {
          width: 100%;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding-bottom: 1rem;

          &:last-child {
            border-bottom: none;
          }
        }

        a {
          font-size: 1.3rem;
          display: block;
          padding: 0.5rem 0;
          color: #2c3e50;
          font-weight: 600;

          &:hover,
          &.router-link-active {
            color: #E1306C;
            padding-left: 10px;
          }
        }

        .profile-btn {
          font-size: 1.2rem;
          padding: 0.5rem 0;
          width: 100%;
          justify-content: flex-start;
          color: #2c3e50;

          &:hover {
            color: #E1306C;
          }
        }

        .search-item {
          width: 100%;
          margin-bottom: 0.5rem;
          border-bottom: none;
        }

        .search-input-wrapper {
          position: relative;
          width: 100%;

          .search-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #E1306C;
            font-size: 1.2rem;
          }

          input {
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            border: 2px solid transparent;
            border-radius: 12px;
            font-size: 1rem;
            background: #f0f2f5;
            transition: all 0.3s ease;

            &:focus {
              outline: none;
              border-color: #E1306C;
              background: #fff;
              box-shadow: 0 4px 15px rgba(225, 48, 108, 0.1);
            }

            &::placeholder {
              color: #95a5a6;
            }
          }
        }
      }
    }
  }
}
</style>
