<script setup lang="ts">
defineEmits<{ logout: [] }>()
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <!-- Logo + Title -->
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500">
          <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div>
          <h1 class="text-base font-bold text-gray-900">帳號管理系統</h1>
          <p class="text-xs text-gray-400">管理您的所有帳號</p>
        </div>
      </div>

      <!-- Logout -->
      <button
        @click="$emit('logout')"
        class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
        登出
      </button>
    </div>
  </header>
</template>
