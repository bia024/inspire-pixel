import { ref } from 'vue'
import { useRouter } from 'vue-router'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = 'http://127.0.0.1:5173/callback'
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const SCOPES = ['user-read-private', 'user-read-email']

export function useSpotify() {
    const token = ref(window.localStorage.getItem('spotify_access_token'))
    const router = useRouter()

    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const values = crypto.getRandomValues(new Uint8Array(length))
        return values.reduce((acc, x) => acc + possible[x % possible.length], "")
    }

    const sha256 = async (plain) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }

    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
    }

    const login = async () => {
        const codeVerifier = generateRandomString(64)
        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed)

        window.localStorage.setItem('spotify_code_verifier', codeVerifier)

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: SCOPES.join(' '),
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: REDIRECT_URI,
        })

        window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`
    }

    const handleCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const codeVerifier = window.localStorage.getItem('spotify_code_verifier')

        if (code && codeVerifier) {
            try {
                const body = new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    client_id: CLIENT_ID,
                    code_verifier: codeVerifier,
                })

                const response = await fetch(TOKEN_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body
                })

                if (!response.ok) {
                    throw new Error('Failed to exchange token')
                }

                const data = await response.json()

                window.localStorage.setItem('spotify_access_token', data.access_token)
                window.localStorage.setItem('spotify_refresh_token', data.refresh_token)
                window.localStorage.removeItem('spotify_code_verifier')

                token.value = data.access_token

                window.history.replaceState({}, document.title, '/stories')
                return true
            } catch (error) {
                console.error('Error exchanging token:', error)
                return false
            }
        }
        return false
    }

    const checkToken = async () => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        if (code) {
            const lastCode = window.localStorage.getItem('spotify_last_code')
            if (lastCode === code) {
                window.history.replaceState({}, document.title, '/stories')
                token.value = window.localStorage.getItem('spotify_access_token')
                return token.value
            }

            const success = await handleCallback()
            if (success) {
                window.localStorage.setItem('spotify_last_code', code)
            }
            return token.value
        }

        const storedToken = window.localStorage.getItem('spotify_access_token')
        if (storedToken) {
            token.value = storedToken
            return storedToken
        }

        return null
    }

    const searchTracks = async (query) => {
        if (!token.value) return []

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })

            if (response.status === 401) {
                console.warn('Spotify token expired')
                window.localStorage.removeItem('spotify_access_token')
                token.value = null
                return []
            }

            const data = await response.json()
            return data.tracks?.items || []
        } catch (error) {
            console.error('Error searching Spotify:', error)
            return []
        }
    }

    return {
        token,
        login,
        checkToken,
        searchTracks
    }
}