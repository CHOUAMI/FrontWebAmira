<!-- src/views/games/GamesView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-white">Games</h2>
      <button
          @click="showModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add Game
      </button>
    </div>

    <!-- Games List -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
      <div class="divide-y divide-gray-700">
        <div
            v-for="game in games"
            :key="game.id"
            class="p-6 hover:bg-gray-700/50 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center">
                <h3 class="text-lg font-medium text-white">{{ game.titre }}</h3>
                <span class="ml-3 text-sm text-gray-400">
                  Project: {{ getProjectName(game.projetId) }}
                </span>
              </div>
              <p class="mt-2 text-gray-400">{{ game.description }}</p>
            </div>
            <div class="flex space-x-4 ml-4">
              <button
                  @click="editGame(game)"
                  class="text-blue-500 hover:text-blue-400"
              >
                Edit
              </button>
              <button
                  @click="confirmDelete(game)"
                  class="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold text-white mb-4">
          {{ editingGame ? 'Edit Game' : 'New Game' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input
                v-model="formData.titre"
                type="text"
                required
                class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
                v-model="formData.description"
                rows="3"
                class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Project</label>
            <select
                v-model="formData.projetId"
                required
                class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            >
              <option value="">Select a project</option>
              <option
                  v-for="project in projects"
                  :key="project.id"
                  :value="project.id"
              >
                {{ project.titre }}
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
                type="button"
                @click="showModal = false"
                class="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/poject.js'
// import { useNotification } from '@/composables/useNotification'

const projectStore = useProjectStore()
// const { notify } = useNotification()

const showModal = ref(false)
const loading = ref(false)
const editingGame = ref(null)

const formData = ref({
  titre: '',
  description: '',
  projetId: ''
})

const games = computed(() => projectStore.games)
const projects = computed(() => projectStore.projects)

function getProjectName(projectId) {
  const project = projects.value.find(p => p.id === projectId)
  return project ? project.titre : 'Unknown Project'
}

function resetForm() {
  formData.value = {
    titre: '',
    description: '',
    projetId: ''
  }
  editingGame.value = null
}

function editGame(game) {
  editingGame.value = game
  formData.value = {
    titre: game.titre,
    description: game.description,
    projetId: game.projetId
  }
  showModal.value = true
}

async function confirmDelete(game) {
  if (confirm('Are you sure you want to delete this game?')) {
    try {
      await projectStore.deleteGame(game.id)
      // notify('Game deleted successfully')
    } catch (error) {
      // notify('Failed to delete game', 'error')
    }
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (editingGame.value) {
      await projectStore.updateGame(editingGame.value.id, formData.value)
      // notify('Game updated successfully')
    } else {
      await projectStore.createGame(formData.value)
      // notify('Game created successfully')
    }
    showModal.value = false
    resetForm()
  } catch (error) {
    // notify('Failed to save game', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!games.value.length) {
    await projectStore.fetchGames()
  }
  if (!projects.value.length) {
    await projectStore.fetchProjects()
  }
})
</script>