import type {
  ClinicalListQuery,
  ClinicalNote,
  CreateClinicalNotePayload,
  CreateTreatmentPlanPayload,
  Odontogram,
  PaginatedResponse,
  Prescription,
  TreatmentPlan,
} from '~/types/api'
import { toQueryParams } from '~/types/api'

export const useClinicalStore = defineStore('clinical', () => {
  const { apiFetch } = useApi()
  const odontograms = ref<Odontogram[]>([])
  const notes = ref<ClinicalNote[]>([])
  const plans = ref<TreatmentPlan[]>([])
  const prescriptions = ref<Prescription[]>([])
  const pending = ref(false)
  const mutating = ref(false)

  async function fetchForPatient(
    tenantId: string | number | null | undefined,
    patientId: number,
  ) {
    pending.value = true
    try {
      const query = toQueryParams({ patient: patientId, ordering: '-created_at' } as ClinicalListQuery)
      const [odo, noteRes, planRes, rxRes] = await Promise.all([
        apiFetch<PaginatedResponse<Odontogram>>('clinical/odontograms', { tenantId, query }),
        apiFetch<PaginatedResponse<ClinicalNote>>('clinical/notes', { tenantId, query }),
        apiFetch<PaginatedResponse<TreatmentPlan>>('clinical/treatment-plans', { tenantId, query }),
        apiFetch<PaginatedResponse<Prescription>>('clinical/prescriptions', { tenantId, query }),
      ])
      odontograms.value = odo.results ?? []
      notes.value = noteRes.results ?? []
      plans.value = planRes.results ?? []
      prescriptions.value = rxRes.results ?? []
    } finally {
      pending.value = false
    }
  }

  async function saveOdontogram(
    tenantId: string | number | null | undefined,
    payload: { appointment: number; tooth_map: Record<string, string> },
    existingId?: number,
  ) {
    mutating.value = true
    try {
      if (existingId) {
        return await apiFetch<Odontogram>(`clinical/odontograms/${existingId}`, {
          method: 'PATCH',
          tenantId,
          body: { tooth_map: payload.tooth_map },
        })
      }
      return await apiFetch<Odontogram>('clinical/odontograms', {
        method: 'POST',
        tenantId,
        body: payload,
      })
    } finally {
      mutating.value = false
    }
  }

  async function createNote(
    tenantId: string | number | null | undefined,
    payload: CreateClinicalNotePayload,
  ) {
    mutating.value = true
    try {
      const note = await apiFetch<ClinicalNote>('clinical/notes', {
        method: 'POST',
        tenantId,
        body: payload,
      })
      notes.value = [note, ...notes.value]
      return note
    } finally {
      mutating.value = false
    }
  }

  async function updateNote(
    tenantId: string | number | null | undefined,
    id: number,
    payload: Partial<CreateClinicalNotePayload>,
  ) {
    mutating.value = true
    try {
      const note = await apiFetch<ClinicalNote>(`clinical/notes/${id}`, {
        method: 'PATCH',
        tenantId,
        body: payload,
      })
      notes.value = notes.value.map((n) => (n.id === id ? note : n))
      return note
    } finally {
      mutating.value = false
    }
  }

  async function createPlan(
    tenantId: string | number | null | undefined,
    payload: CreateTreatmentPlanPayload,
  ) {
    mutating.value = true
    try {
      const plan = await apiFetch<TreatmentPlan>('clinical/treatment-plans', {
        method: 'POST',
        tenantId,
        body: payload,
      })
      plans.value = [plan, ...plans.value]
      return plan
    } finally {
      mutating.value = false
    }
  }

  async function createPrescription(
    tenantId: string | number | null | undefined,
    payload: { clinical_note: number; medications: unknown[] },
  ) {
    mutating.value = true
    try {
      const rx = await apiFetch<Prescription>('clinical/prescriptions', {
        method: 'POST',
        tenantId,
        body: payload,
      })
      prescriptions.value = [rx, ...prescriptions.value]
      return rx
    } finally {
      mutating.value = false
    }
  }

  return {
    odontograms,
    notes,
    plans,
    prescriptions,
    pending,
    mutating,
    fetchForPatient,
    saveOdontogram,
    createNote,
    updateNote,
    createPlan,
    createPrescription,
  }
})
