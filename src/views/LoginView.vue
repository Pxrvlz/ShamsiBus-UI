<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  // Reset error message
  error.value = ''

  // Validate form
  if (!username.value || !password.value) {
    error.value = 'نام کاربری و رمز عبور الزامی است'
    return
  }

  // Show loading state
  loading.value = true

  try {
    const success = await authStore.login(username.value, password.value)

    if (success) {
      router.push('/')
    } else {
      error.value = 'نام کاربری یا رمز عبور اشتباه است'
    }
  } catch (err) {
    error.value = 'خطا در ورود به سیستم'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container d-flex align-center justify-center" style="height: 100vh">
    <v-card width="400" class="mx-auto pa-4" elevation="8">
      <v-card-title class="text-center text-h5 mb-4">
        ورود به سامانه
      </v-card-title>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
        closable
        @click:close="error = ''"
      >
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="login">
        <v-text-field
          v-model="username"
          label="نام کاربری"
          prepend-inner-icon="mdi-account"
          :disabled="loading"
          :rules="[v => !!v || 'نام کاربری الزامی است']"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="رمز عبور"
          type="password"
          prepend-inner-icon="mdi-lock"
          :disabled="loading"
          :rules="[v => !!v || 'رمز عبور الزامی است']"
        ></v-text-field>

        <v-btn
          block
          type="submit"
          :loading="loading"
          :disabled="loading"
          class="mt-4"
        >
          ورود
        </v-btn>
      </v-form>

      <div class="mt-6 text-center text-body-2">
        جهت دریافت نام کاربری و رمز عبور با مدیر سیستم تماس بگیرید
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
}
</style>
