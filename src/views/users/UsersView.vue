<!-- src/views/users/UsersView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-white">Users Management</h2>
    </div>

    <!-- Users Table -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-700">
        <thead class="bg-gray-700">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody class="bg-gray-800 divide-y divide-gray-700">
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-700">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-white">{{ user.nom }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-300">{{ user.email }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="text-sm text-gray-300">{{ getRoleName(user.RoleId) }}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
            <button @click="deleteUser(user.id)" class="text-red-400 hover:text-red-300">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from "@/config/axios.js";
const users = ref([])
const roles = ref([])

const fetchUsers = async () => {
  try {
    const response = await api.get('/api/users')
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const fetchRoles = async () => {
  try {
    const response = await api.get('/api/roles')
    roles.value = response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const getRoleName = (roleId) => {
  const role = roles.value.find(r => r.id === roleId)
  return role ? role.nom : 'Unknown'
}

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    await api.delete(`/api/users/${userId}`)
    await fetchUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>