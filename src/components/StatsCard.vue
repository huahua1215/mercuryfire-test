<script setup lang="ts">
defineProps<{
  label: string
  value: number
}>()
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <p class="text-gray-600 mb-1">{{ label }}</p>
    <p class="text-gray-900">{{ value }}</p>
  </div>
</template>
