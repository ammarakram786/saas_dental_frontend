import type { PaginatedResponse, PlatformUserListQuery } from '~/types/api'
import { toQueryParams } from '~/types/api'

export interface PlatformTeamMember {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_super_admin: boolean
  platform_role: number | null
  is_active: boolean
  contact_phone?: string
}

export interface PlatformRoleOption {
  id: number
  name: string
  slug: string
}

export const usePlatformTeamStore = defineStore('platform-team', () => {
  const { apiFetch } = useApi()
  const items = ref<PlatformTeamMember[]>([])
  const roles = ref<PlatformRoleOption[]>([])
  const count = ref(0)
  const pending = ref(false)
  const updating = ref(false)

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

  async function fetchRoles() {
    const response = await apiFetch<PaginatedResponse<PlatformRoleOption>>('platform/roles')
    roles.value = response.results ?? []
  }

  async function updateMember(id: number, payload: { platform_role?: number | null }) {
    updating.value = true
    try {
      const member = await apiFetch<PlatformTeamMember>(`platform/team/${id}`, {
        method: 'PATCH',
        body: payload,
      })
      items.value = items.value.map((m) => (m.id === id ? member : m))
      return member
    } finally {
      updating.value = false
    }
  }

  async function fetchAll() {
    return fetch()
  }

  return { items, roles, count, pending, updating, fetch, fetchRoles, updateMember, fetchAll }
})
