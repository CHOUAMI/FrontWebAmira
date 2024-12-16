<!-- src/views/categories/CategoriesView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-white">Categories</h2>
      <button
          @click="showModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add Category
      </button>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
          v-for="category in categories"
          :key="category.id"
          class="bg-gray-800 rounded-lg p-6"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold text-white">{{ category.nom }}</h3>
            <p class="text-gray-400 mt-2">{{ category.description }}</p>
            <div class="mt-4 text-sm text-gray-400">
              {{ projectsInCategory(category.id).length }} projects
            </div>
          </div>
          <div class="flex space-x-2">
            <button
                @click="editCategory(category)"
                class="text-blue-500 hover:text-blue-400"
            >
              Edit
            </button>
            <button
                @click="confirmDelete(category)"
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
          {{ editingCategory ? 'Edit Category' : 'New Category' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input
                v-model="formData.nom"
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

const projectStore = useProjectStore()
// const { notify } = useNotification()

const showModal = ref(false)
const loading = ref(false)
const editingCategory = ref(null)

const formData = ref({
  nom: '',
  description: ''
})

const categories = computed(() => projectStore.categories)

const projectsInCategory = (categoryId) => {
  return projectStore.projects.filter(p => p.categoryId === categoryId)
}

function resetForm() {
  formData.value = {
    nom: '',
    description: ''
  }
  editingCategory.value = null
}

function editCategory(category) {
  editingCategory.value = category
  formData.value = {
    nom: category.nom,
    description: category.description
  }
  showModal.value = true
}

async function confirmDelete(category) {
  const hasProjects = projectsInCategory(category.id).length > 0
  if (hasProjects) {
    // notify('Cannot delete category with existing projects', 'error')
    return
  }

  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await projectStore.deleteCategory(category.id)
      // notify('Category deleted successfully')
    } catch (error) {
      notify('Failed to delete category', 'error')
    }
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (editingCategory.value) {
      await projectStore.updateCategory(editingCategory.value.id, formData.value)
      // notify('Category updated successfully')
    } else {
      await projectStore.createCategory(formData.value)
      // notify('Category created successfully')
    }
    showModal.value = false
    resetForm()
  } catch (error) {
    // notify('Failed to save category', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!categories.value.length) {
    await projectStore.fetchCategories()
  }
})
</script>