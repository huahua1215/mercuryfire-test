export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
