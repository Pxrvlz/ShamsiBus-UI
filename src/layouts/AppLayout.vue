<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn
        v-if="!isHomePage"
        icon
        @click="goHome"
        class="ml-2"
      >
        <v-tooltip activator="parent" location="bottom">بازگشت به داشبورد</v-tooltip>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title class="app-title">ShamsiBus</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" temporary>
      <v-list density="compact" nav>
        <v-list-item link to="/">
          <template v-slot:prepend>
            <v-icon>mdi-view-dashboard</v-icon>
          </template>
          <v-list-item-title>داشبورد</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/trips">
           <template v-slot:prepend>
            <v-icon>mdi-map-marker-path</v-icon>
          </template>
          <v-list-item-title>سفرها</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/buses">
           <template v-slot:prepend>
            <v-icon>mdi-bus</v-icon>
          </template>
          <v-list-item-title>اتوبوس‌ها</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/departures">
           <template v-slot:prepend>
            <v-icon>mdi-clock-start</v-icon>
          </template>
          <v-list-item-title>حرکت‌ها</v-list-item-title>
        </v-list-item>
         <v-list-item link to="/users">
           <template v-slot:prepend>
            <v-icon>mdi-account-group</v-icon>
          </template>
          <v-list-item-title>کاربران</v-list-item-title>
        </v-list-item>
      </v-list>
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

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} مدیریت پایانه اتوبوسرانی</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const drawer = ref(false);
const route = useRoute();
const router = useRouter();

const isHomePage = computed(() => route.path === '/');

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.app-title {
  margin-left: 10px;
  font-weight: 500;
}

.ml-2 {
  margin-inline-start: 8px !important;
   margin-inline-end: 0 !important;
}

/* Ensure icon in prepend slot has correct margin in RTL */
.v-list-item--nav .v-list-item__prepend > .v-icon {
    margin-inline-end: 16px !important;
    margin-inline-start: 0 !important;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
