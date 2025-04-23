<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const registerError = ref('')

async function handleSubmit() {
  // Validate form
  if (!username.value || !email.value || !password.value) {
    registerError.value = 'Please fill out all fields'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    registerError.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 6) {
    registerError.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true
  
  try {
    const success = await authStore.register(username.value, email.value, password.value)
    
    if (success) {
      // Redirect to login page
      await router.push('/login?registered=true')
    } else {
      registerError.value = authStore.error || 'Registration failed'
    }
  } catch (error) {
    registerError.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <Card class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          Create a new account
        </h1>
        <p class="mt-2 text-gray-600">
          Or
          <router-link to="/login" class="text-primary-600 hover:text-primary-500">
            sign in to your account
          </router-link>
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="registerError" class="bg-error-50 text-error-700 p-3 rounded-md text-sm mb-4">
          {{ registerError }}
        </div>
        
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div class="mt-1">
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div class="mt-1">
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div class="mt-1">
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div class="mt-1">
            <input
              id="confirm-password"
              v-model="confirmPassword"
              name="confirm-password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            :loading="loading"
            :disabled="loading"
            fullWidth
            size="lg"
          >
            Create account
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>