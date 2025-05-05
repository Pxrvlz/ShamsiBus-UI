<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api'
import type { Trip, Bus } from '../../types'

const route = useRoute()
const router = useRouter()
const isNewTrip = computed(() => route.name === 'NewTrip')
const loading = ref(false)
const saving = ref(false)
const tripId = computed(() => route.params.id as string)
const buses = ref<Bus[]>([])

const trip = ref<Trip>({
  id: 0,
  origin: '',
  destination: '',
  departureTime: '',
  status: 'on_time',
  busId: 0,
  busInfo: '',
  intermediateStops: ['', '', ''],
  driver: ''
})

// Persian cities for demo
const cities = [
  'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'اهواز', 'قم', 'کرمانشاه', 
  'رشت', 'ارومیه', 'زاهدان', 'یزد', 'کرمان', 'اردبیل', 'بندرعباس', 'همدان', 
  'کرج', 'قزوین', 'سنندج', 'ساری', 'گرگان', 'خرم‌آباد', 'بیرجند', 'بوشهر',
  'اراک', 'ایلام', 'سمنان', 'یاسوج', 'زنجان', 'شهرکرد'
]

// Status options
const statusOptions = [
  { value: 'on_time', text: 'به موقع', color: 'success' },
  { value: 'delayed', text: 'تاخیر', color: 'warning' },
  { value: 'canceled', text: 'لغو شده', color: 'error' }
]

const fetchTrip = async () => {
  if (isNewTrip.value) return
  
  loading.value = true
  try {
    // In a real app, this would fetch from the API
    // const response = await api.get(`/trips/${tripId.value}`)
    // trip.value = response.data
    
    // Mock data for demo
    setTimeout(() => {
      trip.value = {
        id: parseInt(tripId.value),
        origin: 'تهران',
        destination: 'اصفهان',
        departureTime: '1404/06/10 08:30',
        status: 'on_time',
        busId: 101,
        busInfo: 'ایران 22 - 124ع44',
        intermediateStops: ['قم', 'کاشان', ''],
        driver: 'علی رضایی'
      }
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('Error fetching trip', error)
    loading.value = false
  }
}

const fetchBuses = async () => {
  try {
    // In a real app, this would fetch from the API
    // const response = await api.get('/buses')
    // buses.value = response.data
    
    // Mock data for demo
    buses.value = [
      { id: 101, licensePlate: 'ایران 22 - 124ع44', capacity: 44, driver: 'علی رضایی' },
      { id: 103, licensePlate: 'ایران 11 - 587ب32', capacity: 44, driver: 'محمد حسینی' },
      { id: 105, licensePlate: 'ایران 22 - 745ج18', capacity: 44, driver: 'رضا کریمی' },
      { id: 107, licensePlate: 'ایران 13 - 362د77', capacity: 38, driver: 'حسن محمدی' },
      { id: 109, licensePlate: 'ایران 22 - 918ه55', capacity: 44, driver: 'کاظم علوی' }
    ]
  } catch (error) {
    console.error('Error fetching buses', error)
  }
}

const updateDriver = () => {
  const selectedBus = buses.value.find(b => b.id === trip.value.busId)
  if (selectedBus) {
    trip.value.driver = selectedBus.driver
    trip.value.busInfo = selectedBus.licensePlate
  }
}

const saveTrip = async () => {
  // Basic validation
  if (!trip.value.origin || !trip.value.destination || !trip.value.departureTime || !trip.value.busId) {
    alert('لطفا تمام فیلدهای الزامی را پر کنید')
    return
  }
  
  saving.value = true
  try {
    // Clean up empty intermediate stops
    trip.value.intermediateStops = trip.value.intermediateStops.filter(stop => stop.trim() !== '')
    
    if (isNewTrip.value) {
      // In a real app, this would be an API call
      // await api.post('/trips', trip.value)
      console.log('Creating new trip:', trip.value)
    } else {
      // In a real app, this would be an API call
      // await api.put(`/trips/${tripId.value}`, trip.value)
      console.log('Updating trip:', trip.value)
    }
    
    // Redirect to trips list
    router.push('/trips')
  } catch (error) {
    console.error('Error saving trip', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchBuses()
  fetchTrip()
})
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4">{{ isNewTrip ? 'ثبت سفر جدید' : 'ویرایش سفر' }}</h1>
      <v-btn 
        color="secondary" 
        prepend-icon="mdi-arrow-left" 
        @click="router.push('/trips')"
      >
        بازگشت به لیست سفرها
      </v-btn>
    </div>
    
    <v-card elevation="2">
      <v-card-text>
        <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
        
        <v-form v-else @submit.prevent="saveTrip">
          <v-row>
            <!-- Main Trip Details -->
            <v-col cols="12" md="6">
              <v-select
                v-model="trip.origin"
                :items="cities"
                label="مبدا *"
                variant="outlined"
                :rules="[v => !!v || 'مبدا الزامی است']"
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="trip.destination"
                :items="cities"
                label="مقصد *"
                variant="outlined"
                :rules="[v => !!v || 'مقصد الزامی است']"
              ></v-select>
            </v-col>
            
            <v-col cols="12">
              <h3 class="text-subtitle-1 mb-2">توقف‌های میانی (حداکثر ۳ مورد)</h3>
              <v-row>
                <v-col v-for="(_, index) in 3" :key="index" cols="12" md="4">
                  <v-select
                    v-model="trip.intermediateStops[index]"
                    :items="cities.filter(city => city !== trip.origin && city !== trip.destination)"
                    :label="`توقف میانی ${index + 1}`"
                    variant="outlined"
                    clearable
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="trip.departureTime"
                label="زمان حرکت *"
                variant="outlined"
                placeholder="مثال: 1404/06/10 08:30"
                :rules="[v => !!v || 'زمان حرکت الزامی است']"
              ></v-text-field>
              <div class="text-caption text-grey">فرمت: تاریخ شمسی YYYY/MM/DD HH:MM</div>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="trip.status"
                :items="statusOptions"
                item-title="text"
                item-value="value"
                label="وضعیت سفر"
                variant="outlined"
              >
                <template v-slot:selection="{ item }">
                  <v-chip
                    :color="item.raw.color"
                    size="small"
                    text-color="white"
                  >
                    {{ item.raw.text }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
            
            <!-- Bus Selection -->
            <v-col cols="12" md="6">
              <v-select
                v-model="trip.busId"
                :items="buses"
                item-title="licensePlate"
                item-value="id"
                label="انتخاب اتوبوس *"
                variant="outlined"
                :rules="[v => !!v || 'انتخاب اتوبوس الزامی است']"
                @update:model-value="updateDriver"
              >
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>{{ item.raw.licensePlate }}</v-list-item-title>
                    <v-list-item-subtitle>ظرفیت: {{ item.raw.capacity }} | راننده: {{ item.raw.driver }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="trip.driver"
                label="راننده"
                variant="outlined"
                readonly
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          
          <div class="d-flex justify-end gap-3 mt-4">
            <v-btn
              color="error"
              variant="outlined"
              @click="router.push('/trips')"
              :disabled="saving"
            >
              انصراف
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
              :loading="saving"
              :disabled="saving"
            >
              {{ isNewTrip ? 'ثبت سفر' : 'بروزرسانی سفر' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
