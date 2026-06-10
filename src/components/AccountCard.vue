<script setup lang="ts">
import { AccountStatus } from '@/types'
import type { Account } from '@/types'
import { ROLE_LABELS, formatDate } from '@/utils'

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
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <!-- Avatar + Name + Status -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">{{ account.name }}</h3>
          <span
            class="inline-block px-2 py-1 rounded-full  font-medium text-white mt-1"
            :class="account.status === AccountStatus.ON ? 'bg-green-500' : 'bg-gray-400'"
          >
            {{ account.status === AccountStatus.ON ? '啟用' : '停用' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Info rows -->
    <div class="space-y-3 mb-4  text-gray-600">
      <!-- Email -->
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 shrink-0">
          <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
          <rect x="2" y="4" width="20" height="16" rx="2" />
        </svg>
        <span class="break-all">{{ account.email }}</span>
      </div>
      <!-- Role -->
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 shrink-0">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>{{ ROLE_LABELS[account.roleLevel] }}</span>
      </div>
      <!-- Created date -->
      <div v-if="account.createdAt" class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 shrink-0">
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
        <span>{{ formatDate(account.createdAt) }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-4 border-t border-gray-200">
      <button
        @click="$emit('edit', account)"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
        </svg>
        編輯
      </button>
      <button
        @click="$emit('delete', account.id)"
        :disabled="deleting"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        {{ deleting ? '刪除中...' : '刪除' }}
      </button>
    </div>
  </div>
</template>
