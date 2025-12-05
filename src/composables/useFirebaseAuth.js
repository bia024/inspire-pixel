import { ref, computed, onMounted } from 'vue'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile
} from 'firebase/auth'
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const user = ref(null)
const userMode = ref('free')
const favorites = ref([])
const loading = ref(true)

export function useFirebaseAuth() {
    const isPro = computed(() => userMode.value === 'pro')
    const isAuthenticated = computed(() => !!user.value)

    onMounted(() => {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    user.value = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: userData.name || firebaseUser.displayName,
                        mode: userData.mode || 'free',
                        emailVerified: firebaseUser.emailVerified
                    }
                    userMode.value = userData.mode || 'free'
                    favorites.value = userData.favorites || []
                }
            } else {
                user.value = null
                userMode.value = 'free'
                favorites.value = []
            }
            loading.value = false
        })
    })

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)

            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))

            if (userDoc.exists()) {
                const userData = userDoc.data()
                userMode.value = userData.mode || 'free'
                favorites.value = userData.favorites || []
            }

            return { success: true, message: 'Login successful!' }
        } catch (error) {
            console.error('Login error:', error)

            let message = 'Login failed. Please try again.'
            if (error.code === 'auth/user-not-found') {
                message = 'User not found. Please register first.'
            } else if (error.code === 'auth/wrong-password') {
                message = 'Incorrect password.'
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.'
            } else if (error.code === 'auth/too-many-requests') {
                message = 'Too many attempts. Please try again later.'
            }

            return { success: false, message }
        }
    }

    const register = async (userData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            )

            await updateProfile(userCredential.user, {
                displayName: userData.name
            })
            await sendEmailVerification(userCredential.user)

            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: userData.name,
                email: userData.email,
                mode: 'free',
                favorites: [],
                createdAt: serverTimestamp()
            })

            userMode.value = 'free'
            favorites.value = []

            return {
                success: true,
                message: 'Account created! Please check your email to verify your account.'
            }
        } catch (error) {
            console.error('Registration error:', error)

            let message = 'Registration failed. Please try again.'
            if (error.code === 'auth/email-already-in-use') {
                message = 'Email already registered.'
            } else if (error.code === 'auth/weak-password') {
                message = 'Password is too weak. Use at least 6 characters.'
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.'
            }

            return { success: false, message }
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            user.value = null
            userMode.value = 'free'
            favorites.value = []
            return { success: true, message: 'Logged out successfully!' }
        } catch (error) {
            console.error('Logout error:', error)
            return { success: false, message: 'Logout failed.' }
        }
    }

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email)
            return {
                success: true,
                message: 'Password reset email sent! Check your inbox.'
            }
        } catch (error) {
            console.error('Password reset error:', error)

            let message = 'Failed to send reset email.'
            if (error.code === 'auth/user-not-found') {
                message = 'No account found with this email.'
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.'
            }

            return { success: false, message }
        }
    }

    const upgradeToPro = async () => {
        if (!user.value) {
            return { success: false, message: 'You must be logged in to upgrade.' }
        }

        try {
            await updateDoc(doc(db, 'users', user.value.uid), {
                mode: 'pro',
                upgradedAt: serverTimestamp()
            })

            userMode.value = 'pro'
            if (user.value) user.value.mode = 'pro'

            return { success: true, message: 'Upgraded to Pro!' }
        } catch (error) {
            console.error('Upgrade error:', error)
            return { success: false, message: 'Upgrade failed. Please try again.' }
        }
    }

    const updateUserData = async (updates) => {
        if (!user.value) return { success: false, message: 'Not authenticated.' }

        try {
            await updateDoc(doc(db, 'users', user.value.uid), updates)

            user.value = { ...user.value, ...updates }

            return { success: true, message: 'Profile updated!' }
        } catch (error) {
            console.error('Update error:', error)
            return { success: false, message: 'Update failed.' }
        }
    }

    const toggleFavorite = async (imageId) => {
        if (!user.value) return { success: false, message: 'Please login to favorite images.' }

        try {
            const index = favorites.value.indexOf(imageId)
            let newFavorites = [...favorites.value]

            if (index > -1) {
                newFavorites.splice(index, 1)
            } else {
                newFavorites.push(imageId)
            }

            await updateDoc(doc(db, 'users', user.value.uid), {
                favorites: newFavorites
            })
            favorites.value = newFavorites
            return { success: true }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            return { success: false, message: 'Failed to update favorites.' }
        }
    }

    return {
        user,
        userMode,
        favorites,
        isPro,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        resetPassword,
        upgradeToPro,
        updateUserData,
        toggleFavorite
    }
}
