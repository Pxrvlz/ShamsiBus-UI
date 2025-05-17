<template>
  <v-app>
    <v-app-bar app color="primary" density="comfortable" elevation="2">
      <!-- Removed v-app-bar-nav-icon -->

      <v-img
        src="https://cdn.imgurl.ir/uploads/s041914_logo.png"
        max-height="36"
        max-width="36"
        contain
        class="ml-1 mr-3"
        alt="ShamsiBus Logo"
        @click="goHome"
        style="cursor: pointer;"
      ></v-img>
      <v-toolbar-title
        @click="goHome"
        style="cursor: pointer;"
        class="font-weight-bold text-h6"
      >
        سامانه پایانه
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Removed Home button -->

      <v-menu location="bottom end" transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="mx-1">
            <v-avatar color="secondary" size="36">
              <span class="text-white text-subtitle-1">{{ userInitials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list density="compact" nav>
          <v-list-item class="text-center">
            <v-list-item-title class="font-weight-medium">{{ authStore.username }}</v-list-item-title>
            <v-list-item-subtitle>{{ authStore.role === 'admin' ? 'مدیر سیستم' : 'اپراتور' }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-1"></v-divider>
          <v-list-item @click="logoutUser" link base-color="error" prepend-icon="mdi-logout">
            <v-list-item-title>خروج از حساب</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      app
      :permanent="!isMobileDisplay"
      :temporary="isMobileDisplay"
      :width="260"
      color="surface"
      elevation="1"
      model-value="true"
    >
      <v-list nav density="compact">
        <v-list-item class="pa-3 mb-2">
           <template v-slot:prepend>
             <v-img
              src="https://i.imgur.com/gQcZf7G.png"
              max-height="40"
              max-width="40"
              contain
              alt="ShamsiBus Logo"
              class="mr-3"
            ></v-img>
           </template>
          <v-list-item-title class="text-h6 font-weight-bold">ShamsiBus</v-list-item-title>
        </v-list-item>
         <v-divider></v-divider>

        <template v-for="(item, index) in menuItems" :key="item.title">
          <v-list-item
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            link
            active-class="v-list-item--active primary"
            class="px-4"
          >
          </v-list-item>
          <!-- Adjusted padding -->
          <v-divider v-if="index < menuItems.length - 1"></v-divider> <!-- Add divider between items -->
        </template>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            color="error"
            variant="tonal"
            @click="logoutUser"
            prepend-icon="mdi-logout"
          >
            <span>خروج</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main style="background-color: #ECEFF1;">
      <v-container fluid class="pa-md-6 pa-4">
        <router-view v-slot="{ Component }">
          <transition name="fade-router" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <v-footer app color="primary" height="30" class="text-caption d-flex justify-content-center align-items-center">
        <span>&copy; {{ new Date().getFullYear() }} سامانه مدیریت پایانه اتوبوسرانی.</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useDisplay } from 'vuetify';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { mobile: isMobileDisplay } = useDisplay();

// Removed railMode ref and watch logic as the drawer is now static on desktop
// and temporary on mobile without rail mode.

const userInitials = computed(() => {
  const username = authStore.username;
  if (!username) return 'SB'; // ShamsiBus initials as fallback
  const parts = username.split(' ').filter(p => p.length > 0);
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length -1][0]).toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
});

const menuItems = computed(() => [
  { title: 'داشبورد', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'سفرها', icon: 'mdi-map-marker-path', to: '/trips' },
  { title: 'اتوبوس‌ها', icon: 'mdi-bus-side', to: '/buses' },
  { title: 'حرکت‌ها', icon: 'mdi-clock-start', to: '/departures' },
  ...(authStore.isAuthenticated && authStore.role === 'admin'
    ? [{ title: 'کاربران', icon: 'mdi-account-group-outline', to: '/users' }]
    : [])
]);

const goHome = () => {
  router.push('/');
};

const logoutUser = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Vuetify 3 applies active styles automatically with active-class or its defaults.
   The 'primary' class on v-list-item with active-class will color it.
   If more specific styling is needed for active items: */
.v-list-item--active .v-list-item-title,
.v-list-item--active .v-icon {
   color: rgb(var(--v-theme-primary)); /* Ensures text and icon within active item use primary color */
}


.fade-router-enter-active,
.fade-router-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-router-enter-from,
.fade-router-leave-to {
  opacity: 0;
}

.v-navigation-drawer .v-list-item__prepend > .v-icon {
    margin-inline-end: 12px !important;
    margin-inline-start: 0 !important; /* RTL fix */
}

/* Custom scrollbar for navigation drawer */
.v-navigation-drawer__content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.v-navigation-drawer__content::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 3px;
}
.v-navigation-drawer__content::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
