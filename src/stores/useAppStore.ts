import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const interviewerName = ref(import.meta.env.VITE_INTERVIEWER_NAME as string)

  return { interviewerName }
})
