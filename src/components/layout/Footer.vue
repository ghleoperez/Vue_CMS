<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-gray-500 text-sm mb-4 md:mb-0">
          &copy; {{ currentYear }} Vue CMS. All rights reserved.
        </div>
        <div class="flex space-x-6">
          <a href="#" class="text-gray-500 hover:text-primary-600 transition-colors">
            Terms of Service
          </a>
          <a href="#" class="text-gray-500 hover:text-primary-600 transition-colors">
            Privacy Policy
          </a>
          <a href="#" class="text-gray-500 hover:text-primary-600 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>