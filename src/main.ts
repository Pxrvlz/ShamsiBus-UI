import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css' // Import global styles AFTER font link in index.html

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fa } from 'vuetify/locale' // Persian locale
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // Ensure MDI font CSS is imported

// RTL setup for Vuetify
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi } // Ensure mdi icon set is configured
  },
  locale: {
    locale: 'fa', // Set default locale to Persian
    fallback: 'en', // Fallback locale
    messages: { fa } // Provide Persian messages
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2', // Blue
          secondary: '#00796B', // Teal
          accent: '#FFC107', // Amber
          error: '#F44336', // Red
          warning: '#FF9800', // Orange
          info: '#2196F3', // Light Blue
          success: '#4CAF50', // Green
          background: '#F5F5F5' // Light Grey Background
        }
      }
      // You can define a 'dark' theme here as well if needed
    }
  },
  defaults: {
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    VBtn: {
      color: 'primary',
      variant: 'elevated' // Changed from flat for better visibility
    },
    VListItem: {
      density: 'compact' // Make list items a bit smaller
    }
  },
  rtl: true // Enable RTL globally
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
