import { RoleLevel, AccountStatus } from '@/types'

export const ROLE_LABELS: Record<RoleLevel, string> = {
  [RoleLevel.ADMIN]: '管理員',
  [RoleLevel.EDITOR]: '編輯',
  [RoleLevel.USER]: '用戶',
  [RoleLevel.CLIENT]: '客戶',
}

export const STATUS_LABELS: Record<AccountStatus, string> = {
  [AccountStatus.ON]: '啟用',
  [AccountStatus.OFF]: '停用',
}
