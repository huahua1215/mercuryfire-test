<script setup lang="ts">
import { AccountStatus } from '@/types'
import type { Account } from '@/types'
import { ROLE_LABELS } from '@/utils'

defineProps<{
  account: Account
  deleting?: boolean
}>()

defineEmits<{
  edit: [account: Account]
  delete: [id: string]
}>()
</script>

<template>
  <div class="flex flex-col rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
    <!-- Avatar + Name + Status -->
    <div class="mb-4 flex items-start gap-3">
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500"
      >
        <!-- person icon -->
        <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      <div>
        <p class="font-semibold text-gray-900">{{ account.name }}</p>
        <span
          class="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
          :class="account.status === AccountStatus.ON ? 'bg-green-500' : 'bg-gray-400'"
        >
          {{ account.status === AccountStatus.ON ? '啟用' : '停用' }}
        </span>
      </div>
    </div>

    <!-- Info rows -->
    <div class="flex-1 space-y-2.5 text-sm text-gray-600">
      <!-- Email -->
      <div class="flex items-center gap-2">
        <svg class="h-4 w-4 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
        <span class="truncate">{{ account.email }}</span>
      </div>
      <!-- Role -->
      <div class="flex items-center gap-2">
        <svg class="h-4 w-4 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <span>{{ ROLE_LABELS[account.roleLevel] }}</span>
      </div>
      <!-- Created date (optional — shown if API returns it) -->
      <div v-if="account.createdAt" class="flex items-center gap-2">
        <svg class="h-4 w-4 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
        </svg>
        <span>{{ account.createdAt }}</span>
      </div>
    </div>

    <!-- Divider + Actions -->
    <div class="mt-4 border-t border-gray-100 pt-4">
      <div class="flex gap-2">
        <button
          @click="$emit('edit', account)"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-50 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
        >
          <!-- pencil icon -->
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          編輯
        </button>
        <button
          @click="$emit('delete', account.id)"
          :disabled="deleting"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-50 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <!-- trash icon -->
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
          {{ deleting ? '刪除中...' : '刪除' }}
        </button>
      </div>
    </div>
  </div>
</template>
