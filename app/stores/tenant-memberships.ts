import type { PaginatedResponse, TenantMembershipListQuery } from '~/types/api'
import { toQueryParams } from '~/types/api'

export const useTenantMembershipStore = defineStore('tenant-memberships', () => {
  const { apiFetch } = useApi()
  const items = ref<any[]>([])
  const count = ref(0)
  const pending = ref(false)

  async function fetch(
    tenantId?: string | number | null,
    query: TenantMembershipListQuery = {},
  ) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<any>>('tenant/memberships', {
        tenantId,
        query: toQueryParams(query),
      })
      items.value = response.results ?? []
      count.value = response.count ?? items.value.length
    } finally {
      pending.value = false
    }
  }

  return { items, count, pending, fetch }
})
