<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  iconLeft?: string
  iconRight?: string
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  fullWidth: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const buttonClass = computed(() => {
  const classes = ['btn']
  
  // Variant
  switch (props.variant) {
    case 'primary':
      classes.push('bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500')
      break
    case 'secondary':
      classes.push('bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500')
      break
    case 'accent':
      classes.push('bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500')
      break
    case 'outline':
      classes.push('bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500')
      break
    case 'danger':
      classes.push('bg-error-600 text-white hover:bg-error-700 focus:ring-error-500')
      break
  }
  
  // Size
  switch (props.size) {
    case 'sm':
      classes.push('px-3 py-1.5 text-xs')
      break
    case 'md':
      classes.push('px-4 py-2 text-sm')
      break
    case 'lg':
      classes.push('px-6 py-3 text-base')
      break
  }
  
  // Full width
  if (props.fullWidth) {
    classes.push('w-full')
  }
  
  // Disabled
  if (props.disabled || props.loading) {
    classes.push('opacity-50 cursor-not-allowed')
  }
  
  return classes.join(' ')
})

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="buttonClass"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <span v-else-if="iconLeft" class="mr-2">
      <slot name="icon-left" />
    </span>
    <slot />
    <span v-if="iconRight && !loading" class="ml-2">
      <slot name="icon-right" />
    </span>
  </button>
</template>