<script setup lang="ts">
const model = defineModel<string>({ default: '' })

defineProps<{
  type?: string
  placeholder?: string
  label?: string
  error?: string
  id?: string
  autocomplete?: string
  disabled?: boolean
}>()
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="model"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      class="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50"
      :class="error ? 'border-red-400 bg-red-50' : 'border-gray-300'"
    />
    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>
