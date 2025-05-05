<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api'
import type { User } from '../../types'

const route = useRoute()
const router = useRouter()
const isNewUser = computed(() => route.name === 'NewUser')
const loading = ref(false)
const saving = ref(false)
const userId = computed(() => route.params.id as string)

const user = ref<User & { password?: string }>({
  id: 0,
  username: '',
  role: 'operator',
  lastLogin: '-',
  password: ''
})

// Role options
const roleOptions = [
  { value: 'admin', text: 'مدیر سیستم' },
  { value: 'operator', text: 'اپراتور' }
]

const fetchUser = async () => {
  if (isNewUser.value) return
  
  loading.value = true
  try {
    // In a real app, this would fetch from the API
    // const response = await api.get(`/users/${userId.value}`)
    // user.value = { ...response.data, password: '' }  // Password field empty when editing
    
    // Mock data for demo
    setTimeout(() => {
      user.value = {
        id: parseInt(userId.value),
        username: 'operator1',
        role: 'operator',
        lastLogin: '1404/06/10 09:15',
        password: '1'  // Password field is empty when editing
      }
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('Error fetching user', error)
    loading.value = false
  }
}

const saveUser = async () => {
  // Basic validation
  if (!user.value.username) {
    alert('نام کاربری الزامی است')
    return
  }
  
  if (isNewUser.value && !user.value.password) {
    alert('رمز عبور الزامی است')
    return
  }
  
  saving.value = true
  try {
    // Remove password if it's empty (for editing existing users)
    const userData = { ...user.value }
    if (!userData.password) {
      delete userData.password
    }
    
    if (isNewUser.value) {
      // In a real app, this would be an API call
      // await api.post('/users', userData)
      console.log('Creating new user:', userData)
    } else {
      // In a real app, this would be an API call
      // await api.put(`/users/${userId.value}`, userData)
      console.log('Updating user:', userData)
    }
    
    // Redirect to users list
    router.push('/users')
  } catch (error) {
    console.error('Error saving user', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4">{{ isNewUser ? 'افزودن کاربر جدید' : 'ویرایش کاربر' }}</h1>
      <v-btn 
        color="secondary" 
        prepend-icon="mdi-arrow-left" 
        @click="router.push('/users')"
      >
        بازگشت به لیست کاربران
      </v-btn>
    </div>
    
    <v-card elevation="2">
      <v-card-text>
        <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
        
        <v-form v-else @submit.prevent="saveUser">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.username"
                label="نام کاربری *"
                variant="outlined"
                :rules="[v => !!v || 'نام کاربری الزامی است']"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="user.role"
                :items="roleOptions"
                item-title="text"
                item-value="value"
                label="نقش کاربر *"
                variant="outlined"
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.password"
                label="رمز عبور"
                type="password"
                variant="outlined"
                :rules="[v => isNewUser ? !!v || 'رمز عبور الزامی است' : true]"
                :hint="isNewUser ? 'رمز عبور الزامی است' : 'در صورت تغییر رمز عبور، آن را وارد کنید'"
                persistent-hint
              ></v-text-field>
            </v-col>
            
            <v-col v-if="!isNewUser" cols="12" md="6">
              <v-text-field
                v-model="user.lastLogin"
                label="آخرین ورود"
                variant="outlined"
                disabled
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          
          <div class="d-flex justify-end gap-3 mt-4">
            <v-btn
              color="error"
              variant="outlined"
              @click="router.push('/users')"
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
              {{ isNewUser ? 'افزودن کاربر' : 'بروزرسانی کاربر' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
