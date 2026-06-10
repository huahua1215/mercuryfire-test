import { ref, computed, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { Account } from '@/types'
import { AccountStatus } from '@/types'
import { ROLE_LABELS } from '@/utils'

export function useAccountSearch(accounts: Ref<Account[]>) {
  const searchQuery = ref('')
  const debouncedQuery = ref('')
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  watch(searchQuery, (value) => {
    if (debounceTimer !== null) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = value
    }, 300)
  })

  onUnmounted(() => {
    if (debounceTimer !== null) clearTimeout(debounceTimer)
  })

  const filteredAccounts = computed(() => {
    const q = debouncedQuery.value.trim().toLowerCase()
    if (!q) return accounts.value
    return accounts.value.filter((account) => {
      const roleLabel = ROLE_LABELS[account.roleLevel].toLowerCase()
      return (
        account.name.toLowerCase().includes(q) ||
        account.email.toLowerCase().includes(q) ||
        roleLabel.includes(q)
      )
    })
  })

  const stats = computed(() => ({
    total: accounts.value.length,
    active: accounts.value.filter((a) => a.status === AccountStatus.ON).length,
    inactive: accounts.value.filter((a) => a.status === AccountStatus.OFF).length,
  }))

  return { searchQuery, filteredAccounts, stats }
}
