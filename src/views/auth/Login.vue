<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const loginError = ref('')

async function handleSubmit() {
  if (!email.value || !password.value) {
    loginError.value = 'Please enter both email and password'
    return
  }

  loading.value = true
  
  try {
    const success = await authStore.login(email.value, password.value)
    
    if (success) {
      const redirectPath = route.query.redirect?.toString() || '/admin'
      await router.push(redirectPath)
    } else {
      loginError.value = authStore.error || 'Invalid credentials'
    }
  } catch (error) {
    loginError.value = 'An error occurred. Please try again.'
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
          Sign in to your account
        </h1>
        <p class="mt-2 text-gray-600">
          Or
          <router-link to="/register" class="text-primary-600 hover:text-primary-500">
            create a new account
          </router-link>
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="loginError" class="bg-error-50 text-error-700 p-3 rounded-md text-sm mb-4">
          {{ loginError }}
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
              autocomplete="current-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </a>
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
            Sign in
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>