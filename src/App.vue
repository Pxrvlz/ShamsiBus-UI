<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AppLayout from './layouts/AppLayout.vue' // Import the AppLayout component from layouts

const route = useRoute()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isAuthenticated)
const isLoginPage = computed(() => route.path === '/login')

onMounted(() => {
  // Check if user has a valid token on app start
  authStore.checkAuth()
})
</script>

<template>
  <v-app>
    <template v-if="isLoggedIn && !isLoginPage">
      <AppLayout />
    </template>

    <template v-else>
      <v-main>
        <router-view />
      </v-main>
    </template>
  </v-app>
</template>
