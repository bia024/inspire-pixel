<script setup>
import { ref, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { usePexels } from '../composables/usePexels'
import { useSpotify } from '../composables/useSpotify'

const router = useRouter()
const { searchImages } = usePexels()
const { token, checkToken, login, searchTracks } = useSpotify()

const stories = ref([])
const currentStoryIndex = ref(0)
const isPaused = ref(false)
const progress = ref(0)
const loading = ref(true)
const audioPlayer = ref(null)

const FEATURED_ARTISTS = ['Coldplay', 'Dua Lipa', 'Queen', 'The Weeknd', 'Arctic Monkeys']

onMounted(async () => {
  checkToken()

  if (token.value) {
    await loadStories()
  } else {
    loading.value = false
  }

  window.addEventListener('keydown', handleKeydown)
})

const handleKeydown = (e) => {
  if (e.key === 'ArrowRight') nextStory()
  if (e.key === 'ArrowLeft') prevStory()
  if (e.key === ' ') togglePause()
}

const loadStories = async () => {
  loading.value = true
  const newStories = []
  console.log('Starting to load stories...')

  try {
    for (const artist of FEATURED_ARTISTS) {
      console.log(`Processing artist: ${artist}`)

      let photo = 'https://via.placeholder.com/1080x1920'
      try {
        const pexelsRes = await searchImages(artist + ' concert', 1)
        if (pexelsRes.success && pexelsRes.images.length > 0) {
          photo = pexelsRes.images[0].srcOriginal
        }
      } catch (e) {
        console.error(`Error fetching Pexels for ${artist}:`, e)
      }

      try {
        const tracks = await searchTracks(artist)

        if (tracks.length === 0 && !token.value) {
          console.warn('Token invalid or expired during fetch')
          loading.value = false
          return
        }

        const track = tracks.find((t) => t.preview_url) || tracks[0]

        if (track) {
          console.log(`Found track for ${artist}: ${track.name} (Preview: ${!!track.preview_url})`)
          newStories.push({
            id: track.id,
            artist: track.artists[0].name,
            track: track.name,
            image: photo,
            previewUrl: track.preview_url,
            avatar: track.album.images[2]?.url || photo,
          })
        } else {
          console.log(`No tracks found for ${artist}`)
        }
      } catch (e) {
        console.error(`Error fetching Spotify for ${artist}:`, e)
      }
    }
  } catch (err) {
    console.error('Critical error loading stories:', err)
    loading.value = false
  }

  console.log(`Loaded ${newStories.length} stories`)
  stories.value = newStories

  newStories.forEach((story) => {
    const audio = new Audio()
    if (story.previewUrl) {
      audio.src = story.previewUrl
    } else {
      const ambientTracks = [
        'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
        'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-mountains-113886.mp3',
        'https://cdn.pixabay.com/download/audio/2022/02/07/audio_1808fbf07a.mp3?filename=jazz-happy-110946.mp3',
        'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-110254.mp3',
      ]
      story.ambientUrl = ambientTracks[Math.floor(Math.random() * ambientTracks.length)]
      audio.src = story.ambientUrl
    }
    audio.preload = 'auto'
    story.audioObject = audio
  })

  loading.value = false

  if (stories.value.length > 0) {
    playStory()
  } else {
    alert('Could not load stories. Please check console for errors.')
    router.push({ name: 'home' })
  }
}

const playStory = () => {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.currentTime = 0
  }

  const story = stories.value[currentStoryIndex.value]

  if (story.audioObject) {
    audioPlayer.value = story.audioObject
    audioPlayer.value.play().catch((e) => console.error('Audio play failed:', e))
  }

  isPaused.value = false
  startProgress()
}

let progressInterval
const startProgress = () => {
  clearInterval(progressInterval)
  progress.value = 0

  progressInterval = setInterval(() => {
    if (!isPaused.value) {
      progress.value += 1
      if (progress.value >= 100) {
        nextStory()
      }
    }
  }, 300)
}

const nextStory = () => {
  if (currentStoryIndex.value < stories.value.length - 1) {
    currentStoryIndex.value++
    playStory()
  } else {
    router.push({ name: 'home' })
  }
}

const prevStory = () => {
  if (currentStoryIndex.value > 0) {
    currentStoryIndex.value--
    playStory()
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    audioPlayer.value.pause()
  } else {
    audioPlayer.value.play()
  }
}

const isMuted = ref(false)
const likedStories = ref(new Set())

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (audioPlayer.value) {
    audioPlayer.value.muted = isMuted.value
  }
}

const toggleLike = () => {
  const storyId = stories.value[currentStoryIndex.value].id
  if (likedStories.value.has(storyId)) {
    likedStories.value.delete(storyId)
  } else {
    likedStories.value.add(storyId)
  }
}

const shareStory = async () => {
  const story = stories.value[currentStoryIndex.value]
  const text = `Check out this song: ${story.track} by ${story.artist} on InspirePixel!`

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'InspirePixel Music Story',
        text: text,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Link copied to clipboard!')
    }
  } catch (err) {
    console.error('Error sharing:', err)
  }
}

import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  clearInterval(progressInterval)
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value = null
  }
})
</script>

<template>
  <main class="stories-view">
    <div v-if="!token" class="login-container">
      <section class="login-card">
        <Icon icon="logos:spotify-icon" class="spotify-logo" />
        <h2>Connect to Spotify</h2>
        <p>To view music stories, we need to connect to your Spotify account.</p>
        <button @click="login" class="spotify-btn">Connect Spotify</button>
        <button @click="router.push({ name: 'home' })" class="cancel-btn">Go Back</button>
      </section>
    </div>
    <div v-else-if="loading" class="loading-state">
      <Icon icon="svg-spinners:bars-scale-middle" class="spinner" />
      <p>Curating stories...</p>
    </div>
    <article
      v-else
      class="story-container"
      :style="{ '--bg-image': `url(${stories[currentStoryIndex].image})` }"
    >
      <div class="progress-group">
        <div
          v-for="(story, index) in stories"
          :key="story.id"
          class="progress-item"
          :class="{ active: index === currentStoryIndex, completed: index < currentStoryIndex }"
          :style="index === currentStoryIndex ? { '--progress': progress + '%' } : {}"
        ></div>
      </div>
      <header class="story-header">
        <div class="user-info">
          <div class="avatar">
            <img :src="stories[currentStoryIndex].avatar" alt="Artist" />
          </div>
          <span class="username">{{ stories[currentStoryIndex].artist }}</span>
          <span class="time">Now Playing</span>
        </div>
        <button class="close-btn" @click="router.push({ name: 'home' })" aria-label="Close stories">
          <Icon icon="material-symbols:close" />
        </button>
      </header>
      <nav class="nav-controls">
        <button class="nav-btn left" @click="prevStory" aria-label="Previous story">
          <Icon icon="material-symbols:chevron-left" class="nav-arrow" />
        </button>
        <button
          class="nav-btn center"
          @click="togglePause"
          :aria-label="isPaused ? 'Play' : 'Pause'"
        >
          <Icon v-if="isPaused" icon="material-symbols:play-circle" class="play-icon" />
        </button>
        <button class="nav-btn right" @click="nextStory" aria-label="Next story">
          <Icon icon="material-symbols:chevron-right" class="nav-arrow" />
        </button>
      </nav>
      <footer class="story-footer">
        <div class="music-info">
          <button
            class="mute-btn"
            @click.stop="toggleMute"
            :aria-label="isMuted ? 'Unmute' : 'Mute'"
          >
            <Icon :icon="isMuted ? 'material-symbols:volume-off' : 'material-symbols:volume-up'" />
          </button>
          <div class="equalizer-container" v-if="!isMuted">
            <Icon icon="svg-spinners:bars-scale-middle" class="equalizer" v-if="!isPaused" />
            <Icon icon="material-symbols:pause" class="equalizer" v-else />
          </div>
          <div class="track-details">
            <h3>{{ stories[currentStoryIndex].track }}</h3>
            <p>
              {{ stories[currentStoryIndex].artist }}
              <span v-if="!stories[currentStoryIndex].previewUrl" class="ambient-badge"
                >• Ambient Mode</span
              >
            </p>
          </div>
        </div>
        <div class="actions">
          <button
            class="action-btn"
            @click.stop="toggleLike"
            :aria-label="likedStories.has(stories[currentStoryIndex].id) ? 'Unlike' : 'Like'"
          >
            <Icon
              :icon="
                likedStories.has(stories[currentStoryIndex].id)
                  ? 'material-symbols:favorite'
                  : 'material-symbols:favorite-outline'
              "
              :class="{ liked: likedStories.has(stories[currentStoryIndex].id) }"
            />
          </button>
          <button class="action-btn" @click.stop="shareStory" aria-label="Share story">
            <Icon icon="material-symbols:share-outline" />
          </button>
        </div>
      </footer>
    </article>
  </main>
</template>

<style scoped lang="scss">
.stories-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.story-container {
  width: 100%;
  height: 100%;
  max-width: 480px;
  position: relative;
  background-color: #1a1a1a;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  color: white;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent, rgba(0, 0, 0, 0.8));
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (min-width: 768px) {
    height: 90vh;
    border-radius: 16px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }
}

.progress-group {
  display: flex;
  gap: 4px;
  margin-bottom: 1rem;
  height: 3px;
}

.progress-item {
  flex: 1;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;

  &.completed {
    background: white;
  }

  &.active {
    background: linear-gradient(
      to right,
      white var(--progress, 0%),
      rgba(255, 255, 255, 0.3) var(--progress, 0%)
    );
  }
}

.story-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: auto;
  position: relative;
  z-index: 20;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #e74c3c;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .username {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .time {
    font-size: 0.8rem;
    opacity: 0.7;
  }
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    opacity: 0.8;
  }
}

.nav-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: grid;
  grid-template-columns: 30% 40% 30%;
  z-index: 2;
}

.nav-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  pointer-events: auto;
  outline: none;

  &.left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 1rem;
  }

  &.center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 1rem;
  }
}

.nav-arrow {
  font-size: 3rem;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.story-container:hover .nav-arrow {
  opacity: 0.7;
}

.nav-btn:hover .nav-arrow {
  opacity: 1;
  transform: scale(1.1);
}

.play-icon {
  font-size: 4rem;
  opacity: 0.8;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5));
}

.story-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 1rem;
  position: relative;
  z-index: 20;
}

.music-info {
  display: flex;
  align-items: center;
  gap: 1rem;

  .mute-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    margin-right: 0.5rem;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }

  .equalizer {
    font-size: 1.5rem;
    color: #1db954;
  }

  .track-details {
    h3 {
      font-size: 1.1rem;
      margin: 0;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    p {
      font-size: 0.9rem;
      opacity: 0.8;
      margin: 0;

      .ambient-badge {
        font-size: 0.7rem;
        background: rgba(29, 185, 84, 0.2);
        color: #1db954;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 5px;
        font-weight: bold;
      }
    }
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: auto;
  z-index: 10;

  .action-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.8rem;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }

    .liked {
      color: #e74c3c;
      animation: pulse 0.3s ease-in-out;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.login-card {
  background: #1a1a1a;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;

  .spotify-logo {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    color: white;
    margin-bottom: 1rem;
  }

  p {
    color: #888;
    margin-bottom: 2rem;
  }

  .spotify-btn {
    background: #1db954;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.2s;
    width: 100%;
    margin-bottom: 1rem;

    &:hover {
      transform: scale(1.05);
      background: #1ed760;
    }
  }

  .cancel-btn {
    background: transparent;
    border: 1px solid #333;
    color: #888;
    padding: 0.8rem;
    border-radius: 50px;
    cursor: pointer;
    width: 100%;

    &:hover {
      border-color: #555;
      color: white;
    }
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  gap: 1rem;

  .spinner {
    font-size: 3rem;
    color: #1db954;
  }
}
</style>
