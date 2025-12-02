<!-- <script setup>
import { ref } from "vue";

const searchTerm = ref("");

const emit = defineEmits(["search"]);

const handleSearch = () => {
  emit("search", searchTerm.value);
};
</script>

<template>
  <section class="hero">
    <div>
      <h2>Where landscapes turn into <span>inspiration</span></h2>
      <p>
        Discover colors, light, and scenery that spark new stories through the
        lens.
      </p>
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search images..."
        @input="handleSearch"
      />
    </div>
    <img src="../assets/fotografo.png" alt="Illustrative image" />
  </section>
</template>
<style scoped lang="scss">
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;

  div {
    max-width: 50%;

    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    span {
      font-size: 3rem;
      color: #e1306c;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
    }

    input {
      padding: 0.8rem;
      width: 100%;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }

  img {
    // max-width: 40%;
    width: 40vw;
    // height: auto;
  }
}
</style> -->

<script setup>
import { ref } from 'vue'

const searchTerm = ref('')
const emit = defineEmits(['search'])

const handleSearch = () => {
  // Validate and sanitize search term
  const term = searchTerm.value?.trim()

  // Basic validation - prevent extremely long searches or special characters that could cause issues
  if (term && term.length > 100) {
    console.warn('Search term too long, truncating to 100 characters')
    searchTerm.value = term.substring(0, 100)
  }

  // Emit sanitized search term
  emit('search', searchTerm.value)
}

// Clear search functionality
const clearSearch = () => {
  searchTerm.value = ''
  emit('search', '')
}

// Optional: Add debounced search for better UX
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleSearch()
  }, 300) // 300ms delay
}
</script>

<template>
  <section class="hero" id="hero">
    <div class="hero-text">
      <h2>Onde paisagens se transformam em <span>inspiração</span></h2>
      <p>Descubra cores, luz e cenários que inspiram novas histórias através da lente.</p>
      <div class="search-container">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar imagens..."
          @input="debouncedSearch"
          aria-label="Buscar imagens"
        />
        <button
          v-if="searchTerm"
          class="clear-search-btn"
          @click="clearSearch"
          aria-label="Limpar busca"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
    <div class="hero-image">
      <img src="../assets/fotografo.png" alt="Illustrative photographer" />
    </div>
  </section>
</template>

<style scoped lang="scss">
// Screen reader only text
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;

  .hero-text {
    max-width: 50%;

    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    h2 span {
      font-size: 3rem;
      color: #e1306c;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
    }

    .search-container {
      position: relative;
      width: 100%;

      input {
        width: 100%;
        padding: 0.8rem 2.5rem 0.8rem 0.8rem;
        font-size: 1rem;
        border-radius: 4px;
        border: 1px solid #ccc;
        transition: border-color 0.3s ease;

        &:focus {
          outline: 2px solid #e1306c;
          outline-offset: 2px;
          border-color: #e1306c;
        }
      }

      .clear-search-btn {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #666;
        cursor: pointer;
        padding: 0.2rem;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #333;
        }

        &:focus {
          outline: 2px solid #e1306c;
          outline-offset: 2px;
        }
      }
    }
  }

  .hero-image img {
    width: 40vw;
    height: auto;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
  }
  .hero-text {
    max-width: 100%;
    margin-bottom: 2rem;
  }
  .hero-image img {
    width: 100%;
  }
}
</style>
