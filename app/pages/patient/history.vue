<script setup lang="ts">
definePageMeta({ layout: 'patient' })

const store = usePatientStore()
const toast = useToast()

await Promise.all([store.fetchDashboard(), store.fetchAppointments()])

async function cancel(id: number) {
  try {
    await store.cancelAppointment(id)
    toast.add({ title: 'Appointment cancelled', color: 'success' })
    await store.fetchDashboard()
  } catch (err: any) {
    toast.add({ title: 'Cancel failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-highlighted">Appointment history</h1>
        <UButton size="sm" label="Book" to="/patient/book" />
      </div>
    </template>
    <div class="space-y-3">
      <div
        v-for="item in store.dashboard?.appointments ?? []"
        :key="item.id"
        class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-default p-3"
      >
        <div>
          <p class="font-medium text-highlighted">{{ (item as any).tenant }}</p>
          <p class="text-sm text-muted">
            {{ (item as any).type || item.appointment_type }} · {{ item.status }}
          </p>
          <p v-if="item.created_at" class="text-xs text-dimmed">
            {{ new Date(item.created_at).toLocaleString() }}
          </p>
        </div>
        <UButton
          v-if="!['cancelled', 'completed'].includes(item.status)"
          size="sm"
          color="error"
          variant="soft"
          label="Cancel"
          :loading="store.mutating"
          @click="cancel(item.id)"
        />
      </div>
      <p v-if="!(store.dashboard?.appointments?.length)" class="text-sm text-muted">
        No appointments yet.
      </p>
    </div>
  </UCard>
</template>
