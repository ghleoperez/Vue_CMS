<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useContentStore } from '../stores/content'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const contentStore = useContentStore()
const { publishedContents, loading, error } = contentStore

onMounted(async () => {
  await contentStore.fetchContents()
})
</script>

<template>
  <div>
    <!-- Hero section -->
    <section class="bg-primary-700 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-4 animate-slide-up">
            Welcome to Vue CMS
          </h1>
          <p class="text-xl text-primary-100 max-w-3xl mx-auto mb-8 animate-slide-up">
            A modern content management system built with Vue and Express
          </p>
          <div class="flex justify-center space-x-4 animate-slide-up">
            <Button
              variant="secondary"
              size="lg"
              @click="$router.push('/register')"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              @click="$router.push('/login')"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Key Features
          </h2>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Everything you need to manage your content efficiently
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hover>
            <div class="text-center">
              <div class="bg-primary-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Content Management</h3>
              <p class="text-gray-600">
                Create, edit, and publish content with ease. Organize with categories and tags.
              </p>
            </div>
          </Card>

          <Card hover>
            <div class="text-center">
              <div class="bg-secondary-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Media Management</h3>
              <p class="text-gray-600">
                Upload, organize and manage images and files in an intuitive interface.
              </p>
            </div>
          </Card>

          <Card hover>
            <div class="text-center">
              <div class="bg-accent-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">User Authentication</h3>
              <p class="text-gray-600">
                Secure user authentication and role-based access control.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Recent content section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Recent Content
          </h2>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Check out our latest published content
          </p>
        </div>

        <div v-if="loading" class="text-center py-12">
          <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-error-600">{{ error }}</p>
        </div>

        <div v-else-if="publishedContents.length === 0" class="text-center py-12">
          <p class="text-gray-500">No content available yet.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card 
            v-for="content in publishedContents.slice(0, 6)" 
            :key="content.id"
            hover
          >
            <div>
              <img 
                v-if="content.featuredImage" 
                :src="content.featuredImage" 
                :alt="content.title" 
                class="w-full h-48 object-cover"
              />
              <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                No image
              </div>
              <h3 class="text-xl font-bold text-gray-900 mt-4 mb-2">
                {{ content.title }}
              </h3>
              <p class="text-gray-600 mb-4">
                {{ content.excerpt || content.content.substring(0, 100) + '...' }}
              </p>
              <Button variant="outline" @click="$router.push(`/content/${content.id}`)">
                Read More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>