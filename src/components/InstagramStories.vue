<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import storyImgPrincipal from '../assets/principal.png'
import storyImg2 from '../assets/vivianearaujo.png'
import storyImgGracyanne from '../assets/gracyannebarbosa.png'
import storyImgBelo from '../assets/belo.png'
import storyImgVirginios from '../assets/virginios.png'
import storyImgPaulomuzy from '../assets/paulomuzy.png'
import storyImgCarol from '../assets/carol.png'
import storyImgVainaWeb from '../assets/vainaweb.png'
import storyImgKleber from '../assets/klebin.png'
import storyImgKarynne from '../assets/kaka.png'
import storyImgJoao from '../assets/jaozin.png'
import storyImgJoy from '../assets/joy.png'
import storyImgVictor from '../assets/victor.png'
import storyImgSteffany from '../assets/ste.png'

const stories = ref([
  { id: 1, user: 'Seu Story', avatar: storyImgPrincipal, isViewed: false },
  { id: 3, user: 'Viviane Araújo', avatar: storyImg2, isViewed: false },
  { id: 4, user: 'Gracyanne B.', avatar: storyImgGracyanne, isViewed: false },
  { id: 5, user: 'Belo', avatar: storyImgBelo, isViewed: false },
  { id: 6, user: 'Virginia', avatar: storyImgVirginios, isViewed: false },
  { id: 7, user: 'Paulo Muzy', avatar: storyImgPaulomuzy, isViewed: false },
  { id: 8, user: 'Carol', avatar: storyImgCarol, isViewed: false },
  { id: 9, user: 'Vai na Web', avatar: storyImgVainaWeb, isViewed: false },
  { id: 10, user: 'Kleber', avatar: storyImgKleber, isViewed: false },
  { id: 11, user: 'Karynne', avatar: storyImgKarynne, isViewed: false },
  { id: 12, user: 'João Pedro', avatar: storyImgJoao, isViewed: false },
  { id: 13, user: 'Joy', avatar: storyImgJoy, isViewed: false },
  { id: 14, user: 'Victor', avatar: storyImgVictor, isViewed: false },
  { id: 15, user: 'Steffany', avatar: storyImgSteffany, isViewed: false },
])

const router = useRouter()

function viewStory(story) {
  story.isViewed = true
  router.push({ name: 'Perfil', params: { username: story.user } })
}
</script>

<template>
  <section class="stories-section" aria-label="Stories de usuários">
    <div class="container">
      <ul class="stories-list">
        <li
          class="story"
          v-for="story in stories"
          :key="story.id"
          @click="viewStory(story)"
          tabindex="0"
          @keydown.enter="viewStory(story)"
          @keydown.space.prevent="viewStory(story)"
        >
          <div class="story-avatar" :class="{ 'is-viewed': story.isViewed }">
            <img :src="story.avatar" :alt="`Story de ${story.user}`" />
          </div>
          <span class="story-user">{{ story.user }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.stories-section {
  padding: 1.5rem 0;
  background-color: var(--bg-secondary);
  border-top: 0.0625rem solid var(--border-color);
  border-bottom: 0.0625rem solid var(--border-color);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .container {
    max-width: 75rem;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .stories-list {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .story {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    flex-shrink: 0;

    &:focus {
      outline: none;

      .story-avatar {
        box-shadow: 0 0 0 0.1875rem var(--primary-color-light);
      }
    }
  }

  .story-avatar {
    width: 4.25rem;
    height: 4.25rem;
    border-radius: 50%;
    padding: 0.1875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    transition: all 0.3s ease;

    &.is-viewed {
      background: var(--border-color);
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 0.125rem solid var(--bg-primary);
    }
  }

  .story-user {
    font-size: 0.75rem;
    color: var(--text-secondary);
    max-width: 4.375rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
