<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api'
import type { Bus } from '../../types'

const router = useRouter()
const buses = ref<Bus[]>([])
const loading = ref(true)
const searchQuery = ref('')
const dialog = ref(false)
const busToDelete = ref<Bus | null>(null)
const itemsPerPage = ref(5) // Define ref for itemsPerPage

const fetchBuses = async () => {
  loading.value = true
  try {
    // In a real app, this would fetch from the API
    // const response = await api.get('/buses')
    // buses.value = response.data

    // Mock data
    setTimeout(() => {
      buses.value = [
        { id: 101, licensePlate: 'ایران 22 - 124ع44', capacity: 44, driver: 'علی رضایی', status: 'active' },
        { id: 103, licensePlate: 'ایران 11 - 587ب32', capacity: 44, driver: 'محمد حسینی', status: 'active' },
        { id: 105, licensePlate: 'ایران 22 - 745ج18', capacity: 44, driver: 'رضا کریمی', status: 'active' },
        { id: 107, licensePlate: 'ایران 13 - 362د77', capacity: 38, driver: 'حسن محمدی', status: 'maintenance' },
        { id: 109, licensePlate: 'ایران 22 - 918ه55', capacity: 44, driver: 'کاظم علوی', status: 'active' }
      ]
      loading.value = false
    }, 800)
  } catch (error) {
    console.error('Error fetching buses', error)
    loading.value = false // Ensure loading stops on error
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'maintenance': return 'warning'
    case 'inactive': return 'error'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'فعال'
    case 'maintenance': return 'تعمیرات'
    case 'inactive': return 'غیرفعال'
    default: return 'نامشخص'
  }
}

const confirmDelete = (bus: Bus) => {
  busToDelete.value = bus
  dialog.value = true
}

const deleteBus = async () => {
  if (!busToDelete.value) return

  try {
    // In a real app, this would call the API
    // await api.delete(`/buses/${busToDelete.value.id}`)

    // For demo, we'll filter out the bus from our array
    buses.value = buses.value.filter(b => b.id !== busToDelete.value?.id)

    dialog.value = false
    busToDelete.value = null
    // Optionally show a success notification
  } catch (error) {
    console.error('Error deleting bus', error)
    // Optionally show an error notification
    dialog.value = false // Close dialog even on error
  }
}

const filteredBuses = computed(() => {
  if (!searchQuery.value) return buses.value

  const query = searchQuery.value.toLowerCase()
  // Ensure properties exist before calling toLowerCase or toString
  return buses.value.filter(bus =>
    (bus.licensePlate?.toLowerCase() ?? '').includes(query) ||
    (bus.driver?.toLowerCase() ?? '').includes(query) ||
    (bus.capacity?.toString() ?? '').includes(query)
  )
})

onMounted(() => {
  fetchBuses()
})
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4">مدیریت اتوبوس‌ها</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="router.push('/buses/new')"
      >
        اتوبوس جدید
      </v-btn>
    </div>

    <v-card elevation="2">
      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          label="جستجو در اتوبوس‌ها"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          class="mb-4"
        ></v-text-field>

        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="[
            { title: 'شماره پلاک', key: 'licensePlate', sortable: true },
            { title: 'ظرفیت', key: 'capacity', sortable: true },
            { title: 'راننده', key: 'driver', sortable: true },
            { title: 'وضعیت', key: 'status', sortable: true },
            { title: 'عملیات', key: 'actions', sortable: false, align: 'center' }
          ]"
          :items="filteredBuses"
          :loading="loading"
          loading-text="در حال بارگذاری اطلاعات..."
          no-data-text="هیچ اتوبوسی یافت نشد"
          class="buses-table elevation-1"
          items-per-page-text="تعداد در صفحه"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              label
              text-color="white"
            >
              {{ getStatusText(item.status) }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center gap-1">
              <v-tooltip text="ویرایش اتوبوس">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    size="small"
                    variant="text"
                    color="info"
                    @click="router.push(`/buses/${item.id}`)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="حذف اتوبوس">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click="confirmDelete(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>

          <template v-slot:loading>
             <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
           </template>

        </v-data-table-server>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 error--text">
           <v-icon start color="error">mdi-alert-circle-outline</v-icon>
           تایید حذف اتوبوس
        </v-card-title>

        <v-card-text>
          <p>آیا از حذف اتوبوس با پلاک <strong>{{ busToDelete?.licensePlate }}</strong> مطمئن هستید؟</p>
          <p>راننده: {{ busToDelete?.driver }}</p>
          <p class="mt-2 text-caption error--text">این عملیات قابل بازگشت نیست.</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="dialog = false">
            انصراف
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deleteBus">
            حذف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.buses-table {
  width: 100%;
}
.gap-1 > * {
  margin: 0 2px; /* Simple gap simulation */
}
</style>
