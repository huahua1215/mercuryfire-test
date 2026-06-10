<script setup lang="ts">
import { reactive, watch } from 'vue'
import { RoleLevel, AccountStatus } from '@/types'
import type { Account, AccountFormDto } from '@/types'
import BaseInput from '@/components/BaseInput.vue'

const props = defineProps<{
  account: Account | null
  submitting?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  close: []
  submit: [data: AccountFormDto]
}>()

const form = reactive<AccountFormDto>({
  name: '',
  email: '',
  roleLevel: RoleLevel.USER,
  status: AccountStatus.ON,
})

const errors = reactive({ name: '', email: '' })

watch(
  () => props.account,
  (account) => {
    if (account) {
      form.name = account.name
      form.email = account.email
      form.roleLevel = account.roleLevel
      form.status = account.status
    } else {
      form.name = ''
      form.email = ''
      form.roleLevel = RoleLevel.USER
      form.status = AccountStatus.ON
    }
    errors.name = ''
    errors.email = ''
  },
  { immediate: true },
)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): boolean {
  errors.name = form.name.trim() ? '' : '姓名為必填'
  errors.email = !form.email
    ? '電子郵件為必填'
    : !EMAIL_REGEX.test(form.email)
      ? '電子郵件格式不正確'
      : ''
  return !errors.name && !errors.email
}

function handleSubmit(): void {
  if (!validate()) return
  emit('submit', { ...form })
}

const roleLevelOptions = [
  { value: RoleLevel.ADMIN, label: '管理員' },
  { value: RoleLevel.EDITOR, label: '編輯' },
  { value: RoleLevel.USER, label: '用戶' },
  { value: RoleLevel.CLIENT, label: '客戶' },
]

const statusOptions = [
  { value: AccountStatus.ON, label: '啟用' },
  { value: AccountStatus.OFF, label: '停用' },
]
</script>

<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 class="text-base font-semibold text-gray-800">
          {{ account ? '編輯帳號' : '新增帳號' }}
        </h2>
        <button
          type="button"
          @click="emit('close')"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-5">
        <!-- API error -->
        <div
          v-if="error"
          class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 姓名 — BaseInput (defineModel) -->
          <BaseInput
            id="modal-name"
            v-model="form.name"
            label="姓名"
            placeholder="請輸入姓名"
            required
            :error="errors.name"
            :disabled="submitting"
          />

          <!-- 電子郵件 — BaseInput (defineModel) -->
          <BaseInput
            id="modal-email"
            v-model="form.email"
            type="email"
            label="電子郵件"
            placeholder="email@example.com"
            required
            :error="errors.email"
            :disabled="submitting"
          />

          <!-- 角色 -->
          <div>
            <label for="modal-role" class="mb-1 flex items-center gap-0.5 text-sm font-medium text-gray-700">
              角色 <span class="text-red-500">*</span>
            </label>
            <select
              id="modal-role"
              v-model="form.roleLevel"
              :disabled="submitting"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50"
            >
              <option v-for="opt in roleLevelOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- 狀態 -->
          <div>
            <label for="modal-status" class="mb-1 flex items-center gap-0.5 text-sm font-medium text-gray-700">
              狀態 <span class="text-red-500">*</span>
            </label>
            <select
              id="modal-status"
              v-model="form.status"
              :disabled="submitting"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50"
            >
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="emit('close')"
              :disabled="submitting"
              class="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200 disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ submitting ? '處理中...' : account ? '儲存變更' : '新增帳號' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
