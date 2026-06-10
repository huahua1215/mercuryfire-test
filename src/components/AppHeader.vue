<script setup lang="ts">
defineEmits<{ logout: [] }>()
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Logo + Title -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <path d="M16 3.128a4 4 0 0 1 0 7.744" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h1 class="font-bold text-gray-900 text-2xl">帳號管理系統</h1>
            <p class="text-gray-600">管理您的所有帳號</p>
          </div>
        </div>

        <!-- Logout -->
        <button
          @click="$emit('logout')"
          class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          </svg>
          <span>登出</span>
        </button>
      </div>
    </div>
  </header>
</template>
