<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDisplay } from 'vuetify'

const router = useRouter()
const authStore = useAuthStore()
const { name: displayName, mobile } = useDisplay()

const drawer = ref(!mobile.value)
const userRole = computed(() => authStore.role)
const username = computed(() => authStore.username)

const menuItems = computed(() => {
  // Base menu items available to all users
  const items = [
    { title: 'داشبورد', icon: 'mdi-view-dashboard', to: '/' },
    { title: 'مدیریت سفرها', icon: 'mdi-map-marker-path', to: '/trips' },
    { title: 'مدیریت اتوبوس‌ها', icon: 'mdi-bus', to: '/buses' },
    { title: 'تابلوی حرکت', icon: 'mdi-bulletin-board', to: '/departures' },
  ]
  
  // Add admin-only items
  if (userRole.value === 'admin') {
    items.push({ title: 'مدیریت کاربران', icon: 'mdi-account-group', to: '/users' })
  }
  
  return items
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <v-app-bar color="primary" density="compact" elevation="2">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>سامانه مدیریت پایانه اتوبوس</v-app-bar-title>
    
    <v-spacer></v-spacer>
    
    <v-menu location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-avatar size="36" color="secondary" class="text-white">
            {{ username.charAt(0).toUpperCase() }}
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item prepend-icon="mdi-account">
          <v-list-item-title>{{ username }}</v-list-item-title>
          <v-list-item-subtitle>{{ userRole === 'admin' ? 'مدیر' : 'اپراتور' }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-logout" @click="logout">خروج</v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" :rail="mobile">
    <v-list>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
      ></v-list-item>
    </v-list>
    
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block prepend-icon="mdi-logout" @click="logout">خروج</v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-main>
    <v-container fluid>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-container>
  </v-main>

  <v-footer app class="bg-primary text-white">
    <div class="text-center w-100">
      سامانه مدیریت پایانه اتوبوس &copy; {{ new Date().getFullYear() }}
    </div>
  </v-footer>
</v-app>
</template>
