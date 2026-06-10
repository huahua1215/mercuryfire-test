<script setup lang="ts">
import { reactive, watch } from 'vue'
import { RoleLevel, AccountStatus } from '@/types'
import type { Account, AccountFormDto } from '@/types'

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

// 編輯模式時把現有資料填入表單
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
    ? 'Email 為必填'
    : !EMAIL_REGEX.test(form.email)
      ? 'Email 格式不正確'
      : ''
  return !errors.name && !errors.email
}

function handleSubmit(): void {
  if (!validate()) return
  emit('submit', { ...form })
}
</script>

<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <!-- Title -->
      <h2 class="mb-5 text-lg font-bold text-gray-800">
        {{ account ? '編輯帳號' : '新增帳號' }}
      </h2>

      <!-- API error from parent -->
      <div v-if="error" class="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Name -->
        <div class="mb-4">
          <label class="mb-1 block text-sm font-medium text-gray-700">姓名</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="請輸入姓名"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
            :class="errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@email.com"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
            :class="errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <!-- Role Level -->
        <div class="mb-4">
          <label class="mb-1 block text-sm font-medium text-gray-700">角色</label>
          <select
            v-model="form.roleLevel"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="RoleLevel.ADMIN">Admin</option>
            <option :value="RoleLevel.EDITOR">Editor</option>
            <option :value="RoleLevel.USER">User</option>
            <option :value="RoleLevel.CLIENT">Client</option>
          </select>
        </div>

        <!-- Status -->
        <div class="mb-6">
          <label class="mb-1 block text-sm font-medium text-gray-700">狀態</label>
          <select
            v-model="form.status"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="AccountStatus.ON">啟用</option>
            <option :value="AccountStatus.OFF">停用</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="emit('close')"
            :disabled="submitting"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ submitting ? '處理中...' : account ? '儲存' : '新增' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
