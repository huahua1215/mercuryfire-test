import axios from 'axios'
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import router from '@/router'

const TOKEN_KEY = 'auth_token'

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor ──────────────────────────────────────────────────────
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 此 API 以 interviewerName header 做身份辨識，每個請求都必須帶上
  config.headers['interviewerName'] = import.meta.env.VITE_INTERVIEWER_NAME

  // Authorization Bearer — 目前為前端模擬 token，架構保留供真實 auth 系統對接。
  // NOTE: 此 API 無真正的 token 驗證機制，也無 refresh endpoint，
  //       若未來串接真實後端，於此處更新 token 邏輯即可。
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

// ── Response interceptor ─────────────────────────────────────────────────────
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status
    const serverMessage = error.response?.data?.message

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      router.push({ name: 'Login' })
      return Promise.reject(new Error('未授權，請重新登入'))
    }

    const fallbackMap: Record<number, string> = {
      403: '權限不足',
      404: '資源不存在',
      422: '資料格式錯誤',
      500: '伺服器錯誤，請稍後再試',
    }

    const message =
      serverMessage ?? (status ? (fallbackMap[status] ?? `請求失敗（${status}）`) : '網路連線異常')

    return Promise.reject(new Error(message))
  },
)

export default http
