import type {
  CreatePlatformTenantPayload,
  PaginatedResponse,
  PlatformTenant,
  TenantListQuery,
  UpdatePlatformTenantPayload,
} from '~/types/api'
import { toQueryParams } from '~/types/api'

export const usePlatformTenantsStore = defineStore('platform-tenants', () => {
  const { apiFetch } = useApi()
  const items = ref<PlatformTenant[]>([])
  const count = ref(0)
  const pending = ref(false)
  const creating = ref(false)
  const updating = ref(false)

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

  async function update(id: number, payload: UpdatePlatformTenantPayload) {
    updating.value = true
    try {
      const tenant = await apiFetch<PlatformTenant>(`platform/tenants/${id}`, {
        method: 'PATCH',
        body: payload,
      })
      items.value = items.value.map((t) => (t.id === id ? tenant : t))
      return tenant
    } finally {
      updating.value = false
    }
  }

  /** @deprecated use fetch() */
  async function fetchAll() {
    return fetch()
  }

  return { items, count, pending, creating, updating, fetch, create, update, fetchAll }
})
