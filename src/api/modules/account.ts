import http from '../http'
import type { Account, AccountFormDto, AccountListQuery } from '@/types'

export function getAccounts(query?: AccountListQuery): Promise<Account[]> {
  return http.get<Account[]>('/accounts', { params: query }).then((res) => res.data)
}

export function getAccount(id: string): Promise<Account> {
  return http.get<Account>(`/account/${id}`).then((res) => res.data)
}

export function createAccount(data: AccountFormDto): Promise<Account> {
  return http.post<Account>('/create-account', data).then((res) => res.data)
}

export function updateAccount(id: string, data: AccountFormDto): Promise<Account> {
  return http.patch<Account>(`/update-account/${id}`, data).then((res) => res.data)
}

export function deleteAccount(id: string): Promise<void> {
  return http.delete(`/delete-account/${id}`).then(() => undefined)
}
