import http from '../http'
import type { ApiResponse } from '@/types'

export interface ExampleItem {
  id: number
  name: string
}

export function getExamples(): Promise<ApiResponse<ExampleItem[]>> {
  return http.get<ApiResponse<ExampleItem[]>>('/examples').then((res) => res.data)
}
