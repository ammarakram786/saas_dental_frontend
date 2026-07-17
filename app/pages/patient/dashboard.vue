<script setup lang="ts">
definePageMeta({ layout: 'patient' })

const store = usePatientStore()
await callOnce(() => store.fetchDashboard())
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-highlighted">Patient dashboard</h1>
        <p class="mt-2 text-sm text-muted">Cross-clinic appointments and financial activity.</p>
      </div>
      <UButton label="Book appointment" icon="i-lucide-calendar-plus" to="/patient/book" />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <UCard>
        <template #header><h2 class="font-semibold text-highlighted">Appointments</h2></template>
        <div class="space-y-3">
          <div
            v-for="item in store.dashboard?.appointments ?? []"
            :key="item.id"
            class="rounded-lg border border-default p-3"
          >
            <p class="font-medium text-highlighted">{{ (item as any).tenant }}</p>
            <p class="text-sm text-muted">
              {{ (item as any).type || item.appointment_type }} · {{ item.status }}
            </p>
            <p v-if="item.created_at" class="text-xs text-dimmed">
              {{ new Date(item.created_at).toLocaleString() }}
            </p>
          </div>
          <p v-if="!(store.dashboard?.appointments?.length)" class="text-sm text-muted">
            No appointments yet.
            <NuxtLink to="/patient/book" class="text-primary">Book one</NuxtLink>
          </p>
        </div>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold text-highlighted">Invoices</h2></template>
        <div class="space-y-3">
          <div
            v-for="item in store.dashboard?.invoices ?? []"
            :key="item.id"
            class="rounded-lg border border-default p-3"
          >
            <p class="font-medium text-highlighted">{{ (item as any).tenant }}</p>
            <p class="text-sm text-muted">Copay: {{ item.copay_amount }} · {{ item.status }}</p>
          </div>
          <p v-if="!(store.dashboard?.invoices?.length)" class="text-sm text-muted">No invoices.</p>
        </div>
      </UCard>
    </div>
  </div>
</template>
