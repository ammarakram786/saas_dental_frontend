<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const scheduling = useSchedulingStore()
const { current } = useWorkspace()

const status = ref<string | undefined>(undefined)
const statusItems = [
  { label: 'All statuses', value: undefined },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Arrived', value: 'arrived' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

async function loadAppointments() {
  await scheduling.fetchAppointments(current.value?.id, {
    ordering: '-created_at',
    ...(status.value
      ? { status: status.value as 'pending' | 'confirmed' | 'arrived' | 'completed' | 'cancelled' }
      : {}),
  })
}

await loadAppointments()

watch([status, () => current.value?.id], () => {
  loadAppointments()
})
</script>

<template>
  <UCard>
    <ListToolbar
      v-model:status="status"
      :status-items="statusItems"
      :show-search="false"
      show-status
    />
    <ClinicCalendar :appointments="scheduling.items" :loading="scheduling.pending" />
  </UCard>
</template>
