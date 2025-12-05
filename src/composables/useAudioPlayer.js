import { ref, computed } from 'vue'

const currentTrack = ref(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const progress = ref(0)
const audio = new Audio()
const playlist = ref([])
const currentIndex = ref(0)

export function useAudioPlayer() {

    const initAudio = () => {
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                progress.value = (audio.currentTime / audio.duration) * 100
            }
        })

        audio.addEventListener('ended', () => {
            next()
        })

        audio.muted = isMuted.value
    }

    const setPlaylist = (tracks, startIndex = 0) => {
        playlist.value = tracks
        currentIndex.value = startIndex
        loadTrack(startIndex)
    }

    const loadTrack = (index) => {
        if (index >= 0 && index < playlist.value.length) {
            const track = playlist.value[index]
            currentTrack.value = track

            const src = track.previewUrl || track.ambientUrl

            if (src && audio.src !== src) {
                audio.src = src
                audio.load()
            }
        }
    }

    const play = async () => {
        try {
            if (!audio.src && currentTrack.value) {
                loadTrack(currentIndex.value)
            }
            await audio.play()
            isPlaying.value = true
        } catch (e) {
            console.error('Playback failed:', e)
            isPlaying.value = false
        }
    }

    const pause = () => {
        audio.pause()
        isPlaying.value = false
    }

    const togglePlay = () => {
        if (isPlaying.value) {
            pause()
        } else {
            play()
        }
    }

    const next = () => {
        if (currentIndex.value < playlist.value.length - 1) {
            currentIndex.value++
            loadTrack(currentIndex.value)
            play()
        } else {
            pause()
            progress.value = 100
        }
    }

    const prev = () => {
        if (audio.currentTime > 3) {
            audio.currentTime = 0
        } else if (currentIndex.value > 0) {
            currentIndex.value--
            loadTrack(currentIndex.value)
            play()
        }
    }

    const toggleMute = () => {
        isMuted.value = !isMuted.value
        audio.muted = isMuted.value
    }

    if (!audio.onended) {
        initAudio()
    }

    return {
        currentTrack,
        isPlaying,
        isMuted,
        progress,
        playlist,
        currentIndex,
        setPlaylist,
        play,
        pause,
        togglePlay,
        next,
        prev,
        toggleMute
    }
}
