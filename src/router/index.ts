import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Static imports for user views
import UsersView from '../views/users/UsersView.vue'
import UserFormView from '../views/users/UserFormView.vue'

// Static imports for bus views to debug dynamic import issue
import BusesView from '../views/buses/BusesView.vue'
import BusFormView from '../views/buses/BusFormView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'), // Keep dynamic for login
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'), // Keep dynamic for dashboard
    meta: { requiresAuth: true }
  },
  {
    path: '/trips',
    name: 'Trips',
    component: () => import('../views/trips/TripsView.vue'), // Keep dynamic for trips
    meta: { requiresAuth: true }
  },
  {
    path: '/trips/new',
    name: 'NewTrip',
    component: () => import('../views/trips/TripFormView.vue'), // Keep dynamic for trip form
    meta: { requiresAuth: true }
  },
  {
    path: '/trips/:id',
    name: 'EditTrip',
    component: () => import('../views/trips/TripFormView.vue'), // Keep dynamic for trip form
    meta: { requiresAuth: true }
  },
  {
    path: '/buses',
    name: 'Buses',
    component: BusesView, // Use static import
    meta: { requiresAuth: true }
  },
  {
    path: '/buses/new',
    name: 'NewBus',
    component: BusFormView, // Use static import
    meta: { requiresAuth: true }
  },
  {
    path: '/buses/:id',
    name: 'EditBus',
    component: BusFormView, // Use static import
    meta: { requiresAuth: true }
  },
  {
    path: '/departures',
    name: 'Departures',
    component: () => import('../views/DeparturesView.vue'), // Keep dynamic for departures
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersView, // Use static import
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/new',
    name: 'NewUser',
    component: UserFormView, // Use static import
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/:id',
    name: 'EditUser',
    component: UserFormView, // Use static import
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue') // Keep dynamic for not found
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  // Ensure auth state is loaded before checking
  // This might require an async check if auth state isn't immediately available
  // For simplicity, assuming authStore.isAuthenticated and authStore.role are reactive and updated
  
  if (requiresAuth && !authStore.isAuthenticated) {
    console.log('Redirecting to login, requiresAuth:', requiresAuth, 'isAuthenticated:', authStore.isAuthenticated);
    next('/login')
  } else if (requiresAdmin && authStore.role !== 'admin') {
    // Redirect non-admins trying to access admin routes to dashboard
    console.log('Redirecting to dashboard, requiresAdmin:', requiresAdmin, 'role:', authStore.role);
    next('/')
  } else {
    console.log('Allowing navigation to:', to.path);
    next()
  }
})

export default router
