<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="d-flex flex-column align-center justify-center" style="min-height: 80vh">
    <v-icon size="128" color="error">mdi-alert-circle-outline</v-icon>
    <h1 class="text-h2 mt-6 mb-2">404</h1>
    <h2 class="text-h4 mb-4">صفحه مورد نظر یافت نشد</h2>
    <p class="text-body-1 mb-6">صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.</p>
    
    <div class="d-flex gap-4">
      <v-btn color="primary" prepend-icon="mdi-home" @click="goHome">
        صفحه اصلی
      </v-btn>
      <v-btn color="secondary" prepend-icon="mdi-arrow-left" @click="goBack">
        بازگشت
      </v-btn>
    </div>
  </div>
</template>
