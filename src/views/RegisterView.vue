<!-- src/views/auth/RegisterView.vue -->
<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
      <!-- Header -->
      <div>
        <h2 class="text-center text-3xl font-bold text-white">Create an account</h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          Or
          <router-link to="/auth/login" class="font-medium text-blue-500 hover:text-blue-400">
            sign in to your account
          </router-link>
        </p>
      </div>

      <!-- Alert for errors -->
      <div v-if="error" class="bg-red-900/50 text-red-200 p-4 rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Registration Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="name" class="sr-only">Full name</label>
            <input
                id="name"
                v-model="formData.nom"
                type="text"
                required
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name"
            />
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
                id="password"
                v-model="formData.motDePasse"
                type="password"
                required
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/config/axios'

const router = useRouter()

const formData = ref({
  nom: '',
  email: '',
  motDePasse: '',
  RoleId: 2 // Default to regular user
})
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  loading.value = true
  error.value = ''

  try {
    await api.post('/api/auth/register', formData.value)
    router.push('/auth/login')
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.response?.data?.message || 'Failed to create account'
  } finally {
    loading.value = false
  }
}
</script>