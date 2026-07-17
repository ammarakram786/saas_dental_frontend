import type {
  Appointment,
  AppointmentSlot,
  PatientDashboard,
  PatientMedicalProfile,
  PatientUserProfile,
  UpdatePatientMedicalProfilePayload,
} from '~/types/api'
import { toQueryParams } from '~/types/api'

export const usePatientStore = defineStore('patient', () => {
  const { apiFetch } = useApi()
  const dashboard = ref<PatientDashboard | null>(null)
  const medicalProfile = ref<PatientMedicalProfile | null>(null)
  const userProfile = ref<PatientUserProfile | null>(null)
  const availability = ref<AppointmentSlot[]>([])
  const appointments = ref<Appointment[]>([])
  const pending = ref(false)
  const mutating = ref(false)

  async function fetchDashboard() {
    pending.value = true
    try {
      dashboard.value = await apiFetch<PatientDashboard>('patient/dashboard')
    } finally {
      pending.value = false
    }
  }

  async function fetchMedicalProfile() {
    medicalProfile.value = await apiFetch<PatientMedicalProfile>('patient/medical-profile')
  }

  async function updateMedicalProfile(payload: UpdatePatientMedicalProfilePayload) {
    mutating.value = true
    try {
      medicalProfile.value = await apiFetch<PatientMedicalProfile>('patient/medical-profile', {
        method: 'PATCH',
        body: payload,
      })
      return medicalProfile.value
    } finally {
      mutating.value = false
    }
  }

  async function fetchUserProfile() {
    userProfile.value = await apiFetch<PatientUserProfile>('patient/profile')
  }

  async function updateUserProfile(payload: Partial<PatientUserProfile>) {
    mutating.value = true
    try {
      userProfile.value = await apiFetch<PatientUserProfile>('patient/profile', {
        method: 'PATCH',
        body: payload,
      })
      return userProfile.value
    } finally {
      mutating.value = false
    }
  }

  async function fetchAvailability(tenantSlug: string, dateFrom?: string, dateTo?: string) {
    pending.value = true
    try {
      availability.value = await apiFetch<AppointmentSlot[]>('scheduling/availability', {
        query: toQueryParams({
          tenant: tenantSlug,
          date_from: dateFrom,
          date_to: dateTo,
        }),
      })
      return availability.value
    } finally {
      pending.value = false
    }
  }

  async function fetchAppointments() {
    const response = await apiFetch<{ results?: Appointment[] } | Appointment[]>(
      'scheduling/patient',
    )
    appointments.value = Array.isArray(response) ? response : (response.results ?? [])
    return appointments.value
  }

  async function bookAppointment(slotId: number, appointmentType = 'checkup', notes = '') {
    mutating.value = true
    try {
      const appointment = await apiFetch<Appointment>('scheduling/patient/book', {
        method: 'POST',
        body: { slot: slotId, appointment_type: appointmentType, notes },
      })
      appointments.value = [appointment, ...appointments.value]
      return appointment
    } finally {
      mutating.value = false
    }
  }

  async function cancelAppointment(id: number) {
    mutating.value = true
    try {
      const appointment = await apiFetch<Appointment>(`scheduling/patient/${id}/cancel`, {
        method: 'POST',
      })
      appointments.value = appointments.value.map((a) => (a.id === id ? appointment : a))
      if (dashboard.value?.appointments) {
        dashboard.value = {
          ...dashboard.value,
          appointments: dashboard.value.appointments.map((a: any) =>
            a.id === id ? { ...a, status: 'cancelled' } : a,
          ),
        }
      }
      return appointment
    } finally {
      mutating.value = false
    }
  }

  return {
    dashboard,
    medicalProfile,
    userProfile,
    availability,
    appointments,
    pending,
    mutating,
    fetchDashboard,
    fetchMedicalProfile,
    updateMedicalProfile,
    fetchUserProfile,
    updateUserProfile,
    fetchAvailability,
    fetchAppointments,
    bookAppointment,
    cancelAppointment,
  }
})
