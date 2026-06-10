<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore, useAccountStore } from '@/stores'
import AppHeader from '@/components/AppHeader.vue'
import StatsCard from '@/components/StatsCard.vue'
import AccountCard from '@/components/AccountCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import AccountFormModal from '@/components/AccountFormModal.vue'
import { useAccountSearch } from '@/composables'
import type { Account, AccountFormDto } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const accountStore = useAccountStore()

const { accounts, loading, error } = storeToRefs(accountStore)
const { searchQuery, filteredAccounts, stats } = useAccountSearch(accounts)

// ── modal ─────────────────────────────────────────────────────────────────────
const showModal = ref(false)
const editingAccount = ref<Account | null>(null)
const isModalSubmitting = ref(false)
const modalError = ref<string | null>(null)

// ── delete ────────────────────────────────────────────────────────────────────
const deletingId = ref<string | null>(null)

onMounted(() => accountStore.fetchAccounts())

function openCreate(): void {
  editingAccount.value = null
  modalError.value = null
  showModal.value = true
}

function openEdit(account: Account): void {
  editingAccount.value = account
  modalError.value = null
  showModal.value = true
}

function closeModal(): void {
  showModal.value = false
  editingAccount.value = null
  modalError.value = null
}

async function handleModalSubmit(data: AccountFormDto): Promise<void> {
  isModalSubmitting.value = true
  modalError.value = null
  try {
    if (editingAccount.value) {
      await accountStore.editAccount(editingAccount.value.id, data)
    } else {
      await accountStore.addAccount(data)
    }
    closeModal()
  } catch (e) {
    modalError.value = e instanceof Error ? e.message : '操作失敗'
  } finally {
    isModalSubmitting.value = false
  }
}

async function handleDelete(id: string): Promise<void> {
  if (!confirm('確定要刪除此帳號？')) return
  deletingId.value = id
  try {
    await accountStore.removeAccount(id)
  } catch (e) {
    alert(e instanceof Error ? e.message : '刪除失敗')
  } finally {
    deletingId.value = null
  }
}

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader @logout="handleLogout" />

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6">

      <!-- Search + New button -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row">
        <div class="relative flex-1">
          <svg
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="搜尋帳號（姓名、郵件、角色）..."
            class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button
          @click="openCreate"
          class="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:bg-indigo-800 sm:w-auto"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          新增帳號
        </button>
      </div>

      <!-- Stats -->
      <div class="mb-6 grid grid-cols-3 gap-4">
        <StatsCard label="總帳號數" :value="stats.total" />
        <StatsCard label="啟用中" :value="stats.active" />
        <StatsCard label="已停用" :value="stats.inactive" />
      </div>

      <!-- API fetch error -->
      <div
        v-if="error"
        class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
      >
        {{ error }}
      </div>

      <!-- Loading skeleton: 3 placeholder cards -->
      <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard v-for="i in 3" :key="i" />
      </div>

      <!-- Empty state -->
      <div
        v-else-if="filteredAccounts.length === 0"
        class="flex flex-col items-center justify-center rounded-xl bg-white py-20 text-gray-400 shadow-sm"
      >
        <svg class="mb-3 h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <p class="text-sm font-medium">
          {{ searchQuery ? '找不到符合的帳號' : '尚未建立任何帳號' }}
        </p>
        <p v-if="!searchQuery" class="mt-1 text-xs">點擊「新增帳號」開始建立</p>
      </div>

      <!-- Account cards grid -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AccountCard
          v-for="account in filteredAccounts"
          :key="account.id"
          :account="account"
          :deleting="deletingId === account.id"
          @edit="openEdit"
          @delete="handleDelete"
        />
      </div>
    </main>
  </div>

  <!-- Create / Edit modal -->
  <AccountFormModal
    v-if="showModal"
    :account="editingAccount"
    :submitting="isModalSubmitting"
    :error="modalError"
    @close="closeModal"
    @submit="handleModalSubmit"
  />
</template>
