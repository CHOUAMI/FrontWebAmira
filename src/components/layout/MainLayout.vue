<!-- src/components/layout/MainLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-gray-800">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center h-16 px-4 bg-gray-900">
          <h1 class="text-xl font-bold text-white">Demo App</h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-2 py-4 space-y-1">
          <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              :class="[
              isActive(item.to)
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
            ]"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- User menu -->
        <div class="px-4 py-4 bg-gray-700">
          <div class="flex items-center">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">
                {{ user?.nom }}
              </p>
              <p class="text-xs text-gray-300 truncate">
                {{ user?.email }}
              </p>
            </div>
            <button
                @click="logout"
                class="text-gray-300 hover:text-white text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="pl-64">
      <main class="py-6">
        <div class="px-4 sm:px-6 lg:px-8">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const navigation = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Projects', to: '/projects' },
  { name: 'Games', to: '/games' },
  { name: 'Categories', to: '/categories' },
  ...(authStore.isAdmin ? [
    { name: 'Users', to: '/users' },
    { name: 'Roles', to: '/roles' }
  ] : [])
];

const isActive = (path) => route.path.startsWith(path);

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>