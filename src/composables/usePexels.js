import { ref } from 'vue'

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY
const PEXELS_API_URL = 'https://api.pexels.com/v1'
const PER_PAGE = 30

export function usePexels() {
    const images = ref([])
    const loading = ref(false)
    const error = ref(null)
    const hasMore = ref(true)
    const currentPage = ref(1)

    const headers = {
        Authorization: PEXELS_API_KEY
    }

    const fetchCuratedImages = async (page = 1) => {
        loading.value = true
        error.value = null

        try {
            const response = await fetch(
                `${PEXELS_API_URL}/curated?page=${page}&per_page=${PER_PAGE}`,
                { headers }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch images from Pexels')
            }

            const data = await response.json()

            const formattedImages = data.photos.map((photo, index) => ({
                id: photo.id,
                src: photo.src.large,
                srcOriginal: photo.src.original,
                srcMedium: photo.src.medium,
                title: photo.alt || `Photo ${photo.id}`,
                category: 'curated',
                photographer: photo.photographer,
                photographerUrl: photo.photographer_url,
                premium: index % 3 === 0,
                pexelsUrl: photo.url
            }))

            if (page === 1) {
                images.value = formattedImages
            } else {
                images.value = [...images.value, ...formattedImages]
            }

            hasMore.value = data.photos.length === PER_PAGE
            currentPage.value = page

            return { success: true, images: formattedImages }
        } catch (err) {
            error.value = err.message
            return { success: false, message: err.message }
        } finally {
            loading.value = false
        }
    }

    const searchImages = async (query, page = 1) => {
        if (!query || query.trim() === '') {
            return fetchCuratedImages(page)
        }

        loading.value = true
        error.value = null

        try {
            const response = await fetch(
                `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${PER_PAGE}`,
                { headers }
            )

            if (!response.ok) {
                throw new Error('Failed to search images from Pexels')
            }

            const data = await response.json()

            const formattedImages = data.photos.map((photo, index) => ({
                id: photo.id,
                src: photo.src.large,
                srcOriginal: photo.src.original,
                srcMedium: photo.src.medium,
                title: photo.alt || `${query} photo ${photo.id}`,
                category: query.toLowerCase(),
                photographer: photo.photographer,
                photographerUrl: photo.photographer_url,
                premium: index % 3 === 0,
                pexelsUrl: photo.url
            }))

            if (page === 1) {
                images.value = formattedImages
            } else {
                images.value = [...images.value, ...formattedImages]
            }

            hasMore.value = data.photos.length === PER_PAGE
            currentPage.value = page

            return { success: true, images: formattedImages }
        } catch (err) {
            error.value = err.message
            return { success: false, message: err.message }
        } finally {
            loading.value = false
        }
    }

    const loadMore = async (category = 'all') => {
        const nextPage = currentPage.value + 1

        if (category === 'all') {
            return await fetchCuratedImages(nextPage)
        } else {
            return await searchImages(category, nextPage)
        }
    }

    return {
        images,
        loading,
        error,
        hasMore,
        currentPage,
        fetchCuratedImages,
        searchImages,
        loadMore
    }
}