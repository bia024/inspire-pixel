import { ref } from 'vue'

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY
const PEXELS_API_URL = 'https://api.pexels.com/v1'
const PER_PAGE = 30

const cache = new Map()

export function usePexels() {
  const images = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(true)
  const currentPage = ref(1)
  const lastQuery = ref('')

  const headers = {
    Authorization: PEXELS_API_KEY
  }

  const formatPhotos = (data, query) => {
    return data.photos.map((photo, index) => ({
      id: photo.id,
      src: photo.src.large,
      srcOriginal: photo.src.original,
      srcMedium: photo.src.medium,
      title: photo.alt || (query ? `${query} photo ${photo.id}` : `Photo ${photo.id}`),
      category: query ? query.toLowerCase() : 'curated',
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      premium: index % 3 === 0,
      pexelsUrl: photo.url
    }))
  }

  const fetchImages = async (endpoint, page = 1, query = '') => {
    const cacheKey = `${endpoint}-${query}-${page}`
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)
      if (page === 1) images.value = cached
      else images.value = [...images.value, ...cached]
      hasMore.value = cached.length === PER_PAGE
      currentPage.value = page
      return { success: true, images: cached }
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${PEXELS_API_URL}/${endpoint}?${query ? `query=${encodeURIComponent(query)}&` : ''}page=${page}&per_page=${PER_PAGE}`, { headers })
      if (!response.ok) throw new Error('Failed to fetch images from Pexels')

      const data = await response.json()
      const formatted = formatPhotos(data, query)
      cache.set(cacheKey, formatted)

      if (page === 1) images.value = formatted
      else images.value = [...images.value, ...formatted]

      hasMore.value = data.photos.length === PER_PAGE
      currentPage.value = page

      return { success: true, images: formatted }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  const fetchCuratedImages = (page = 1) => {
    lastQuery.value = ''
    return fetchImages('curated', page)
  }

  const searchImages = (query, page = 1) => {
    lastQuery.value = query
    if (!query || query.trim() === '') return fetchCuratedImages(page)
    return fetchImages('search', page, query)
  }

  const loadMore = () => {
    const nextPage = currentPage.value + 1
    return lastQuery.value ? searchImages(lastQuery.value, nextPage) : fetchCuratedImages(nextPage)
  }

  const downloadImage = async (url, filename = 'image.jpg') => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(link.href)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
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
    loadMore,
    downloadImage
  }
}



// import { ref } from 'vue'

// const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY
// const PEXELS_API_URL = 'https://api.pexels.com/v1'
// const PER_PAGE = 30

// export function usePexels() {
//     const images = ref([])
//     const loading = ref(false)
//     const error = ref(null)
//     const hasMore = ref(true)
//     const currentPage = ref(1)

//     const headers = {
//         Authorization: PEXELS_API_KEY
//     }

//     const fetchCuratedImages = async (page = 1) => {
//         loading.value = true
//         error.value = null

//         try {
//             const response = await fetch(
//                 `${PEXELS_API_URL}/curated?page=${page}&per_page=${PER_PAGE}`,
//                 { headers }
//             )

//             if (!response.ok) {
//                 throw new Error('Failed to fetch images from Pexels')
//             }

//             const data = await response.json()

//             const formattedImages = data.photos.map((photo, index) => ({
//                 id: photo.id,
//                 src: photo.src.large,
//                 srcOriginal: photo.src.original,
//                 srcMedium: photo.src.medium,
//                 title: photo.alt || `Photo ${photo.id}`,
//                 category: 'curated',
//                 photographer: photo.photographer,
//                 photographerUrl: photo.photographer_url,
//                 premium: index % 3 === 0,
//                 pexelsUrl: photo.url
//             }))

//             if (page === 1) {
//                 images.value = formattedImages
//             } else {
//                 images.value = [...images.value, ...formattedImages]
//             }

//             hasMore.value = data.photos.length === PER_PAGE
//             currentPage.value = page

//             return { success: true, images: formattedImages }
//         } catch (err) {
//             error.value = err.message
//             return { success: false, message: err.message }
//         } finally {
//             loading.value = false
//         }
//     }

//     const searchImages = async (query, page = 1) => {
//         if (!query || query.trim() === '') {
//             return fetchCuratedImages(page)
//         }

//         loading.value = true
//         error.value = null

//         try {
//             const response = await fetch(
//                 `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${PER_PAGE}`,
//                 { headers }
//             )

//             if (!response.ok) {
//                 throw new Error('Failed to search images from Pexels')
//             }

//             const data = await response.json()

//             const formattedImages = data.photos.map((photo, index) => ({
//                 id: photo.id,
//                 src: photo.src.large,
//                 srcOriginal: photo.src.original,
//                 srcMedium: photo.src.medium,
//                 title: photo.alt || `${query} photo ${photo.id}`,
//                 category: query.toLowerCase(),
//                 photographer: photo.photographer,
//                 photographerUrl: photo.photographer_url,
//                 premium: index % 3 === 0,
//                 pexelsUrl: photo.url
//             }))

//             if (page === 1) {
//                 images.value = formattedImages
//             } else {
//                 images.value = [...images.value, ...formattedImages]
//             }

//             hasMore.value = data.photos.length === PER_PAGE
//             currentPage.value = page

//             return { success: true, images: formattedImages }
//         } catch (err) {
//             error.value = err.message
//             return { success: false, message: err.message }
//         } finally {
//             loading.value = false
//         }
//     }

//     const loadMore = async (category = 'all') => {
//         const nextPage = currentPage.value + 1

//         if (category === 'all') {
//             return await fetchCuratedImages(nextPage)
//         } else {
//             return await searchImages(category, nextPage)
//         }
//     }

//     return {
//         images,
//         loading,
//         error,
//         hasMore,
//         currentPage,
//         fetchCuratedImages,
//         searchImages,
//         loadMore
//     }
// }