<script setup lang="ts">
defineProps<{
  message: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
    <div class="w-full max-w-xs rounded-lg bg-white p-5 shadow-xl">
      <p class="text-sm leading-relaxed text-gray-800">{{ message }}</p>
      <div class="mt-5 flex justify-end gap-2">
        <button
          @click="emit('cancel')"
          class="rounded-md px-4 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          {{ cancelText ?? '取消' }}
        </button>
        <button
          @click="emit('confirm')"
          class="rounded-md bg-gray-800 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-900"
        >
          {{ confirmText ?? '確定' }}
        </button>
      </div>
    </div>
  </div>
</template>
