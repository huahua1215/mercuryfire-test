import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account, AccountFormDto, AccountListQuery } from '@/types'
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

  // mutation actions 不捕捉錯誤，由呼叫端（view）處理並顯示給使用者
  async function addAccount(data: AccountFormDto): Promise<Account> {
    const account = await createAccount(data)
    accounts.value.push(account)
    return account
  }

  async function editAccount(id: string, data: AccountFormDto): Promise<Account> {
    const account = await updateAccount(id, data)
    const index = accounts.value.findIndex((a) => a.id === id)
    if (index !== -1) accounts.value[index] = account
    return account
  }

  async function removeAccount(id: string): Promise<void> {
    await deleteAccount(id)
    accounts.value = accounts.value.filter((a) => a.id !== id)
  }

  return { accounts, loading, error, fetchAccounts, addAccount, editAccount, removeAccount }
})
