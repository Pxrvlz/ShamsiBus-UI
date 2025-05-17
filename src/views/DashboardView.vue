<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../api'

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref({
  totalTrips: 0,
  todayTrips: 0,
  canceledTrips: 0,
  totalBuses: 0,
  activeBuses: 0
})

const username = authStore.username
const isAdmin = authStore.role === 'admin'

onMounted(async () => {
  loading.value = true
  try {
    // In a real app, this would fetch from the API
    // For demo, we'll use mock data
    // const response = await api.get('/dashboard/stats')
    // stats.value = response.data
    
    // Mock data
    setTimeout(() => {
      stats.value = {
        totalTrips: 248,
        todayTrips: 32,
        canceledTrips: 5,
        totalBuses: 45,
        activeBuses: 28
      }
      loading.value = false
    }, 800)
  } catch (error) {
    console.error('Error fetching dashboard data', error)
  }
})
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4 persian-text">داشبورد مدیریت</h1>
        <v-sheet color="surface" elevation="1" class="pa-4 mb-4" rounded>
          <div class="text-h6 persian-text">خوش آمدید، {{ username }}</div>
          <p class="text-body-1 mt-2 persian-text">
            به سامانه مدیریت پایانه اتوبوس خوش آمدید. با استفاده از منوی راست می‌توانید به بخش‌های مختلف سامانه دسترسی داشته باشید.
          </p>
        </v-sheet>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col v-if="loading" cols="12" class="text-center py-10">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
        <div class="text-body-1 mt-4 persian-text">در حال بارگذاری...</div>
      </v-col>
      
      <template v-else>
        <!-- Stats Cards Row -->
        <v-col cols="12" md="4">
          <v-card elevation="2" class="mb-4 pa-4">
            <div class="text-h6 mb-2 font-weight-bold persian-text">
              <v-icon color="primary" class="me-2">mdi-map-marker-path</v-icon>
              سفرهای امروز
            </div>
            <div class="text-h3 font-weight-bold text-primary persian-text">{{ stats.todayTrips }}</div>
            <div class="mt-2 persian-text">از {{ stats.totalTrips }} سفر کل</div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card elevation="2" class="mb-4 pa-4">
            <div class="text-h6 mb-2 font-weight-bold persian-text">
              <v-icon color="warning" class="me-2">mdi-alert-circle</v-icon>
              سفرهای لغو شده 
            </div>
            <div class="text-h3 font-weight-bold text-warning persian-text">{{ stats.canceledTrips }}</div>
            <div class="mt-2 persian-text">در 24 ساعت گذشته</div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card elevation="2" class="mb-4 pa-4">
            <div class="text-h6 mb-2 font-weight-bold persian-text">
              <v-icon color="success" class="me-2">mdi-bus</v-icon>
              اتوبوس‌های فعال
            </div>
            <div class="text-h3 font-weight-bold text-success persian-text">{{ stats.activeBuses }}</div>
            <div class="mt-2 persian-text">از {{ stats.totalBuses }} اتوبوس</div>
          </v-card>
        </v-col>
        
        <!-- Quick Actions -->
        <v-col cols="12">
          <v-card elevation="2" class="mb-4">
            <v-card-title class="persian-text">
              <v-icon start>mdi-lightning-bolt</v-icon>
              دسترسی سریع
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-btn
                    block
                    prepend-icon="mdi-map-marker-path"
                    color="primary"
                    variant="elevated"
                    to="/trips/new"
                    height="56"
                    class="persian-text"
                  >
                    ثبت سفر جدید
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-btn
                    block
                    prepend-icon="mdi-bus"
                    color="secondary"
                    variant="elevated"
                    to="/buses/new"
                    height="56"
                    class="persian-text"
                  >
                    ثبت اتوبوس جدید
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-btn
                    block
                    prepend-icon="mdi-bulletin-board"
                    color="accent"
                    variant="elevated"
                    to="/departures"
                    height="56"
                    class="persian-text"
                  >
                    تابلوی حرکت
                  </v-btn>
                </v-col>
                <v-col v-if="isAdmin" cols="12" sm="6" md="3">
                  <v-btn
                    block
                    prepend-icon="mdi-account-plus"
                    color="info"
                    variant="elevated"
                    to="/users/new"
                    height="56"
                    class="persian-text"
                  >
                    افزودن کاربر 
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </div>
</template>
