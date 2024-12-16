<!-- src/views/roles/RolesView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-white">Roles Management</h2>
      <button
          @click="showModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add Role
      </button>
    </div>

    <!-- Roles List -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div
          v-for="role in roles"
          :key="role.id"
          class="bg-gray-800 rounded-lg p-6"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium text-white">{{ role.nom }}</h3>
            <p class="mt-2 text-sm text-gray-400">
              {{ getUsersCount(role.id) }} users with this role
            </p>
          </div>
          <button
              @click="deleteRole(role.id)"
              class="text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Create Role Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold text-white mb-4">Create New Role</h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Role Name</label>
            <input
                v-model="formData.nom"
                type="text"
                required
                class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                placeholder="Enter role name"
            />
          </div>

          <div class="flex justify-end space-x-3">
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
              {{ loading ? 'Creating...' : 'Create Role' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from "@/config/axios.js";
const roles = ref([])
const users = ref([])
const showModal = ref(false)
const loading = ref(false)
const formData = ref({
  nom: ''
})

const fetchRoles = async () => {
  try {
    const response = await api.get('/api/roles')
    roles.value = response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const fetchUsers = async () => {
  try {
    const response = await api.get('/api/users')
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const getUsersCount = (roleId) => {
  return users.value.filter(user => user.RoleId === roleId).length
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await api.post('/api/roles', formData.value)
    await fetchRoles()
    showModal.value = false
    formData.value.nom = ''
  } catch (error) {
    console.error('Error creating role:', error)
  } finally {
    loading.value = false
  }
}

const deleteRole = async (roleId) => {
  if (getUsersCount(roleId) > 0) {
    alert('Cannot delete role with active users')
    return
  }

  if (!confirm('Are you sure you want to delete this role?')) return

  try {
    await api.delete(`/api/roles/${roleId}`)
    await fetchRoles()
  } catch (error) {
    console.error('Error deleting role:', error)
  }
}

onMounted(() => {
  fetchRoles()
  fetchUsers()
})
</script>