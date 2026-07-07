import type { PaginatedResponse, PlatformTenant, TenantListQuery } from '~/types/api'
import { toQueryParams } from '~/types/api'

export const usePlatformTenantsStore = defineStore('platform-tenants', () => {
  const { apiFetch } = useApi()
  const items = ref<PlatformTenant[]>([])
  const count = ref(0)
  const pending = ref(false)

  async function fetch(query: TenantListQuery = {}) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<PlatformTenant>>('platform/tenants', {
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
