import type {
  CreatePlatformTenantPayload,
  PaginatedResponse,
  PlatformTenant,
  TenantListQuery,
} from '~/types/api'
import { toQueryParams } from '~/types/api'

export const usePlatformTenantsStore = defineStore('platform-tenants', () => {
  const { apiFetch } = useApi()
  const items = ref<PlatformTenant[]>([])
  const count = ref(0)
  const pending = ref(false)
  const creating = ref(false)

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

  async function create(payload: CreatePlatformTenantPayload) {
    creating.value = true
    try {
      const tenant = await apiFetch<PlatformTenant>('platform/tenants', {
        method: 'POST',
        body: payload,
      })
      items.value = [tenant, ...items.value]
      count.value += 1
      return tenant
    } finally {
      creating.value = false
    }
  }

  /** @deprecated use fetch() */
  async function fetchAll() {
    return fetch()
  }

  return { items, count, pending, creating, fetch, create, fetchAll }
})
