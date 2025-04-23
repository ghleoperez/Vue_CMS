<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const isLoggedIn = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

async function logout() {
  authStore.logout()
  await router.push('/login')
}
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-primary-600 font-bold text-xl">
              Vue CMS
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link 
              to="/" 
              class="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-primary-500 text-primary-600"
            >
              Home
            </router-link>
            
            <template v-if="isLoggedIn && isAdmin">
              <router-link 
                to="/admin" 
                class="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-primary-600"
              >
                Dashboard
              </router-link>
            </template>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div v-if="isLoggedIn" class="ml-3 relative">
            <div class="flex items-center space-x-4">
              <button
                v-if="isAdmin"
                @click="router.push('/admin/content/create')"
                class="btn-primary"
              >
                Create Content
              </button>
              <button
                @click="logout"
                class="btn-outline"
              >
                Logout
              </button>
            </div>
          </div>
          <div v-else class="flex items-center space-x-4">
            <router-link to="/login" class="btn-outline">
              Login
            </router-link>
            <router-link to="/register" class="btn-primary">
              Register
            </router-link>
          </div>
        </div>
        
        <div class="-mr-2 flex items-center sm:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                v-if="mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="text-gray-500 hover:bg-gray-50 hover:text-primary-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
          active-class="bg-primary-50 border-primary-500 text-primary-700"
          @click="mobileMenuOpen = false"
        >
          Home
        </router-link>
        
        <template v-if="isLoggedIn && isAdmin">
          <router-link
            to="/admin"
            class="text-gray-500 hover:bg-gray-50 hover:text-primary-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            active-class="bg-primary-50 border-primary-500 text-primary-700"
            @click="mobileMenuOpen = false"
          >
            Dashboard
          </router-link>
        </template>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div v-if="isLoggedIn" class="flex items-center px-4 space-y-2">
          <button
            v-if="isAdmin"
            @click="router.push('/admin/content/create'); mobileMenuOpen = false"
            class="btn-primary w-full mb-2"
          >
            Create Content
          </button>
          <button
            @click="logout"
            class="btn-outline w-full"
          >
            Logout
          </button>
        </div>
        <div v-else class="px-4 space-y-2">
          <router-link to="/login" class="btn-outline block text-center w-full mb-2" @click="mobileMenuOpen = false">
            Login
          </router-link>
          <router-link to="/register" class="btn-primary block text-center w-full" @click="mobileMenuOpen = false">
            Register
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>