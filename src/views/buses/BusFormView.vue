<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api'
import type { Bus } from '../../types'

const route = useRoute()
const router = useRouter()
const isNewBus = computed(() => route.name === 'NewBus')
const loading = ref(false)
const saving = ref(false)
const busId = computed(() => route.params.id as string)

// Refs for separate license plate parts
const platePart1 = ref('') // First two digits
const plateLetter = ref('') // The Persian letter
const platePart3 = ref('') // Three digits after hyphen
const platePart4 = ref('') // Last two digits

const bus = ref<Bus>({
  id: 0,
  licensePlate: '', // Full license plate string
  busModelName: '',
  capacity: 44, // Default capacity
  driver: '',
  status: 'active',
})

// Status options
const statusOptions = [
  { value: 'active', text: 'فعال', color: 'success' },
  { value: 'maintenance', text: 'تعمیرات', color: 'warning' },
  { value: 'inactive', text: 'غیرفعال', color: 'error' }
]

// Removed capacityOptions as capacity is now a text input

// Persian letters for license plates
const plateLettersOptions = [
  'ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س',
  'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی'
]

// Computed property to combine parts into full license plate
const fullLicensePlate = computed(() => {
  // Format: ایران [Part1] - [Part3][Letter][Part4]
  if (platePart1.value && plateLetter.value && platePart3.value && platePart4.value) {
    return `ایران ${platePart1.value} - ${platePart3.value}${plateLetter.value}${platePart4.value}`;
  }
  return ''; // Return empty string if parts are incomplete
})

// Watcher to update bus.licensePlate when parts change
watch(fullLicensePlate, (newValue) => {
  bus.value.licensePlate = newValue;
});

const fetchBus = async () => {
  if (isNewBus.value) return

  loading.value = true
  try {
    // In a real app, this would fetch from the API
    // const response = await api.get(`/buses/${busId.value}`)
    // bus.value = response.data

    // Mock data for demo
    setTimeout(() => {
      const fetchedBus = {
        id: parseInt(busId.value),
        licensePlate: 'ایران 22 - 124ع44', // Example fetched plate
        busModelName: 'Volvo B9R',
        capacity: 44, // Example fetched capacity
        driver: 'علی رضایی',
        status: 'active',
      }
      bus.value = fetchedBus;

      // Parse the fetched license plate string into parts
      const plateMatch = fetchedBus.licensePlate.match(/^ایران (\d{2}) - (\d{3})([ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی])(\d{2})$/);
      if (plateMatch) {
        platePart1.value = plateMatch[1];
        platePart3.value = plateMatch[2];
        plateLetter.value = plateMatch[3];
        platePart4.value = plateMatch[4];
      }

      loading.value = false
    }, 500)
  } catch (error) {
    console.error('Error fetching bus', error)
    loading.value = false
  }
}

const validateLicensePlateParts = () => {
  if (!platePart1.value || !plateLetter.value || !platePart3.value || !platePart4.value) {
    return 'تمام قسمت‌های پلاک الزامی هستند';
  }

  // Validate number parts are digits and have correct length
  if (!/^\d{2}$/.test(platePart1.value)) return 'قسمت اول پلاک باید ۲ رقم باشد';
  if (!/^\d{3}$/.test(platePart3.value)) return 'قسمت سوم پلاک باید ۳ رقم باشد';
  if (!/^\d{2}$/.test(platePart4.value)) return 'قسمت چهارم پلاک باید ۲ رقم باشد';

  // Validate letter part is in the allowed list
  if (!plateLettersOptions.includes(plateLetter.value)) return 'حرف پلاک معتبر نیست';

  // Optional: Add more complex validation for specific number ranges or combinations if needed

  return true; // Validation passed
}

const saveBus = async () => {
  // Validate license plate parts first
  const plateValidation = validateLicensePlateParts();
  if (plateValidation !== true) {
    alert(plateValidation); // Show the validation error message
    return;
  }

  // Basic validation for other fields
  if (!bus.value.driver) {
    alert('نام راننده الزامی است');
    return;
  }
  if (!bus.value.capacity || bus.value.capacity <= 0) {
     alert('ظرفیت اتوبوس الزامی و باید بیشتر از صفر باشد');
     return;
  }


  // The fullLicensePlate computed property ensures bus.value.licensePlate is updated
  console.log('Saving bus with plate:', bus.value.licensePlate);


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
              <v-label class="mb-2">شماره پلاک *</v-label>
              <div class="d-flex align-center gap-2">
                <span>ایران</span>
                <v-text-field
                  v-model="platePart1"
                  variant="outlined"
                  density="compact"
                  maxlength="2"
                  placeholder="مثال: 22"
                  :rules="[v => /^\d{2}$/.test(v) || '۲ رقم']"
                  style="max-width: 80px;"
                  type="number"
                  hide-spin-buttons
                  hide-details
                ></v-text-field>
                <span>-</span>
                <v-text-field
                  v-model="platePart3"
                  variant="outlined"
                  density="compact"
                  maxlength="3"
                  placeholder="مثال: 124"
                  :rules="[v => /^\d{3}$/.test(v) || '۳ رقم']"
                  style="max-width: 100px;"
                  type="number"
                  hide-spin-buttons
                  hide-details
                ></v-text-field>
                 <v-select
                  v-model="plateLetter"
                  :items="plateLettersOptions"
                  variant="outlined"
                  density="compact"
                  placeholder="حرف"
                  :rules="[v => !!v || 'الزامی']"
                  style="max-width: 80px;"
                  hide-details
                ></v-select>
                 <v-text-field
                  v-model="platePart4"
                  variant="outlined"
                  density="compact"
                  maxlength="2"
                  placeholder="مثال: 44"
                  :rules="[v => /^\d{2}$/.test(v) || '۲ رقم']"
                  style="max-width: 80px;"
                  type="number"
                  hide-spin-buttons
                  hide-details
                ></v-text-field>
              </div>
               <v-messages
                :value="validateLicensePlateParts() === true ? '' : validateLicensePlateParts()"
                color="error"
              ></v-messages>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="bus.busModelName"
                label="نام مدل اتوبوس"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Changed from v-select to v-text-field -->
              <v-text-field
                v-model.number="bus.capacity"
                label="ظرفیت *"
                variant="outlined"
                type="number"
                :rules="[
                  v => !!v || 'ظرفیت الزامی است',
                  v => (v && v > 0) || 'ظرفیت باید بیشتر از صفر باشد'
                ]"
                hide-spin-buttons
              ></v-text-field>
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
              :disabled="saving || validateLicensePlateParts() !== true || !bus.driver || !bus.capacity || bus.capacity <= 0"
            >
              {{ isNewBus ? 'ثبت اتوبوس' : 'بروزرسانی اتوبوس' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.gap-2 > * {
  margin: 0 4px; /* Simple gap simulation */
}
.gap-3 > * {
  margin: 0 6px; /* Simple gap simulation */
}
</style>
