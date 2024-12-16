// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '@/config/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.RoleId === 1
    },

    actions: {
        initializeAuth() {
            const token = localStorage.getItem('token')
            const user = localStorage.getItem('user')

            if (token && user) {
                this.token = token
                this.user = JSON.parse(user)
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }
        },

        async login(email, password) {
            this.loading = true
            try {
                const response = await api.post('/api/auth/login', {
                    email,
                    motDePasse: password
                })

                this.token = response.data.token
                this.user = response.data.user

                localStorage.setItem('token', this.token)
                localStorage.setItem('user', JSON.stringify(this.user))

                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed'
                throw error
            } finally {
                this.loading = false
            }
        },

        async register(userData) {
            this.loading = true
            try {
                const response = await axios.post('/api/auth/register', userData)
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Registration failed'
                throw error
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            delete api.defaults.headers.common['Authorization']
        }
    }
})