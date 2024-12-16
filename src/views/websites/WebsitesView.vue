<!-- src/views/websites/WebsitesView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-white">Websites</h2>
      <button
          @click="showModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add Website
      </button>
    </div>

    <!-- Websites List -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div
          v-for="site in websites"
          :key="site.id"
          class="bg-gray-800 rounded-lg overflow-hidden"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-white">{{ site.Titre }}</h3>
              <p class="mt-2 text-sm text-gray-400">{{ site.description }}</p>
              <p class="mt-2 text-sm text-gray-500">
                Project: {{ getProjectName(site.ProjetId) }}
              </p>
            </div>
          </div>
          <div class="mt-4 flex justify-end space-x-3">
            <button
                @click="editWebsite(site)"
                class="text-blue-500 hover:text-blue-400"
            >
              Edit
            </button>
            <button
                @click="deleteWebsite(site.id)"
                class="text-red-500 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold text-white mb-4">
          {{ editingWebsite ? 'Edit Website' : 'New Website' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input
                v-model="formData.Titre"
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
                v-model="formData.ProjetId"
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
                @click="closeModal"
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

const projectStore = useProjectStore()

const websites = computed(() => projectStore.websites)
const projects = computed(() => projectStore.projects)

const showModal = ref(false)
const loading = ref(false)
const editingWebsite = ref(null)

const formData = ref({
  Titre: '',
  description: '',
  ProjetId: ''
})

function getProjectName(projectId) {
  const project = projects.value.find(p => p.id === projectId)
  return project ? project.titre : 'Unknown Project'
}

function resetForm() {
  formData.value = {
    Titre: '',
    description: '',
    ProjetId: ''
  }
  editingWebsite.value = null
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function editWebsite(website) {
  editingWebsite.value = website
  formData.value = {
    Titre: website.Titre,
    description: website.description,
    ProjetId: website.ProjetId
  }
  showModal.value = true
}

async function deleteWebsite(id) {
  if (!confirm('Are you sure you want to delete this website?')) return

  try {
    await projectStore.deleteWebsite(id)
  } catch (error) {
    console.error('Error deleting website:', error)
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (editingWebsite.value) {
      await projectStore.updateWebsite(editingWebsite.value.id, formData.value)
    } else {
      await projectStore.createWebsite(formData.value)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving website:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!websites.value.length) {
    await projectStore.fetchWebsites()
  }
  if (!projects.value.length) {
    await projectStore.fetchProjects()
  }
})
</script>