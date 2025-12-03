<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AuthModal from './AuthModal.vue'

const router = useRouter()
const { user, isPro, logout } = useAuth()

const isMenuOpen = ref(false)
const headerSearchTerm = ref('')
const isAuthModalOpen = ref(false)

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
</script>

<template>
  <header class="header">
    <div class="logo">
      <router-link :to="{ name: 'home' }" aria-label="Back to home" @click="closeMenu">
        <img src="../assets/logo.svg" alt="InspirePixel Logo" />
      </router-link>
      <span v-if="isPro" class="pro-badge">PRO</span>
      <span v-else class="free-badge">FREE</span>
    </div>

    <button class="hamburger" @click="toggleMenu" aria-label="Toggle navigation menu">
      <Icon :icon="isMenuOpen ? 'material-symbols:close' : 'material-symbols:menu'" />
    </button>

    <nav :class="{ 'nav-open': isMenuOpen }" aria-label="Main Navigation">
      <ul>
        <li><router-link :to="{ name: 'home' }" @click="closeMenu">Home</router-link></li>
        <li>
          <router-link :to="{ name: 'home', hash: '#gallery' }" @click="closeMenu"
            >Gallery</router-link
          >
        </li>
        
        <!-- Mobile Search Input -->
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

        <!-- Desktop Search Icon -->
        <li class="desktop-only">
          <button aria-label="Search" class="icon-button">
            <Icon icon="material-symbols:search" />
          </button>
        </li>

        <li>
          <div v-if="user" class="user-menu">
            <span class="user-name">Hi, {{ user.name }}</span>
            <button @click="logout" class="icon-button logout-btn" aria-label="Logout">
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
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;

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

  .hamburger {
    display: none;
    background: none;
    border: none;
    font-size: 2rem;
    color: #333;
    cursor: pointer;
    z-index: 1001;
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
      color: #e74c3c;
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
        color: #e74c3c;
      }
    }
  }
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;

    .hamburger {
      display: block;
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
      width: 75%;
      height: 100vh;
      background: #fff;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
      padding: 5rem 2rem;
      transition: right 0.3s ease-in-out;

      &.nav-open {
        right: 0;
      }

      ul {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;

        li {
          width: 100%;
        }

        a {
          font-size: 1.2rem;
          display: block;
          padding: 0.5rem 0;
        }

        .profile-btn {
          font-size: 1.1rem;
          padding: 0.5rem 0;
          width: 100%;
          justify-content: flex-start;
        }

        .search-item {
          width: 100%;
          margin-bottom: 1rem;
        }

        .search-input-wrapper {
          position: relative;
          width: 100%;

          .search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #7f8c8d;
          }

          input {
            width: 100%;
            padding: 0.8rem 1rem 0.8rem 2.5rem;
            border: 1px solid #e1e8ed;
            border-radius: 50px;
            font-size: 1rem;
            background: #f8f9fa;
            
            &:focus {
              outline: none;
              border-color: #e74c3c;
              background: #fff;
            }
          }
        }
      }
    }
  }
}
</style>

<!-- 
<script setup>
import { Icon } from '@iconify/vue';

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
    <header class="header">
        <div class="logo">
            <img src="../assets/logo.svg" alt="Logo InspirePixel" />
            <!-- <h1>InspirePixel</h1> -->
<!-- </div>
        <nav>
            <ul>
                <li><a href="#hero" @click="scrollToSection('hero')">Home</a></li>
                <li><a href="#main" @click="scrollToSection('main')">Gallery</a></li>
                <li><a href="#favorites" @click="scrollToSection('favorites')">Favorites</a></li>
                <li><Icon icon="material-symbols:search" /></li>
                <li><Icon icon="material-symbols:person-outline" /></li>
            </ul>
        </nav>
    </header>
</template>

<style scoped lang="scss">

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem;

    ul {
        display: flex;
        align-items: center;
        gap: 1rem;
        list-style: none;

        li a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            font-size: 1.1rem;

            &:hover {
                color: #555;
            }
        }
    }
}
</style>
 -->
-->
