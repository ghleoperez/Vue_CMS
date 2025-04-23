import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Public pages
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'

// Admin pages
import Dashboard from '../views/admin/Dashboard.vue'
import ContentList from '../views/admin/content/ContentList.vue'
import ContentEdit from '../views/admin/content/ContentEdit.vue'
import ContentCreate from '../views/admin/content/ContentCreate.vue'
import MediaManager from '../views/admin/media/MediaManager.vue'
import Categories from '../views/admin/categories/Categories.vue'
import Users from '../views/admin/users/Users.vue'
import Settings from '../views/admin/settings/Settings.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public routes
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    
    // Admin routes
    {
      path: '/admin',
      name: 'admin',
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'content',
          name: 'content',
          component: ContentList
        },
        {
          path: 'content/create',
          name: 'content-create',
          component: ContentCreate
        },
        {
          path: 'content/edit/:id',
          name: 'content-edit',
          component: ContentEdit
        },
        {
          path: 'media',
          name: 'media',
          component: MediaManager
        },
        {
          path: 'categories',
          name: 'categories',
          component: Categories
        },
        {
          path: 'users',
          name: 'users',
          component: Users
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router