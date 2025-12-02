<script setup>
import { Icon } from '@iconify/vue'

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) element.scrollIntoView({ behavior: 'smooth' })
}

// Keyboard navigation for navigation links
const handleNavKeydown = (event, sectionId) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    scrollToSection(sectionId)
  }
}

// Keyboard navigation for icon buttons
const handleIconKeydown = (event, action) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    // Placeholder for future functionality
    console.log(`${action} button pressed`)
  }
}
</script>

<template>
  <header class="header">
    <div class="logo">
      <a href="#hero" @click.prevent="scrollToSection('hero')" aria-label="Back to top">
        <img src="../assets/logo.svg" alt="InspiraPixel Logo" />
      </a>
    </div>
    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="#hero" @click.prevent="scrollToSection('hero')">Início</a></li>
        <li><a href="#gallery" @click.prevent="scrollToSection('gallery')">Galeria</a></li>
        <li>
          <button aria-label="Search" class="icon-button">
            <Icon icon="material-symbols:search" />
          </button>
        </li>
        <li>
          <button aria-label="User Profile" class="icon-button">
            <Icon icon="material-symbols:person-outline" />
          </button>
        </li>
      </ul>
    </nav>
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

  .logo img {
    height: 50px;
  }

  nav ul {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;

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
      &:hover {
        color: #e74c3c;
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
            <img src="../assets/logo.svg" alt="Logo InspiraPixel" />
            <!-- <h1>InspiraPixel</h1> -->
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
