<!-- src/views/NotFoundView.vue -->
<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-white">404</h1>
      <p class="mt-4 text-xl text-gray-400">Page not found</p>
      <router-link
          to="/dashboard"
          class="mt-6 inline-block px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Go back home
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No setup needed
</script>