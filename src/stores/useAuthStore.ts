import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const isAuthenticated = computed(() => token.value !== null)

  function login(email: string): void {
    // 此 API 無真實登入端點，以前端模擬 token 代替。
    // 身份辨識由 axios request interceptor 的 interviewerName header 負責。
    const mockToken = btoa(`mock:${email}:${Date.now()}`)
    token.value = mockToken
    localStorage.setItem(TOKEN_KEY, mockToken)
  }

  function logout(): void {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return { token, isAuthenticated, login, logout }
})
