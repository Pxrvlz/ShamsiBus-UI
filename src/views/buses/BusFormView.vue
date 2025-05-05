<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api'
import type { Bus } from '../../types'

const route = useRoute()
const router = useRouter()
const isNewBus = computed(() => route.name === 'NewBus')
const loading = ref(false)
const saving = ref(false)
const busId = computed(() => route.params.id as string)

const bus = ref<Bus>({
  id: 0,
  licensePlate: '',
  capacity: 44,
  driver: '',
  status: 'active'
})

// Status options
const statusOptions = [
  { value: 'active', text: 'فعال', color: 'success' },
  { value: 'maintenance', text: 'تعمیرات', color: 'warning' },
  { value: 'inactive', text: 'غیرفعال', color: 'error' }
]

// Capacity options
const capacityOptions = [38, 44, 50]

const fetchBus = async () => {
  if (isNewBus.value) return
  
  loading.value = true
  try {
    // In a real app, this would fetch from the API
    // const response = await api.get(`/buses/${busId.value}`)
    // bus.value = response.data
    
    // Mock data for demo
    setTimeout(() => {
      bus.value = {
        id: parseInt(busId.value),
        licensePlate: 'ایران 22 - 124ع44',
        capacity: 44,
        driver: 'علی رضایی',
        status: 'active'
      }
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('Error fetching bus', error)
    loading.value = false
  }
}

const validateLicensePlate = (value: string) => {
  if (!value) return 'شماره پلاک الزامی است'
  
  // Basic validation - can be enhanced based on Iranian license plate formats
  const pattern = /^ایران \d{2} - \d{3}[الف-ی]\d{2}$/
  if (!pattern.test(value)) {
    return 'فرمت پلاک صحیح نیست. مثال: ایران 22 - 124ع44'
  }
  
  return true
}

const saveBus = async () => {
  // Basic validation
  if (!bus.value.licensePlate || !bus.value.driver) {
    alert('لطفا تمام فیلدهای الزامی را پر کنید')
    return
  }
  
  saving.value = true
  try {
    if (isNewBus.value) {
      // In a real app, this would be an API call
      // await api.post('/buses', bus.value)
      console.log('Creating new bus:', bus.value)
    } else {
      // In a real app, this would be an API call
      // await api.put(`/buses/${busId.value}`, bus.value)
      console.log('Updating bus:', bus.value)
    }
    
    // Redirect to buses list
    router.push('/buses')
  } catch (error) {
    console.error('Error saving bus', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchBus()
})
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4">{{ isNewBus ? 'ثبت اتوبوس جدید' : 'ویرایش اتوبوس' }}</h1>
      <v-btn 
        color="secondary" 
        prepend-icon="mdi-arrow-left" 
        @click="router.push('/buses')"
      >
        بازگشت به لیست اتوبوس‌ها
      </v-btn>
    </div>
    
    <v-card elevation="2">
      <v-card-text>
        <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
        
        <v-form v-else @submit.prevent="saveBus">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="bus.licensePlate"
                label="شماره پلاک *"
                variant="outlined"
                placeholder="مثال: ایران 22 - 124ع44"
                :rules="[validateLicensePlate]"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="bus.capacity"
                :items="capacityOptions"
                label="ظرفیت *"
                variant="outlined"
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="bus.driver"
                label="نام راننده *"
                variant="outlined"
                :rules="[v => !!v || 'نام راننده الزامی است']"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="bus.status"
                :items="statusOptions"
                item-title="text"
                item-value="value"
                label="وضعیت اتوبوس"
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
          </v-row>
          
          <div class="d-flex justify-end gap-3 mt-4">
            <v-btn
              color="error"
              variant="outlined"
              @click="router.push('/buses')"
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
              {{ isNewBus ? 'ثبت اتوبوس' : 'بروزرسانی اتوبوس' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
