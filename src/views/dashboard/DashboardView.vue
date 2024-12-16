<!-- src/views/dashboard/DashboardView.vue -->
<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gray-800 rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-white mb-2">Welcome back, {{ user?.nom }}</h2>
      <p class="text-gray-400">Here's what's happening with your projects.</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="(stat, index) in stats"
           :key="index"
           class="bg-gray-800 p-4 rounded-lg">
        <div class="text-gray-400 text-sm">{{ stat.label }}</div>
        <div class="text-2xl font-bold text-white mt-1">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Projects -->
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-white">Recent Projects</h3>
          <router-link
              to="/projects"
              class="text-sm text-blue-500 hover:text-blue-400">
            View all
          </router-link>
        </div>
        <div class="space-y-4">
          <div v-for="project in recentProjects"
               :key="project.id"
               class="p-4 bg-gray-700/50 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-white font-medium">{{ project.titre }}</h4>
                <p class="text-gray-400 text-sm mt-1">{{ project.description }}</p>
              </div>
              <router-link
                  :to="'/projects/' + project.id"
                  class="text-blue-500 hover:text-blue-400 text-sm">
                Details
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-white">Recent Activities</h3>
        </div>
        <div class="space-y-4">
          <div v-for="(activity, index) in recentActivities"
               :key="index"
               class="flex items-center p-4 bg-gray-700/50 rounded-lg">
            <div class="flex-1">
              <p class="text-white">{{ activity.description }}</p>
              <p class="text-gray-400 text-sm mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProjectStore } from '../../stores/poject.js'
import { useAuthStore } from '@/stores/auth'
import { formatDistance } from 'date-fns'

const projectStore = useProjectStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const stats = ref([
  { label: 'Total Projects', value: 0 },
  { label: 'Active Games', value: 0 },
  { label: 'Websites', value: 0 },
  { label: 'Categories', value: 0 }
])

const recentProjects = ref([])
const recentActivities = ref([
  {
    description: 'New project created',
    time: '5 minutes ago'
  },
  {
    description: 'Website updated',
    time: '1 hour ago'
  },
  {
    description: 'New game added',
    time: '2 hours ago'
  }
])

onMounted(async () => {
  try {
    await Promise.all([
      projectStore.fetchProjects(),
      projectStore.fetchGames(),
      projectStore.fetchWebsites(),
      projectStore.fetchCategories()
    ])

    // Update stats
    stats.value = [
      { label: 'Total Projects', value: projectStore.projects.length },
      { label: 'Active Games', value: projectStore.games.length },
      { label: 'Websites', value: projectStore.websites.length },
      { label: 'Categories', value: projectStore.categories.length }
    ]

    // Get recent projects
    recentProjects.value = projectStore.projects
        .slice(0, 3)
        .map(project => ({
          ...project,
          timeAgo: formatDistance(new Date(project.createdAt), new Date(), { addSuffix: true })
        }))
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>