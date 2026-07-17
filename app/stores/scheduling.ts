import type {
  Appointment,
  AppointmentListQuery,
  AppointmentSlot,
  ClinicAsset,
  CreateAppointmentPayload,
  PaginatedResponse,
} from '~/types/api'
import { toQueryParams } from '~/types/api'

export const useSchedulingStore = defineStore('scheduling', () => {
  const { apiFetch } = useApi()
  const items = ref<Appointment[]>([])
  const slots = ref<AppointmentSlot[]>([])
  const assets = ref<ClinicAsset[]>([])
  const count = ref(0)
  const pending = ref(false)
  const mutating = ref(false)

  async function fetchAppointments(
    tenantId?: string | number | null,
    query: AppointmentListQuery = {},
  ) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<Appointment>>('scheduling/appointments', {
        tenantId,
        query: toQueryParams(query),
      })
      items.value = response.results ?? []
      count.value = response.count ?? items.value.length
    } finally {
      pending.value = false
    }
  }

  async function fetchSlots(tenantId?: string | number | null, query: Record<string, unknown> = {}) {
    const response = await apiFetch<PaginatedResponse<AppointmentSlot>>('scheduling/slots', {
      tenantId,
      query: toQueryParams(query),
    })
    slots.value = response.results ?? []
    return slots.value
  }

  async function fetchAssets(tenantId?: string | number | null) {
    const response = await apiFetch<PaginatedResponse<ClinicAsset>>('scheduling/assets', {
      tenantId,
    })
    assets.value = response.results ?? []
    return assets.value
  }

  async function createAppointment(
    tenantId: string | number | null | undefined,
    payload: CreateAppointmentPayload,
  ) {
    mutating.value = true
    try {
      const appointment = await apiFetch<Appointment>('scheduling/appointments', {
        method: 'POST',
        tenantId,
        body: payload,
      })
      items.value = [appointment, ...items.value]
      count.value += 1
      return appointment
    } finally {
      mutating.value = false
    }
  }

  async function updateAppointment(
    tenantId: string | number | null | undefined,
    id: number,
    payload: Partial<CreateAppointmentPayload> & { status?: string },
  ) {
    mutating.value = true
    try {
      const appointment = await apiFetch<Appointment>(`scheduling/appointments/${id}`, {
        method: 'PATCH',
        tenantId,
        body: payload,
      })
      items.value = items.value.map((a) => (a.id === id ? appointment : a))
      return appointment
    } finally {
      mutating.value = false
    }
  }

  async function createSlot(
    tenantId: string | number | null | undefined,
    payload: Partial<AppointmentSlot>,
  ) {
    mutating.value = true
    try {
      const slot = await apiFetch<AppointmentSlot>('scheduling/slots', {
        method: 'POST',
        tenantId,
        body: payload,
      })
      slots.value = [...slots.value, slot]
      return slot
    } finally {
      mutating.value = false
    }
  }

  return {
    items,
    slots,
    assets,
    count,
    pending,
    mutating,
    fetchAppointments,
    fetchSlots,
    fetchAssets,
    createAppointment,
    updateAppointment,
    createSlot,
  }
})
