<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const scheduling = useSchedulingStore()
const { current } = useWorkspace()
const toast = useToast()
const { user } = useUserSession()

const status = ref<string | undefined>(undefined)
const createOpen = ref(false)
const statusItems = [
  { label: 'All statuses', value: undefined },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Arrived', value: 'arrived' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const form = reactive({
  patient: '' as string | number,
  slot: '' as string | number,
  appointment_type: 'checkup',
  notes: '',
})

async function loadAppointments() {
  await scheduling.fetchAppointments(current.value?.id, {
    ordering: '-created_at',
    ...(status.value
      ? { status: status.value as 'pending' | 'confirmed' | 'arrived' | 'completed' | 'cancelled' }
      : {}),
  })
}

await Promise.all([
  loadAppointments(),
  scheduling.fetchSlots(current.value?.id, { is_available: true }),
  scheduling.fetchAssets(current.value?.id),
])

watch([status, () => current.value?.id], () => {
  loadAppointments()
})

async function createAppointment() {
  try {
    await scheduling.createAppointment(current.value?.id, {
      patient: Number(form.patient),
      slot: Number(form.slot),
      appointment_type: form.appointment_type,
      notes: form.notes,
      status: 'confirmed',
    })
    toast.add({ title: 'Appointment created', color: 'success' })
    createOpen.value = false
    await Promise.all([
      loadAppointments(),
      scheduling.fetchSlots(current.value?.id, { is_available: true }),
    ])
  } catch (err: any) {
    toast.add({
      title: 'Could not create appointment',
      description: err?.data?.detail || err?.message,
      color: 'error',
    })
  }
}

async function setStatus(id: number, next: string) {
  try {
    await scheduling.updateAppointment(current.value?.id, id, { status: next })
    toast.add({ title: `Marked ${next}`, color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Update failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}

async function createQuickSlot() {
  const asset = scheduling.assets[0]
  if (!asset || !user.value?.id) {
    toast.add({ title: 'Create a clinic chair first', color: 'warning' })
    return
  }
  const start = new Date()
  start.setMinutes(0, 0, 0)
  start.setHours(start.getHours() + 2)
  const end = new Date(start.getTime() + 30 * 60 * 1000)
  try {
    await scheduling.createSlot(current.value?.id, {
      dentist: user.value!.id,
      chair: asset.id,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      is_available: true,
    } as any)
    toast.add({ title: 'Slot created', color: 'success' })
    await scheduling.fetchSlots(current.value?.id, { is_available: true })
  } catch (err: any) {
    toast.add({ title: 'Slot creation failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}

const slotItems = computed(() =>
  scheduling.slots.map((s) => ({
    label: `${new Date(s.start_time).toLocaleString()} (#${s.id})`,
    value: s.id,
  })),
)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <ListToolbar
        v-model:status="status"
        :status-items="statusItems"
        :show-search="false"
        show-status
      />
      <div class="flex gap-2">
        <UButton color="neutral" variant="outline" label="Quick slot" @click="createQuickSlot" />
        <UButton label="New appointment" icon="i-lucide-plus" @click="createOpen = true" />
      </div>
    </div>

    <ClinicCalendar :appointments="scheduling.items" :loading="scheduling.pending" />

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Actions</h2>
      </template>
      <div class="space-y-2">
        <div
          v-for="appt in scheduling.items"
          :key="appt.id"
          class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-default p-3"
        >
          <div>
            <p class="text-sm font-medium text-highlighted">#{{ appt.id }} · {{ appt.appointment_type }}</p>
            <p class="text-xs text-muted">Patient {{ appt.patient }} · {{ appt.status }}</p>
          </div>
          <div class="flex gap-2">
            <UButton size="sm" variant="soft" label="Arrive" @click="setStatus(appt.id, 'arrived')" />
            <UButton size="sm" variant="soft" color="success" label="Complete" @click="setStatus(appt.id, 'completed')" />
            <UButton size="sm" variant="soft" color="error" label="Cancel" @click="setStatus(appt.id, 'cancelled')" />
          </div>
        </div>
      </div>
    </UCard>

    <UModal v-model:open="createOpen" title="New appointment">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Patient user ID">
            <UInput v-model="form.patient" type="number" class="w-full" />
          </UFormField>
          <UFormField label="Available slot">
            <USelect v-model="form.slot" :items="slotItems" value-key="value" class="w-full" />
          </UFormField>
          <UFormField label="Type">
            <UInput v-model="form.appointment_type" class="w-full" />
          </UFormField>
          <UFormField label="Notes">
            <UTextarea v-model="form.notes" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="outline" label="Cancel" @click="createOpen = false" />
          <UButton label="Create" :loading="scheduling.mutating" @click="createAppointment" />
        </div>
      </template>
    </UModal>
  </div>
</template>
