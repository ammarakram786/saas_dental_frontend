import type { AppointmentListQuery, PaginatedResponse } from '~/types/api'
import { toQueryParams } from '~/types/api'

export const useSchedulingStore = defineStore('scheduling', () => {
  const { apiFetch } = useApi()
  const items = ref<any[]>([])
  const count = ref(0)
  const pending = ref(false)

  async function fetchAppointments(
    tenantId?: string | number | null,
    query: AppointmentListQuery = {},
  ) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<any>>('scheduling/appointments', {
        tenantId,
        query: toQueryParams(query),
      })
      items.value = response.results ?? []
      count.value = response.count ?? items.value.length
    } finally {
      pending.value = false
    }
  }

  return { items, count, pending, fetchAppointments }
})
