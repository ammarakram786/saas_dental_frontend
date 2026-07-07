import type { AuditListQuery, PaginatedResponse } from '~/types/api'
import { toQueryParams } from '~/types/api'

export interface PlatformAuditEvent {
  id: number
  actor: string
  action: string
  target: string
  severity: 'info' | 'warning' | 'critical'
  category: string
  created_at: string
}

export const usePlatformAuditStore = defineStore('platform-audit', () => {
  const { apiFetch } = useApi()
  const items = ref<PlatformAuditEvent[]>([])
  const count = ref(0)
  const pending = ref(false)

  async function fetch(query: AuditListQuery = { ordering: '-created_at' }) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<PlatformAuditEvent>>('platform/audit', {
        query: toQueryParams(query),
      })
      items.value = response.results ?? []
      count.value = response.count ?? items.value.length
    } finally {
      pending.value = false
    }
  }

  /** @deprecated use fetch() */
  async function fetchAll() {
    return fetch()
  }

  return { items, count, pending, fetch, fetchAll }
})
