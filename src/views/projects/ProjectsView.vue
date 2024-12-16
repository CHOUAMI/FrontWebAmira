<!-- src/views/projects/ProjectsView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-white">Projects</h2>
      <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Project
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-gray-800 p-4 rounded-lg space-y-4">
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="flex-1">
          <input
              v-model="filters.search"
              type="text"
              placeholder="Search projects..."
              class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <!-- Category Filter -->
        <select
            v-model="filters.category"
            class="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.nom }}
          </option>
        </select>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
      >
        <!-- Project Card -->
        <div class="p-6">
          <h3 class="text-lg font-semibold text-white mb-2">{{ project.titre }}</h3>
          <p class="text-gray-400 text-sm mb-4">{{ project.description }}</p>

          <!-- Project Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div class="text-gray-400">
              Games: {{ project.games?.length || 0 }}
            </div>
            <div class="text-gray-400">
              Websites: {{ project.websites?.length || 0 }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-2">
            <button
                @click="editProject(project)"
                class="px-3 py-1 text-sm text-blue-500 hover:text-blue-400"
            >
              Edit
            </button>
            <button
                @click="deleteProject(project.id)"
                class="px-3 py-1 text-sm text-red-500 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold text-white mb-4">
          {{ editingProject ? 'Edit Project' : 'Create New Project' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input
                v-model="formData.titre"
                type="text"
                required
                class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
                v-model="formData.description"
                rows="3"
                class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <select
                v-model="formData.categoryId"
                required
                class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.nom }}
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-3">
            <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
import { useAuthStore } from '@/stores/auth'

const projectStore = useProjectStore()
const authStore = useAuthStore()

const showCreateModal = ref(false)
const loading = ref(false)
const editingProject = ref(null)
const categories = ref([])

const filters = ref({
  search: '',
  category: ''
})

const formData = ref({
  titre: '',
  description: '',
  categoryId: ''
})

const filteredProjects = computed(() => {
  let result = projectStore.projects

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(project =>
        project.titre.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search)
    )
  }

  if (filters.value.category) {
    result = result.filter(project =>
        project.categoryId === parseInt(filters.value.category)
    )
  }

  return result
})

function resetForm() {
  formData.value = {
    titre: '',
    description: '',
    categoryId: ''
  }
  editingProject.value = null
}

function editProject(project) {
  editingProject.value = project
  formData.value = {
    titre: project.titre,
    description: project.description,
    categoryId: project.categoryId
  }
  showCreateModal.value = true
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return

  try {
    await projectStore.deleteProject(id)
  } catch (error) {
    console.error('Error deleting project:', error)
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (editingProject.value) {
      await projectStore.updateProject(editingProject.value.id, formData.value)
    } else {
      await projectStore.createProject({
        ...formData.value,
        userId: authStore.user.id
      })
    }
    showCreateModal.value = false
    resetForm()
  } catch (error) {
    console.error('Error saving project:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      projectStore.fetchProjects(),
      projectStore.fetchCategories()
    ])
    categories.value = projectStore.categories
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>