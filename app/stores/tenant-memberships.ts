import type {
  PaginatedResponse,
  TenantMembership,
  TenantMembershipListQuery,
  TenantRole,
} from '~/types/api'
import { toQueryParams } from '~/types/api'

export const useTenantMembershipStore = defineStore('tenant-memberships', () => {
  const { apiFetch } = useApi()
  const items = ref<(TenantMembership & { user_display?: string; role_name?: string })[]>([])
  const roles = ref<TenantRole[]>([])
  const count = ref(0)
  const pending = ref(false)
  const mutating = ref(false)

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

  async function fetchRoles(tenantId?: string | number | null) {
    const response = await apiFetch<PaginatedResponse<TenantRole>>('tenant/roles', { tenantId })
    roles.value = response.results ?? []
  }

  async function createMembership(
    tenantId: string | number | null | undefined,
    payload: { user: number; role: number; is_active?: boolean },
  ) {
    mutating.value = true
    try {
      const membership = await apiFetch<any>('tenant/memberships', {
        method: 'POST',
        tenantId,
        body: payload,
      })
      items.value = [membership, ...items.value]
      count.value += 1
      return membership
    } finally {
      mutating.value = false
    }
  }

  async function updateMembership(
    tenantId: string | number | null | undefined,
    id: number,
    payload: { role?: number; is_active?: boolean },
  ) {
    mutating.value = true
    try {
      const membership = await apiFetch<any>(`tenant/memberships/${id}`, {
        method: 'PATCH',
        tenantId,
        body: payload,
      })
      items.value = items.value.map((m) => (m.id === id ? membership : m))
      return membership
    } finally {
      mutating.value = false
    }
  }

  return {
    items,
    roles,
    count,
    pending,
    mutating,
    fetch,
    fetchRoles,
    createMembership,
    updateMembership,
  }
})
