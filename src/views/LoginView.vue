<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import type { LoginForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<LoginForm>({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const isSubmitting = ref(false)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): boolean {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email 為必填'
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'Email 格式不正確'
  }

  if (!form.password) {
    errors.password = '密碼為必填'
  }

  return !errors.email && !errors.password
}

async function handleSubmit(): Promise<void> {
  if (!validate()) return
  isSubmitting.value = true
  // 模擬非同步延遲（此 API 無真實登入端點）
  await new Promise((resolve) => setTimeout(resolve, 300))
  authStore.login(form.email)
  isSubmitting.value = false
  router.push({ name: 'Accounts' })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
      <h1 class="mb-2 text-center text-2xl font-bold text-gray-800">帳號管理系統</h1>
      <p class="mb-8 text-center text-sm text-gray-400">請登入以繼續</p>

      <form @submit.prevent="handleSubmit" novalidate>
        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="example@email.com"
            autocomplete="email"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
            :class="errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div class="mb-7">
          <label for="password" class="mb-1 block text-sm font-medium text-gray-700">密碼</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="請輸入密碼"
            autocomplete="current-password"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
            :class="errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting ? '登入中...' : '登入' }}
        </button>
      </form>
    </div>
  </div>
</template>
