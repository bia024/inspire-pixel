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
const themeToggleRef = ref(null)
let isMounted = false

const startTypeWriterLoop = async () => {
  while (isMounted) {
    const text = user.value?.name || ''

    if (isEditingName.value || !text) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      continue
    }

    for (let i = 0; i <= text.length; i++) {
      if (isEditingName.value || !isMounted) break
      displayedName.value = text.substring(0, i)
      const randomDelay = 150 + Math.random() * 50
      await new Promise((resolve) => setTimeout(resolve, randomDelay))
    }

    if (isEditingName.value || !isMounted) continue
    await new Promise((resolve) => setTimeout(resolve, 2000))

    for (let i = text.length; i >= 0; i--) {
      if (isEditingName.value || !isMounted) break
      displayedName.value = text.substring(0, i)
      await new Promise((resolve) => setTimeout(resolve, 75))
    }

    if (isEditingName.value || !isMounted) continue
    await new Promise((resolve) => setTimeout(resolve, 500))
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

const toggleTheme = () => {
  toggleDarkMode()
  if (isMenuOpen.value) {
    navRef.value?.classList.add('shake')
    setTimeout(() => {
      navRef.value?.classList.remove('shake')
    }, 500)
  }
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
    <nav ref="navRef" :class="{ 'nav-open': isMenuOpen }" aria-label="Main Navigation">
      <ul>
        <li><router-link :to="{ name: 'home', hash: '#hero' }" @click="closeMenu">Home</router-link></li>
        <li>
          <router-link :to="{ name: 'home', hash: '#gallery' }" @click="closeMenu"
            >Gallery</router-link
          >
        </li>
        <li class="mobile-only search-item">
          <div class="search-input-wrapper">
            <Icon icon="material-symbols:search" class="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              v-model="headerSearchTerm"
              @keyup.enter="handleHeaderSearch"
            />
          </div>
        </li>
        <li class="desktop-only">
          <button aria-label="Search" class="icon-button">
            <Icon icon="material-symbols:search" />
          </button>
        </li>
        <li>
          <button
            ref="themeToggleRef"
            @click="toggleTheme"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            class="icon-button theme-toggle"
          >
            <Icon :icon="isDark ? 'material-symbols:light-mode' : 'material-symbols:dark-mode'" />
            <span class="mobile-only">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>
        </li>
        <li>
          <div v-if="user" class="user-menu">
            <div
              class="greeting-container"
              @click="startEditingName"
              title="Click to edit your name"
            >
              <span class="greeting-text">Hi, </span>
              <input
                v-if="isEditingName"
                ref="nameInputRef"
                v-model="displayedName"
                @blur="finishEditingName"
                @keyup.enter="finishEditingName"
                class="name-input"
              />
              <span v-else class="typewriter-text"
                >{{ displayedName }}<span class="cursor">!</span></span
              >
              <Icon icon="material-symbols:edit" class="edit-icon" />
            </div>
            <button @click="handleLogout" class="icon-button logout-btn" aria-label="Logout">
              <Icon icon="material-symbols:logout" />
            </button>
          </div>
          <button
            v-else
            @click="openAuthModal"
            aria-label="User Profile"
            class="icon-button profile-btn"
            :class="{ 'is-pro': isPro }"
          >
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
  box-shadow: 0 0.125rem 0.625rem var(--card-shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 0.0625rem solid var(--border-color);

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    img {
      height: 3.125rem;
    }
  }

  .pro-badge {
    background: linear-gradient(135deg, #f1c40f, #f39c12);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    letter-spacing: 0.03125rem;
    box-shadow: 0 0.125rem 0.3125rem rgba(243, 156, 18, 0.3);
  }

  .free-badge {
    background: linear-gradient(135deg, #a29bfe, #6c5ce7);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    letter-spacing: 0.03125rem;
    box-shadow: 0 0.125rem 0.3125rem rgba(108, 92, 231, 0.3);
  }

  .theme-toggle {
    transition:
      transform 0.3s ease,
      color 0.3s ease;

    &:hover {
      transform: rotate(20deg);
      color: #f39c12;
    }

    &.shake {
      animation: shake 0.5s ease-in-out;
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  .hamburger {
    display: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    z-index: 1001;

    img {
      width: 2.5rem;
      height: 2.5rem;
      display: block;
    }

    .close-icon {
      font-size: 2.5rem;
      color: #e1306c;
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
      color: #e1306c;
    }

      .user-menu {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        padding: 0.6rem 1.5rem;
        background-color: var(--bg-secondary);
        border: 0.0625rem solid var(--border-color);
        border-radius: 3.125rem;
        min-width: 12.5rem;
        justify-content: space-between;
        transition: all 0.3s ease;

        &:hover {
          background-color: var(--bg-primary);
          box-shadow: 0 0.25rem 0.9375rem var(--card-shadow);
          border-color: var(--border-light);
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
        margin-right: 0.25rem;
        font-weight: 500;
      }

      .typewriter-text {
        font-family: 'Courier New', Courier, monospace;
        color: #7f8c8d;
        font-weight: 600;
        letter-spacing: 0.03125rem;
      }

      .name-input {
        border: none;
        background: transparent;
        font-family: 'Courier New', Courier, monospace;
        color: #7f8c8d;
        font-weight: 600;
        font-size: 1rem;
        width: 7.5rem;
        outline: none;
        border-bottom: 0.0625rem solid #e1e8ed;
        padding: 0;
      }

      .cursor {
        display: inline-block;
        color: #e1306c;
        animation: blink 1s infinite;
        margin-left: 0.0625rem;
        font-weight: 700;
      }

      .edit-icon {
        font-size: 0.9rem;
        color: #bdc3c7;
        margin-left: 0.5rem;
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
        padding: 0.25rem;
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
        color: #e1306c;
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
      max-width: 25rem;
      height: 100vh;
      background: var(--bg-primary);
      backdrop-filter: blur(0.625rem);
      box-shadow: -0.3125rem 0 1.5625rem var(--card-shadow);
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
          border-bottom: 0.0625rem solid var(--border-color);
          padding-bottom: 1rem;

          &:last-child {
            border-bottom: none;
          }
        }

        a {
          font-size: 1.3rem;
          display: block;
          padding: 0.5rem 0;
          color: var(--text-primary);
          font-weight: 600;

          &:hover,
          &.router-link-active {
            color: var(--accent-pink);
            padding-left: 0.625rem;
          }
        }

        .profile-btn {
          font-size: 1.2rem;
          padding: 0.5rem 0;
          width: 100%;
          justify-content: flex-start;
          color: #2c3e50;

          &:hover {
            color: #e1306c;
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
            left: 0.9375rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--accent-pink);
            font-size: 1.2rem;
          }

          input {
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            border: 0.125rem solid transparent;
            border-radius: 0.75rem;
            font-size: 1rem;
            background: var(--bg-secondary);
            transition: all 0.3s ease;

            &:focus {
              outline: none;
              border-color: var(--accent-pink);
              background: var(--bg-primary);
              box-shadow: 0 0.25rem 0.9375rem rgba(225, 48, 108, 0.1);
            }

            &::placeholder {
              color: var(--text-muted);
            }
          }
        }
      }
    }
  }
}
</style>
