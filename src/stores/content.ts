import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { API_URL } from '../config'
import { useAuthStore } from './auth'

export interface Content {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  status: 'draft' | 'published'
  categoryId: string
  tags: string[]
  authorId: string
  createdAt: string
  updatedAt: string
}

export const useContentStore = defineStore('content', () => {
  const authStore = useAuthStore()
  const contents = ref<Content[]>([])
  const singleContent = ref<Content | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const publishedContents = computed(() => 
    contents.value.filter(content => content.status === 'published')
  )
  
  const draftContents = computed(() => 
    contents.value.filter(content => content.status === 'draft')
  )
  
  async function fetchContents() {
    try {
      loading.value = true
      const response = await axios.get(`${API_URL}/api/contents`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      contents.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch contents'
    } finally {
      loading.value = false
    }
  }
  
  async function fetchContentById(id: string) {
    try {
      loading.value = true
      const response = await axios.get(`${API_URL}/api/contents/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      singleContent.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch content'
    } finally {
      loading.value = false
    }
  }
  
  async function createContent(contentData: Partial<Content>) {
    try {
      loading.value = true
      const response = await axios.post(`${API_URL}/api/contents`, contentData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      contents.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create content'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateContent(id: string, contentData: Partial<Content>) {
    try {
      loading.value = true
      const response = await axios.put(`${API_URL}/api/contents/${id}`, contentData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      
      const index = contents.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contents.value[index] = response.data
      }
      
      singleContent.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update content'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteContent(id: string) {
    try {
      loading.value = true
      await axios.delete(`${API_URL}/api/contents/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      
      contents.value = contents.value.filter(c => c.id !== id)
      if (singleContent.value?.id === id) {
        singleContent.value = null
      }
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete content'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function publishContent(id: string) {
    try {
      loading.value = true
      const response = await axios.put(`${API_URL}/api/contents/${id}/publish`, {}, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      
      const index = contents.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contents.value[index] = response.data
      }
      
      if (singleContent.value?.id === id) {
        singleContent.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to publish content'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    contents,
    singleContent,
    loading,
    error,
    publishedContents,
    draftContents,
    fetchContents,
    fetchContentById,
    createContent,
    updateContent,
    deleteContent,
    publishContent
  }
})