<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api'
import type { Trip, Bus } from '../../types'
import moment from 'moment-jalaali' // Using moment-jalaali for Shamsi dates

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
  departureTime: '', // This will store the final formatted string
  status: 'on_time',
  busId: 0,
  busInfo: '',
  intermediateStops: ['', '', ''],
  driver: ''
})

// State for date and time inputs
const departureDate = ref<string | null>(null) // YYYY-MM-DD format for v-date-picker
const departureTime = ref<string | null>(null) // HH:mm format for manual input
const dateMenu = ref(false) // Keep date menu for date picker

// Combine date and time into trip.departureTime string
watch([departureDate, departureTime], ([date, time]) => {
  if (date && time) {
    // Convert YYYY-MM-DD (Gregorian) from date picker to Shamsi YYYY/MM/DD
    const shamsiDate = moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD');
    trip.value.departureTime = `${shamsiDate} ${time}`;
  } else {
    trip.value.departureTime = '';
  }
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

// Get today's date in YYYY-MM-DD format for min date
const today = computed(() => moment().format('YYYY-MM-DD'))

const fetchTrip = async () => {
  if (isNewTrip.value) return

  loading.value = true
  try {
    // In a real app, this would fetch from the API
    // const response = await api.get(`/trips/${tripId.value}`)
    // trip.value = response.data

    // Mock data for demo
    setTimeout(() => {
      const mockTrip = {
        id: parseInt(tripId.value),
        origin: 'تهران',
        destination: 'اصفهان',
        departureTime: '1404/06/10 08:30', // Shamsi date string
        status: 'on_time',
        busId: 101,
        busInfo: 'ایران 22 - 124ع44',
        intermediateStops: ['قم', 'کاشان', ''],
        driver: 'علی رضایی'
      }
      trip.value = mockTrip

      // Parse the fetched Shamsi date string into Gregorian YYYY-MM-DD and HH:mm
      if (mockTrip.departureTime) {
        const [datePart, timePart] = mockTrip.departureTime.split(' ');
        if (datePart) {
           // Convert Shamsi YYYY/MM/DD to Gregorian YYYY-MM-DD
          departureDate.value = moment(datePart, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
        }
        if (timePart) {
          departureTime.value = timePart; // HH:mm
        }
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
      { id: 101, licensePlate: 'ایران 22 - 124ع44', capacity: 44, driver: 'علی رضایی', busModelName: 'Volvo B9R', status: 'active' },
      { id: 103, licensePlate: 'ایران 11 - 587ب32', capacity: 44, driver: 'محمد حسینی', busModelName: 'Scania Maral', status: 'active' },
      { id: 105, licensePlate: 'ایران 22 - 745ج18', capacity: 44, driver: 'رضا کریمی', busModelName: 'Volvo B12B', status: 'maintenance' },
      { id: 107, licensePlate: 'ایران 13 - 362د77', capacity: 38, driver: 'حسن محمدی', busModelName: 'Oghab Scania', status: 'active' },
      { id: 109, licensePlate: 'ایران 22 - 918ه55', capacity: 44, driver: 'کاظم علوی', busModelName: 'Volvo B9R', status: 'inactive' }
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

const validateOriginDestination = () => {
  if (trip.value.origin && trip.value.destination && trip.value.origin === trip.value.destination) {
    return 'مبدا و مقصد نمی‌توانند یکسان باشند'
  }
  return true
}

const validateIntermediateStops = () => {
  const stops = trip.value.intermediateStops.filter(stop => stop.trim() !== '');
  const uniqueStops = new Set(stops);

  if (stops.length !== uniqueStops.size) {
    return 'توقف‌های میانی نمی‌توانند تکراری باشند';
  }

  if (stops.includes(trip.value.origin)) {
    return 'توقف میانی نمی‌تواند با مبدا یکسان باشد';
  }

  if (stops.includes(trip.value.destination)) {
    return 'توقف میانی نمی‌تواند با مقصد یکسان باشد';
  }

  return true;
}

// Basic time format validation (HH:mm)
const validateTimeFormat = (value: string | null) => {
  if (!value) return 'ساعت حرکت الزامی است';
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/; // HH:mm format
  return timeRegex.test(value) || 'فرمت ساعت نامعتبر است (مثال: 08:30)';
}


const saveTrip = async () => {
  // Basic validation
  if (!trip.value.origin || !trip.value.destination || !departureDate.value || !departureTime.value || !trip.value.busId) {
    alert('لطفا تمام فیلدهای الزامی را پر کنید')
    return
  }

  // Validate origin and destination are not the same
  const originDestinationValidation = validateOriginDestination();
  if (originDestinationValidation !== true) {
    alert(originDestinationValidation);
    return;
  }

  // Validate intermediate stops
  const intermediateStopsValidation = validateIntermediateStops();
  if (intermediateStopsValidation !== true) {
    alert(intermediateStopsValidation);
    return;
  }

  // Validate time format
  const timeFormatValidation = validateTimeFormat(departureTime.value);
  if (timeFormatValidation !== true) {
    alert(timeFormatValidation);
    return;
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
                :rules="[v => !!v || 'مبدا الزامی است', validateOriginDestination]"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="trip.destination"
                :items="cities"
                label="مقصد *"
                variant="outlined"
                :rules="[v => !!v || 'مقصد الزامی است', validateOriginDestination]"
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
                    :rules="[validateIntermediateStops]"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>

            <!-- Departure Date and Time Inputs -->
            <v-col cols="12" md="6">
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="departureDate"
                    label="تاریخ حرکت *"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    variant="outlined"
                    :rules="[v => !!v || 'تاریخ حرکت الزامی است']"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="departureDate"
                  :min="today"
                  @update:model-value="dateMenu = false"
                  color="primary"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="6">
               <v-text-field
                  v-model="departureTime"
                  label="ساعت حرکت *"
                  prepend-icon="mdi-clock-outline"
                  variant="outlined"
                  placeholder="مثال: 08:30"
                  :rules="[validateTimeFormat]"
                ></v-text-field>
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
