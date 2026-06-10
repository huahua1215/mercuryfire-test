<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore, useAccountStore } from '@/stores'
import AppHeader from '@/components/AppHeader.vue'
import StatsCard from '@/components/StatsCard.vue'
import AccountCard from '@/components/AccountCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import AccountFormModal from '@/components/AccountFormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useAccountSearch } from '@/composables'
import type { Account, AccountFormDto } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const accountStore = useAccountStore()

const { accounts, loading, error } = storeToRefs(accountStore)
const { searchQuery, filteredAccounts, stats } = useAccountSearch(accounts)

// ── form modal ────────────────────────────────────────────────────────────────
const showModal = ref(false)
const editingAccount = ref<Account | null>(null)
const isModalSubmitting = ref(false)
const modalError = ref<string | null>(null)

// ── delete confirm modal ──────────────────────────────────────────────────────
const pendingDeleteId = ref<string | null>(null)
const pendingDeleteName = computed(
  () => accounts.value.find((a) => a.id === pendingDeleteId.value)?.name ?? '',
)
const deletingId = ref<string | null>(null)

onMounted(() => accountStore.fetchAccounts())

// ── form modal handlers ───────────────────────────────────────────────────────
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

// ── delete handlers ───────────────────────────────────────────────────────────
function requestDelete(id: string): void {
  pendingDeleteId.value = id
}

async function confirmDelete(): Promise<void> {
  const id = pendingDeleteId.value
  pendingDeleteId.value = null
  if (!id) return
  deletingId.value = id
  try {
    await accountStore.removeAccount(id)
  } catch (e) {
    alert(e instanceof Error ? e.message : '刪除失敗')
  } finally {
    deletingId.value = null
  }
}

function cancelDelete(): void {
  pendingDeleteId.value = null
}

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader @logout="handleLogout" />

    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      <!-- Search + New button -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400">
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="搜尋帳號（姓名、郵件、角色）..."
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <button
          @click="openCreate"
          class="flex font-bold items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200 whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          新增帳號
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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

      <!-- Loading skeleton -->
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
      <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AccountCard
          v-for="account in filteredAccounts"
          :key="account.id"
          :account="account"
          :deleting="deletingId === account.id"
          @edit="openEdit"
          @delete="requestDelete"
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

  <!-- Delete confirmation modal -->
  <ConfirmModal
    v-if="pendingDeleteId"
    :message="`確定要刪除帳號「${pendingDeleteName}」嗎？`"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
