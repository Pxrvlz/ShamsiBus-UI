<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import api from '../api'
import type { Trip } from '../types'

const departures = ref<Trip[]>([])
const loading = ref(true)
const refreshing = ref(false)
const lastRefresh = ref(new Date())
const refreshInterval = ref<number | null>(null)

const fetchDepartures = async () => {
  if (refreshing.value) return
  
  refreshing.value = true
  try {
    // In a real app, this would fetch from the API
    // const response = await api.get('/departures')
    // departures.value = response.data
    
    // Mock data
    const mockData: Trip[] = [
      {
        id: 1,
        origin: 'تهران',
        destination: 'اصفهان',
        departureTime: '1404/06/10 08:30',
        status: 'on_time',
        busId: 101,
        busInfo: 'ایران 22 - 124ع44',
        intermediateStops: ['قم', 'کاشان'],
        driver: 'علی رضایی'
      },
      {
        id: 2,
        origin: 'تهران',
        destination: 'مشهد',
        departureTime: '1404/06/10 10:00',
        status: 'delayed',
        busId: 103,
        busInfo: 'ایران 11 - 587ب32',
        intermediateStops: ['سمنان', 'شاهرود', 'سبزوار'],
        driver: 'محمد حسینی'
      },
      {
        id: 3,
        origin: 'تهران',
        destination: 'تبریز',
        departureTime: '1404/06/10 12:15',
        status: 'on_time',
        busId: 105,
        busInfo: 'ایران 22 - 745ج18',
        intermediateStops: ['قزوین', 'زنجان'],
        driver: 'رضا کریمی'
      },
      {
        id: 4,
        origin: 'اصفهان',
        destination: 'شیراز',
        departureTime: '1404/06/10 14:30',
        status: 'canceled',
        busId: 107, 
        busInfo: 'ایران 13 - 362د77',
        intermediateStops: ['یاسوج'],
        driver: 'حسن محمدی'
      },
      {
        id: 5,
        origin: 'تهران', 
        destination: 'رشت',
        departureTime: '1404/06/10 16:00',
        status: 'on_time',
        busId: 109,
        busInfo: 'ایران 22 - 918ه55',
        intermediateStops: ['قزوین'],
        driver: 'کاظم علوی'
      }
    ]
    
    // Add random changes to demonstrate real-time updates
    if (departures.value.length > 0 && Math.random() > 0.7) {
      // Occasionally change a trip status
      const randomIndex = Math.floor(Math.random() * mockData.length)
      const statuses = ['on_time', 'delayed', 'canceled']
      mockData[randomIndex].status = statuses[Math.floor(Math.random() * statuses.length)]
    }
    
    departures.value = mockData
    lastRefresh.value = new Date()
  } catch (error) {
    console.error('Error fetching departures', error)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on_time': return 'success'
    case 'delayed': return 'warning'
    case 'canceled': return 'error'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'on_time': return 'به موقع'
    case 'delayed': return 'تاخیر'
    case 'canceled': return 'لغو شده'
    default: return 'نامشخص'
  }
}

const setupRefreshInterval = () => {
  fetchDepartures()
  // Refresh every 30 seconds
  refreshInterval.value = setInterval(fetchDepartures, 30000) as unknown as number
}

onMounted(() => {
  setupRefreshInterval()
})

onBeforeUnmount(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4">تابلوی حرکت</h1>
      <v-btn 
        color="primary" 
        prepend-icon="mdi-refresh" 
        :loading="refreshing"
        @click="fetchDepartures"
      >
        به‌روزرسانی
      </v-btn>
    </div>
    
    <v-card elevation="3" class="departures-board">
      <v-card-title class="text-center bg-primary text-white py-3">
        تابلوی زمان حرکت اتوبوس‌ها
      </v-card-title>
      
      <v-card-text class="pa-0">
        <v-table>
          <thead>
            <tr>
              <th class="text-center">شماره سفر</th>
              <th class="text-center">مقصد</th>
              <th class="text-center">از طریق</th>
              <th class="text-center">ساعت حرکت</th>
              <th class="text-center">شماره اتوبوس</th>
              <th class="text-center">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-5">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <div class="mt-2">در حال بارگذاری...</div>
              </td>
            </tr>
            <tr v-else-if="departures.length === 0">
              <td colspan="6" class="text-center py-5">
                هیچ سفری برای نمایش وجود ندارد
              </td>
            </tr>
            <tr
              v-for="departure in departures"
              :key="departure.id"
              class="departure-row"
              :class="{ 'cancelled': departure.status === 'canceled' }"
            >
              <td class="text-center">{{ departure.id }}</td>
              <td class="text-center font-weight-bold">{{ departure.destination }}</td>
              <td class="text-center">{{ departure.intermediateStops.join(' - ') || '-' }}</td>
              <td class="text-center">{{ departure.departureTime.split(' ')[1] }}</td>
              <td class="text-center">{{ departure.busInfo }}</td>
              <td class="text-center">
                <v-chip
                  :color="getStatusColor(departure.status)"
                  size="small"
                  text-color="white"
                >
                  {{ getStatusText(departure.status) }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      
      <v-card-text class="text-center text-body-2 py-2 bg-grey-lighten-4">
        آخرین به‌روزرسانی: {{ lastRefresh.toLocaleTimeString('fa-IR') }}
        <v-icon size="small" class="ms-1">mdi-clock-outline</v-icon>
        <div class="text-caption">به‌روزرسانی خودکار هر 30 ثانیه</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.departures-board {
  overflow: hidden;
}

.departure-row {
  transition: background-color 0.3s ease;
}

.departure-row:hover {
  background-color: #f5f5f5;
}

.departure-row.cancelled {
  background-color: rgba(244, 67, 54, 0.1);
}

@keyframes flash {
  0% { background-color: rgba(255, 235, 59, 0); }
  50% { background-color: rgba(255, 235, 59, 0.3); }
  100% { background-color: rgba(255, 235, 59, 0); }
}

.flash-update {
  animation: flash 2s ease-in-out;
}
</style>
