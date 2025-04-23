import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { API_URL } from '../config'

export interface User {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  // Initialize user data from token
  if (token.value) {
    loadUser()
  }
  
  async function loadUser() {
    try {
      loading.value = true
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      user.value = response.data
    } catch (err) {
      logout()
    } finally {
      loading.value = false
    }
  }
  
  async function login(email: string, password: string) {
    try {
      loading.value = true
      error.value = null
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      })
      
      token.value = response.data.token
      localStorage.setItem('token', token.value)
      
      await loadUser()
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function register(username: string, email: string, password: string) {
    try {
      loading.value = true
      error.value = null
      
      await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password
      })
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }
  
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }
  
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    loadUser
  }
})