<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const clinical = useClinicalStore()
const scheduling = useSchedulingStore()
const { current } = useWorkspace()
const route = useRoute()
const toast = useToast()
const { user } = useUserSession()

const patientId = computed(() => Number(route.params.patientId))
const selectedAppointmentId = ref<number | null>(null)
const noteBody = ref('')
const planPhases = ref('[{"name":"Phase 1","items":[]}]')
const planCost = ref('0')
const rxText = ref('[{"name":"Amoxicillin","dose":"500mg","freq":"TID"}]')
const toothMap = ref<Record<string, string>>({})

await Promise.all([
  clinical.fetchForPatient(current.value?.id, patientId.value),
  scheduling.fetchAppointments(current.value?.id, { patient: patientId.value }),
])

watch(
  () => clinical.odontograms[0]?.tooth_map,
  (map) => {
    toothMap.value = { ...(map || {}) }
  },
  { immediate: true },
)

const appointmentItems = computed(() =>
  scheduling.items.map((a) => ({
    label: `#${a.id} · ${a.appointment_type} (${a.status})`,
    value: a.id,
  })),
)

watch(
  appointmentItems,
  (items) => {
    if (!selectedAppointmentId.value && items[0]) {
      selectedAppointmentId.value = items[0].value
    }
  },
  { immediate: true },
)

async function saveOdontogram() {
  if (!selectedAppointmentId.value) {
    toast.add({ title: 'Select an appointment first', color: 'warning' })
    return
  }
  try {
    await clinical.saveOdontogram(
      current.value?.id,
      { appointment: selectedAppointmentId.value, tooth_map: toothMap.value },
      clinical.odontograms[0]?.id,
    )
    await clinical.fetchForPatient(current.value?.id, patientId.value)
    toast.add({ title: 'Odontogram saved', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Save failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}

async function addNote() {
  if (!selectedAppointmentId.value || !noteBody.value.trim()) return
  try {
    await clinical.createNote(current.value?.id, {
      appointment: selectedAppointmentId.value,
      dentist: user.value?.id,
      body: noteBody.value.trim(),
    })
    noteBody.value = ''
    toast.add({ title: 'Note added', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Could not add note', description: err?.data?.detail || err?.message, color: 'error' })
  }
}

async function addPlan() {
  if (!selectedAppointmentId.value) return
  try {
    const phases = JSON.parse(planPhases.value)
    await clinical.createPlan(current.value?.id, {
      appointment: selectedAppointmentId.value,
      phases,
      estimated_cost: planCost.value,
      consent_signed: false,
    })
    toast.add({ title: 'Treatment plan created', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Plan failed', description: err?.message || 'Invalid JSON or API error', color: 'error' })
  }
}

async function addPrescription(noteId: number) {
  try {
    const medications = JSON.parse(rxText.value)
    await clinical.createPrescription(current.value?.id, {
      clinical_note: noteId,
      medications,
    })
    toast.add({ title: 'Prescription added', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Prescription failed', description: err?.message, color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold text-highlighted">Clinical chart</h1>
          <p class="text-sm text-muted">Patient #{{ patientId }}</p>
        </div>
        <UFormField label="Appointment context" class="min-w-64">
          <USelect
            v-model="selectedAppointmentId"
            :items="appointmentItems"
            value-key="value"
            class="w-full"
          />
        </UFormField>
      </div>
    </UCard>

    <OdontogramCanvas v-model="toothMap" editable />
    <div class="flex justify-end">
      <UButton label="Save odontogram" icon="i-lucide-save" :loading="clinical.mutating" @click="saveOdontogram" />
    </div>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Clinical notes</h2>
      </template>
      <div class="space-y-3">
        <div v-for="note in clinical.notes" :key="note.id" class="rounded-lg border border-default p-3">
          <p class="text-sm text-highlighted">{{ note.body }}</p>
          <p class="mt-1 text-xs text-muted">Locked: {{ note.is_locked ? 'Yes' : 'No' }}</p>
          <UButton
            v-if="!note.is_locked"
            class="mt-2"
            size="xs"
            variant="soft"
            label="Add prescription"
            @click="addPrescription(note.id)"
          />
        </div>
        <p v-if="!clinical.notes.length" class="text-sm text-muted">No clinical notes for this patient.</p>
        <UTextarea v-model="noteBody" placeholder="New clinical note..." class="w-full" />
        <UButton label="Add note" :loading="clinical.mutating" @click="addNote" />
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Treatment plans</h2>
      </template>
      <div class="space-y-3">
        <div v-for="plan in clinical.plans" :key="plan.id" class="rounded-lg border border-default p-3">
          <p class="text-sm font-medium text-highlighted">Plan #{{ plan.id }} · {{ plan.estimated_cost }}</p>
          <p class="text-xs text-muted">Consent: {{ plan.consent_signed ? 'Signed' : 'Pending' }}</p>
          <pre class="mt-2 overflow-auto text-xs text-muted">{{ JSON.stringify(plan.phases, null, 2) }}</pre>
        </div>
        <UFormField label="Phases (JSON)">
          <UTextarea v-model="planPhases" class="w-full font-mono text-xs" />
        </UFormField>
        <UFormField label="Estimated cost">
          <UInput v-model="planCost" class="w-full" />
        </UFormField>
        <UButton label="Create plan" :loading="clinical.mutating" @click="addPlan" />
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Prescriptions</h2>
      </template>
      <div class="space-y-2">
        <div v-for="rx in clinical.prescriptions" :key="rx.id" class="rounded-lg border border-default p-3">
          <p class="text-sm text-highlighted">Rx #{{ rx.id }} · note {{ rx.clinical_note }}</p>
          <pre class="mt-1 overflow-auto text-xs text-muted">{{ JSON.stringify(rx.medications, null, 2) }}</pre>
        </div>
        <UFormField label="Default medications JSON for new Rx">
          <UTextarea v-model="rxText" class="w-full font-mono text-xs" />
        </UFormField>
      </div>
    </UCard>
  </div>
</template>
