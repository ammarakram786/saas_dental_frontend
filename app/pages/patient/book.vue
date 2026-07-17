<script setup lang="ts">
definePageMeta({ layout: 'patient' })

const store = usePatientStore()
const toast = useToast()

// Patients book by clinic slug (public availability endpoint).
const tenantSlug = ref('demo-clinic')
const appointmentType = ref('checkup')
const notes = ref('')

const dateFrom = ref(new Date().toISOString().slice(0, 10))
const dateTo = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
})

async function loadSlots() {
  await store.fetchAvailability(
    tenantSlug.value,
    `${dateFrom.value}T00:00:00Z`,
    `${dateTo.value}T23:59:59Z`,
  )
}

await loadSlots()

async function book(slotId: number) {
  try {
    await store.bookAppointment(slotId, appointmentType.value, notes.value)
    toast.add({ title: 'Appointment booked', color: 'success' })
    await navigateTo('/patient/history')
  } catch (err: any) {
    toast.add({
      title: 'Booking failed',
      description: err?.data?.slot?.[0] || err?.data?.detail || err?.message,
      color: 'error',
    })
    await loadSlots()
  }
}
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <h1 class="text-xl font-semibold text-highlighted">Book an appointment</h1>
      <p class="mt-1 text-sm text-muted">Choose a clinic and available slot.</p>

      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <UFormField label="Clinic slug">
          <UInput v-model="tenantSlug" class="w-full" placeholder="demo-clinic" />
        </UFormField>
        <UFormField label="From date">
          <UInput v-model="dateFrom" type="date" class="w-full" />
        </UFormField>
        <UFormField label="Appointment type">
          <UInput v-model="appointmentType" class="w-full" />
        </UFormField>
        <UFormField label="Notes">
          <UInput v-model="notes" class="w-full" />
        </UFormField>
      </div>
      <div class="mt-4">
        <UButton label="Refresh availability" :loading="store.pending" @click="loadSlots" />
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Available slots</h2>
      </template>
      <div v-if="store.pending" class="space-y-3">
        <USkeleton v-for="i in 4" :key="i" class="h-14 w-full" />
      </div>
      <div v-else class="grid gap-3 sm:grid-cols-2">
        <div
          v-for="slot in store.availability"
          :key="slot.id"
          class="flex items-center justify-between gap-3 rounded-lg border border-default p-4"
        >
          <div>
            <p class="font-medium text-highlighted">
              {{ new Date(slot.start_time).toLocaleString() }}
            </p>
            <p class="text-xs text-muted">
              Until {{ new Date(slot.end_time).toLocaleTimeString() }} · Slot #{{ slot.id }}
            </p>
          </div>
          <UButton
            size="sm"
            label="Book"
            :loading="store.mutating"
            @click="book(slot.id)"
          />
        </div>
        <p v-if="!store.availability.length" class="text-sm text-muted sm:col-span-2">
          No open slots for this clinic in the selected range.
        </p>
      </div>
    </UCard>
  </div>
</template>
