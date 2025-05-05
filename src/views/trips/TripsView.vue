<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api'
import type { Trip } from '../../types'

const router = useRouter()
const trips = ref<Trip[]>([])
const loading = ref(true)
const searchQuery = ref('')
const dialog = ref(false)
const tripToDelete = ref<Trip | null>(null)
const itemsPerPage = ref(5)

const fetchTrips = async () => {
  loading.value = true
  try {
    // In a real app, this would fetch from the API
    // For demo, we'll use mock data
    // const response = await api.get('/trips')
    // trips.value = response.data

    // Mock data
    setTimeout(() => {
      trips.value = [
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
      loading.value = false
    }, 800)
  } catch (error) {
    console.error('Error fetching trips', error)
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

const confirmDelete = (trip: Trip) => {
  tripToDelete.value = trip
  dialog.value = true
}

const deleteTrip = async () => {
  if (!tripToDelete.value) return

  try {
    // In a real app, this would call the API
    // await api.delete(`/trips/${tripToDelete.value.id}`)

    // For demo, we'll filter out the trip from our array
    trips.value = trips.value.filter(t => t.id !== tripToDelete.value?.id)

    dialog.value = false
    tripToDelete.value = null
  } catch (error) {
    console.error('Error deleting trip', error)
  }
}

const filteredTrips = computed(() => {
  if (!searchQuery.value) return trips.value

  const query = searchQuery.value.toLowerCase()
  return trips.value.filter(trip =>
    trip.origin.toLowerCase().includes(query) ||
    trip.destination.toLowerCase().includes(query) ||
    trip.departureTime.toLowerCase().includes(query) ||
    trip.driver.toLowerCase().includes(query) ||
    trip.busInfo.toLowerCase().includes(query)
  )
})

onMounted(() => {
  fetchTrips()
})
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4">مدیریت سفرها</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="router.push('/trips/new')"
      >
        سفر جدید
      </v-btn>
    </div>

    <v-card elevation="2">
      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          label="جستجو در سفرها"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          class="mb-4"
        ></v-text-field>

        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="[
            { title: 'مبدا', key: 'origin' },
            { title: 'مقصد', key: 'destination' },
            { title: 'زمان حرکت', key: 'departureTime' },
            { title: 'راننده', key: 'driver' },
            { title: 'اتوبوس', key: 'busInfo' },
            { title: 'وضعیت', key: 'status' },
            { title: 'عملیات', key: 'actions', sortable: false }
          ]"
          :items="filteredTrips"
          :loading="loading"
          loading-text="در حال بارگذاری اطلاعات..."
          no-data-text="هیچ سفری یافت نشد"
          class="trips-table"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              text-color="white"
            >
              {{ getStatusText(item.status) }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                icon
                variant="text"
                color="primary"
                @click="router.push(`/trips/${item.id}`)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn
                icon
                variant="text"
                color="error"
                @click="confirmDelete(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          آیا از حذف این سفر مطمئن هستید؟
        </v-card-title>

        <v-card-text>
          <p>سفر: {{ tripToDelete?.origin }} به {{ tripToDelete?.destination }}</p>
          <p>زمان حرکت: {{ tripToDelete?.departureTime }}</p>
          <p>این عملیات قابل بازگشت نیست.</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            انصراف
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deleteTrip">
            حذف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.trips-table {
  width: 100%;
}
</style>
