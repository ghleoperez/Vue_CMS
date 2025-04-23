<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>(), {
  hover: true,
  padding: 'md'
})

const cardClasses = computed(() => {
  const classes = ['bg-white rounded-lg shadow-card overflow-hidden']
  
  if (props.hover) {
    classes.push('transition-shadow duration-200 hover:shadow-card-hover')
  }
  
  return classes.join(' ')
})

const paddingClasses = computed(() => {
  switch (props.padding) {
    case 'none': return ''
    case 'sm': return 'p-3'
    case 'md': return 'p-5'
    case 'lg': return 'p-8'
    default: return 'p-5'
  }
})
</script>

<template>
  <div :class="cardClasses">
    <slot name="header"></slot>
    <div :class="paddingClasses">
      <slot></slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>