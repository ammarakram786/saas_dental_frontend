import type { PaginatedResponse, PlatformUserListQuery } from '~/types/api'
import { toQueryParams } from '~/types/api'

export interface PlatformTeamMember {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  platform_role: number | null
}

export const usePlatformTeamStore = defineStore('platform-team', () => {
  const { apiFetch } = useApi()
  const items = ref<PlatformTeamMember[]>([])
  const count = ref(0)
  const pending = ref(false)

  async function fetch(query: PlatformUserListQuery = {}) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<PlatformTeamMember>>('platform/team', {
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
