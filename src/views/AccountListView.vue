<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useAccountStore } from '@/stores'
import AccountFormModal from '@/components/AccountFormModal.vue'
import { RoleLevel, AccountStatus } from '@/types'
import type { Account, AccountFormDto, AccountListQuery } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const accountStore = useAccountStore()

// ── modal state ───────────────────────────────────────────────────────────────
const showModal = ref(false)
const editingAccount = ref<Account | null>(null)
const isModalSubmitting = ref(false)
const modalError = ref<string | null>(null)

// ── delete state ──────────────────────────────────────────────────────────────
const deletingId = ref<string | null>(null)

// ── filter ────────────────────────────────────────────────────────────────────
const filterQuery = reactive<AccountListQuery>({ name: '', email: '' })

onMounted(() => accountStore.fetchAccounts())

// ── handlers ──────────────────────────────────────────────────────────────────
function openCreate() {
  editingAccount.value = null
  modalError.value = null
  showModal.value = true
}

function openEdit(account: Account) {
  editingAccount.value = account
  modalError.value = null
  showModal.value = true
}

function closeModal() {
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

async function handleSearch(): Promise<void> {
  await accountStore.fetchAccounts({ ...filterQuery })
}

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'Login' })
}

// ── display maps ──────────────────────────────────────────────────────────────
const roleLevelLabels: Record<RoleLevel, string> = {
  [RoleLevel.ADMIN]: 'Admin',
  [RoleLevel.EDITOR]: 'Editor',
  [RoleLevel.USER]: 'User',
  [RoleLevel.CLIENT]: 'Client',
}

const statusLabels: Record<AccountStatus, string> = {
  [AccountStatus.ON]: '啟用',
  [AccountStatus.OFF]: '停用',
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <h1 class="text-xl font-bold text-gray-800">帳號管理</h1>
        <button
          @click="handleLogout"
          class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 transition hover:bg-gray-50"
        >
          登出
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-6 py-8">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center gap-3">
        <input
          v-model="filterQuery.name"
          placeholder="搜尋姓名"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="handleSearch"
        />
        <input
          v-model="filterQuery.email"
          placeholder="搜尋 Email"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="handleSearch"
        />
        <button
          @click="handleSearch"
          class="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          搜尋
        </button>
        <button
          @click="openCreate"
          class="ml-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          ＋ 新增帳號
        </button>
      </div>

      <!-- Fetch error -->
      <div
        v-if="accountStore.error"
        class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
      >
        {{ accountStore.error }}
      </div>

      <!-- Loading skeleton -->
      <div v-if="accountStore.loading" class="py-20 text-center text-sm text-gray-400">
        載入中...
      </div>

      <!-- Table -->
      <div v-else class="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th class="px-5 py-3">姓名</th>
              <th class="px-5 py-3">Email</th>
              <th class="px-5 py-3">角色</th>
              <th class="px-5 py-3">狀態</th>
              <th class="px-5 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="accountStore.accounts.length === 0">
              <td colspan="5" class="py-16 text-center text-gray-400">暫無資料</td>
            </tr>
            <tr
              v-for="account in accountStore.accounts"
              :key="account.id"
              class="transition hover:bg-gray-50"
            >
              <td class="px-5 py-4 font-medium text-gray-800">{{ account.name }}</td>
              <td class="px-5 py-4 text-gray-500">{{ account.email }}</td>
              <td class="px-5 py-4">
                <span class="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {{ roleLevelLabels[account.roleLevel] }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span
                  class="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="
                    account.status === AccountStatus.ON
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  "
                >
                  {{ statusLabels[account.status] }}
                </span>
              </td>
              <td class="px-5 py-4 text-right">
                <button
                  @click="openEdit(account)"
                  class="mr-3 text-blue-600 transition hover:underline"
                >
                  編輯
                </button>
                <button
                  @click="handleDelete(account.id)"
                  :disabled="deletingId === account.id"
                  class="text-red-500 transition hover:underline disabled:opacity-40"
                >
                  {{ deletingId === account.id ? '刪除中...' : '刪除' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>

  <!-- Create / Edit Modal -->
  <AccountFormModal
    v-if="showModal"
    :account="editingAccount"
    :submitting="isModalSubmitting"
    :error="modalError"
    @close="closeModal"
    @submit="handleModalSubmit"
  />
</template>
