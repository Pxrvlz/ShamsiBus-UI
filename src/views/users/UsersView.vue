<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api' // Assuming you have an API service configured
import type { User } from '../../types' // Assuming you have a User type defined

const router = useRouter()
const users = ref<User[]>([])
const loading = ref(true)
const searchQuery = ref('')
const dialog = ref(false)
const userToDelete = ref<User | null>(null)
const itemsPerPage = ref(5) // Define ref for itemsPerPage

const fetchUsers = async () => {
  loading.value = true
  try {
    // Replace with your actual API call
    // const response = await api.get('/users')
    // users.value = response.data

    // Mock data for demonstration
    setTimeout(() => {
      users.value = [
        { id: '1', username: 'admin_user', email: 'admin@example.com', role: 'admin', createdAt: new Date().toISOString() },
        { id: '2', username: 'regular_user', email: 'user@example.com', role: 'user', createdAt: new Date().toISOString() },
        { id: '3', username: 'another_user', email: 'another@example.com', role: 'user', createdAt: new Date().toISOString() },
        { id: '4', username: 'test_user_1', email: 'test1@example.com', role: 'user', createdAt: new Date().toISOString() },
        { id: '5', username: 'test_user_2', email: 'test2@example.com', role: 'user', createdAt: new Date().toISOString() },
        { id: '6', username: 'inactive_user', email: 'inactive@example.com', role: 'user', createdAt: new Date().toISOString() }, // Example for filtering/status if needed
      ]
      loading.value = false
    }, 800)
  } catch (error) {
    console.error('Error fetching users:', error)
    // Handle error appropriately, e.g., show a notification
    loading.value = false
  }
}

const getRoleText = (role: string) => {
  switch (role) {
    case 'admin': return 'مدیر سیستم'
    case 'user': return 'کاربر عادی'
    default: return 'نامشخص'
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'primary'
    case 'user': return 'info'
    default: return 'grey'
  }
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
  dialog.value = true
}

const deleteUser = async () => {
  if (!userToDelete.value) return

  try {
    // Replace with your actual API call
    // await api.delete(`/users/${userToDelete.value.id}`)

    // For demo, filter out the user
    users.value = users.value.filter(u => u.id !== userToDelete.value?.id)

    dialog.value = false
    userToDelete.value = null
    // Optionally show a success notification
  } catch (error) {
    console.error('Error deleting user:', error)
    // Handle error appropriately, e.g., show a notification
    dialog.value = false // Close dialog even on error, or handle differently
  }
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value

  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    getRoleText(user.role).toLowerCase().includes(query)
  )
})

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  try {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    return 'تاریخ نامعتبر'
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4">مدیریت کاربران</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="router.push('/users/new')"
      >
        کاربر جدید
      </v-btn>
    </div>

    <v-card elevation="2">
      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          label="جستجو در کاربران"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          class="mb-4"
        ></v-text-field>

        <v-data-table-server
          v-model:items-per-page="itemsPerPage"  
          :headers="[
            { title: 'نام کاربری', key: 'username' },
            { title: 'ایمیل', key: 'email' },
            { title: 'نقش', key: 'role' },
            { title: 'تاریخ عضویت', key: 'createdAt' },
            { title: 'عملیات', key: 'actions', sortable: false, align: 'center' }
          ]"
          :items="filteredUsers"
          :loading="loading"
          loading-text="در حال بارگذاری اطلاعات کاربران..."
          no-data-text="هیچ کاربری یافت نشد"
          class="users-table elevation-1"
          items-per-page-text="تعداد در صفحه"
        >
          <template v-slot:item.role="{ item }">
            <v-chip
              :color="getRoleColor(item.role)"
              size="small"
              label
            >
              {{ getRoleText(item.role) }}
            </v-chip>
          </template>

          <template v-slot:item.createdAt="{ item }">
            <span>{{ formatDate(item.createdAt) }}</span>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center gap-1">
              <v-tooltip text="ویرایش کاربر">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    size="small"
                    variant="text"
                    color="info"
                    @click="router.push(`/users/${item.id}`)"
                    :disabled="item.role === 'admin'" 
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="حذف کاربر">
                 <template v-slot:activator="{ props }">
                   <v-btn
                     v-bind="props"
                     icon
                     size="small"
                     variant="text"
                     color="error"
                     @click="confirmDelete(item)"
                     :disabled="item.role === 'admin'" 
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

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 error--text">
          <v-icon start color="error">mdi-alert-circle-outline</v-icon>
          تایید حذف کاربر
        </v-card-title>

        <v-card-text>
          <p>آیا از حذف کاربر <strong>{{ userToDelete?.username }}</strong> ({{ userToDelete?.email }}) مطمئن هستید؟</p>
          <p class="mt-2 text-caption error--text">این عملیات قابل بازگشت نیست.</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="dialog = false">
            انصراف
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deleteUser">
            حذف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.users-table {
  width: 100%;
}
.gap-1 > * {
  margin: 0 2px; /* Simple gap simulation */
}
</style>
