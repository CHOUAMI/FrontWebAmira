import { defineStore } from 'pinia'
import api from '@/config/axios'
export const useProjectStore = defineStore('project', {
    state: () => ({
        projects: [],
        categories: [],
        logos: [],
        games: [],
        websites: [],
        loading: false,
        error: null
    }),

    getters: {
        getProjectById: (state) => (id) => state.projects.find(p => p.id === id),
        getCategoryById: (state) => (id) => state.categories.find(c => c.id === id)
    },

    actions: {
        // Projects
        async fetchProjects() {
            this.loading = true
            try {
                const response = await api.get('/api/projets')
                this.projects = response.data
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async createProject(data) {
            try {
                const response = await api.post('/api/projets', data)
                this.projects.push(response.data)
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },
        async updateProject(id, data) {
            try {
                const response = await api.put(`/api/projets/${id}`, data)
                const index = this.projects.findIndex(p => p.id === id)
                if (index !== -1) {
                    this.projects[index] = response.data
                }
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async deleteProject(id) {
            try {
                await api.delete(`/api/projets/${id}`)
                this.projects = this.projects.filter(p => p.id !== id)
            } catch (error) {
                this.error = error.message
                throw error
            }
        },


        // Categories
        async fetchCategories() {
            try {
                const response = await api.get('/api/category')
                this.categories = response.data
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async createCategory(data) {
            try {
                const response = await api.post('/api/category', data)
                this.categories.push(response.data)
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },
        async updateCategory(id, data) {
            try {
                const response = await api.put(`/api/category/${id}`, data)
                const index = this.categories.findIndex(c => c.id === id)
                if (index !== -1) {
                    this.categories[index] = response.data
                }
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async deleteCategory(id) {
            try {
                await api.delete(`/api/category/${id}`)
                this.categories = this.categories.filter(c => c.id !== id)
            } catch (error) {
                this.error = error.message
                throw error
            }
        },


        // Games
        async fetchGames() {
            try {
                const response = await api.get('/api/jeux')
                this.games = response.data
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async createGame(data) {
            try {
                const response = await api.post('/api/jeux', data)
                this.games.push(response.data)
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },
        async updateGame(id, data) {
            try {
                const response = await api.put(`/api/jeux/${id}`, data)
                const index = this.games.findIndex(g => g.id === id)
                if (index !== -1) {
                    this.games[index] = response.data
                }
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async deleteGame(id) {
            try {
                await api.delete(`/api/jeux/${id}`)
                this.games = this.games.filter(g => g.id !== id)
            } catch (error) {
                this.error = error.message
                throw error
            }
        },


        // Websites
        async fetchWebsites() {
            try {
                const response = await api.get('/api/siteweb')
                this.websites = response.data
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async createWebsite(data) {
            try {
                const response = await api.post('/api/siteweb', data)
                this.websites.push(response.data)
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },
        async updateWebsite(id, data) {
            try {
                const response = await api.put(`/api/siteweb/${id}`, data)
                const index = this.websites.findIndex(w => w.id === id)
                if (index !== -1) {
                    this.websites[index] = response.data
                }
                return response.data
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async deleteWebsite(id) {
            try {
                await api.delete(`/api/siteweb/${id}`)
                this.websites = this.websites.filter(w => w.id !== id)
            } catch (error) {
                this.error = error.message
                throw error
            }
        }
    }
})