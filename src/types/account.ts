export enum RoleLevel {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
  CLIENT = 'CLIENT',
}

export enum AccountStatus {
  ON = 'ON',
  OFF = 'OFF',
}

export interface AccountFormDto {
  name: string
  email: string
  roleLevel: RoleLevel
  status: AccountStatus
}

// NOTE: Swagger 未定義 response schema，以 AccountFormDto + id 為暫定型別，
// 實際 call API 取得真實回傳後再校正。createdAt 為 server 選擇性回傳欄位。
export interface Account extends AccountFormDto {
  id: string
  createdAt?: string
}

export interface AccountListQuery {
  name?: string
  email?: string
}
