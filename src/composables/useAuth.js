import { ref, computed } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const userMode = ref(localStorage.getItem('userMode') || 'free')

// Store registered users in localStorage
const getRegisteredUsers = () => {
    try {
        const users = localStorage.getItem('registeredUsers')
        return users ? JSON.parse(users) : []
    } catch (error) {
        console.error('Error loading registered users:', error)
        return []
    }
}

const saveRegisteredUsers = (users) => {
    try {
        localStorage.setItem('registeredUsers', JSON.stringify(users))
    } catch (error) {
        console.error('Error saving registered users:', error)
    }
}

export function useAuth() {
    const isPro = computed(() => userMode.value === 'pro')
    const isAuthenticated = computed(() => !!user.value)

    const login = (email, password) => {
        const registeredUsers = getRegisteredUsers()

        // Find user by email
        const foundUser = registeredUsers.find(u => u.email === email)

        if (!foundUser) {
            return { success: false, message: 'User not found. Please register first.' }
        }

        // Check password
        if (foundUser.password !== password) {
            return { success: false, message: 'Incorrect password.' }
        }

        // Login successful
        user.value = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            mode: foundUser.mode || 'free'
        }

        localStorage.setItem('user', JSON.stringify(user.value))
        userMode.value = user.value.mode
        localStorage.setItem('userMode', userMode.value)

        return { success: true, message: 'Login successful!' }
    }

    const register = (userData) => {
        const registeredUsers = getRegisteredUsers()

        // Check if email already exists
        const existingUser = registeredUsers.find(u => u.email === userData.email)
        if (existingUser) {
            return { success: false, message: 'Email already registered.' }
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            mode: 'free',
            createdAt: new Date().toISOString()
        }

        // Save to registered users
        registeredUsers.push(newUser)
        saveRegisteredUsers(registeredUsers)

        // Auto-login after registration
        user.value = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            mode: newUser.mode
        }

        localStorage.setItem('user', JSON.stringify(user.value))
        userMode.value = 'free'
        localStorage.setItem('userMode', 'free')

        return { success: true, message: 'Account created successfully!' }
    }

    const logout = () => {
        user.value = null
        userMode.value = 'free'
        localStorage.removeItem('user')
        localStorage.setItem('userMode', 'free')
    }

    const upgradeToPro = () => {
        if (!user.value) {
            return { success: false, message: 'You must be logged in to upgrade.' }
        }

        userMode.value = 'pro'
        localStorage.setItem('userMode', 'pro')

        if (user.value) {
            user.value.mode = 'pro'
            localStorage.setItem('user', JSON.stringify(user.value))

            // Update in registered users database
            const registeredUsers = getRegisteredUsers()
            const userIndex = registeredUsers.findIndex(u => u.id === user.value.id)
            if (userIndex !== -1) {
                registeredUsers[userIndex].mode = 'pro'
                saveRegisteredUsers(registeredUsers)
            }
        }

        return { success: true, message: 'Upgraded to Pro!' }
    }

    return {
        user,
        userMode,
        isPro,
        isAuthenticated,
        login,
        register,
        logout,
        upgradeToPro
    }
}
