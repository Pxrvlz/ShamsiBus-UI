import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Static imports for user views
import UsersView from '../views/users/UsersView.vue'
import UserFormView from '../views/users/UserFormView.vue'

// Static imports for bus views (retained as per original, consider investigating dynamic import issues)
import BusesView from '../views/buses/BusesView.vue'
import BusFormView from '../views/buses/BusFormView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/trips',
    name: 'Trips',
    component: () => import('../views/trips/TripsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/trips/new',
    name: 'NewTrip',
    component: () => import('../views/trips/TripFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/trips/:id',
    name: 'EditTrip',
    component: () => import('../views/trips/TripFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/buses',
    name: 'Buses',
    component: BusesView, // Static import
    meta: { requiresAuth: true }
  },
  {
    path: '/buses/new',
    name: 'NewBus',
    component: BusFormView, // Static import
    meta: { requiresAuth: true }
  },
  {
    path: '/buses/:id',
    name: 'EditBus',
    component: BusFormView, // Static import
    meta: { requiresAuth: true }
  },
  {
    path: '/departures',
    name: 'Departures',
    component: () => import('../views/DeparturesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersView, // Static import
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/new',
    name: 'NewUser',
    component: UserFormView, // Static import
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/:id',
    name: 'EditUser',
    component: UserFormView, // Static import
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  console.log('Navigating from:', from.fullPath, 'to:', to.fullPath); // Log navigation attempt
  const authStore = useAuthStore() // Access store here to ensure it's initialized

  const isAuthenticated = authStore.isAuthenticated // Use reactive getter
  const userRole = authStore.role // Use reactive getter

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  console.log('Auth Status:', isAuthenticated, 'Role:', userRole, 'Requires Auth:', requiresAuth, 'Requires Admin:', requiresAdmin); // Log auth/meta checks

  if (requiresAuth && !isAuthenticated) {
    console.log('Redirecting to login');
    next({ name: 'Login', query: { redirect: to.fullPath } }) // Redirect to login, pass original target
  } else if (requiresAdmin && userRole !== 'admin') {
    // User is authenticated but not an admin, redirect to dashboard or a 'Forbidden' page
    console.log('Redirecting to dashboard (Admin required)');
    next({ name: 'Dashboard' }) // Or next({ name: 'Forbidden' }) if you have such a page
  } else {
    console.log('Navigation allowed');
    next() // Allow navigation
  }
})

export default router
