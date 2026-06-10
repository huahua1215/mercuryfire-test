<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import type { LoginForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<LoginForm>({ email: '', password: '' })
const isSubmitting = ref(false)
const rememberMe = ref(false)

async function handleSubmit(): Promise<void> {
  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 300))
  authStore.login(form.email)
  isSubmitting.value = false
  router.push({ name: 'Accounts' })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10">

        <!-- Top section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-white">
              <path d="m10 17 5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            </svg>
          </div>
          <h1 class="font-bold text-gray-900 mb-2">歡迎回來</h1>
          <p class="text-gray-600">請登入您的帳號以繼續</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">

          <!-- 電子郵件 -->
          <div>
            <label for="email" class="block text-gray-700 mb-2">電子郵件</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400">
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                autocomplete="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- 密碼 -->
          <div>
            <label for="password" class="block text-gray-700 mb-2">密碼</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- 記住我 + 忘記密碼 -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-gray-700">記住我</span>
            </label>
            <button type="button" class="text-indigo-600 hover:text-indigo-700">
              忘記密碼？
            </button>
          </div>

          <!-- 登入按鈕 -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <path d="m10 17 5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            </svg>
            {{ isSubmitting ? '登入中...' : '登入' }}
          </button>

          <!-- 提示框 -->
          <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-blue-800 text-center">💡 提示：輸入任意電子郵件和密碼即可登入</p>
          </div>

        </form>
      </div>

      <!-- 還沒有帳號 -->
      <p class="text-center mt-6 text-gray-600">
        還沒有帳號？
        <button type="button" class="text-indigo-600 hover:text-indigo-700">
          立即註冊
        </button>
      </p>

    </div>
  </div>
</template>
