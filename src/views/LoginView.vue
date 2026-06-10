<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import BaseInput from '@/components/BaseInput.vue'
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
  <div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
      <!-- Header -->
      <div class="mb-8 flex flex-col items-center gap-3">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500">
          <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900">帳號管理系統</h1>
          <p class="mt-1 text-sm text-gray-400">請登入以繼續</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
        <!-- Email — uses BaseInput (defineModel) -->
        <BaseInput
          id="login-email"
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="example@email.com"
          autocomplete="email"
          :error="errors.email"
          :disabled="isSubmitting"
        />

        <!-- Password — uses BaseInput (defineModel) -->
        <BaseInput
          id="login-password"
          v-model="form.password"
          type="password"
          label="密碼"
          placeholder="請輸入密碼"
          autocomplete="current-password"
          :error="errors.password"
          :disabled="isSubmitting"
        />

        <button
          type="submit"
          :disabled="isSubmitting"
          class="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting ? '登入中...' : '登入' }}
        </button>
      </form>
    </div>
  </div>
</template>
