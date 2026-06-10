import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AccountFormDto, AccountListQuery } from '@/types'
import { getAccounts, createAccount, updateAccount, deleteAccount } from '@/api'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAccounts(query?: AccountListQuery): Promise<void> {
    loading.value = true
    error.value = null
    try {
      accounts.value = await getAccounts(query)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '載入帳號列表失敗'
    } finally {
      loading.value = false
    }
  }

  // mutation actions 不捕捉錯誤，由呼叫端（view）處理並顯示給使用者。
  // create / edit 後重新 fetch，確保顯示的是 server 回傳的完整資料，
  // 避免因 API response schema 未定義而導致欄位對不上的問題。
  async function addAccount(data: AccountFormDto): Promise<void> {
    await createAccount(data)
    await fetchAccounts()
  }

  async function editAccount(id: string, data: AccountFormDto): Promise<void> {
    await updateAccount(id, data)
    await fetchAccounts()
  }

  async function removeAccount(id: string): Promise<void> {
    await deleteAccount(id)
    accounts.value = accounts.value.filter((a) => a.id !== id)
  }

  return { accounts, loading, error, fetchAccounts, addAccount, editAccount, removeAccount }
})
