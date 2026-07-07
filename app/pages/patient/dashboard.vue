<script setup lang="ts">
definePageMeta({ layout: 'patient' })

const store = usePatientStore()
await callOnce(() => store.fetchDashboard())
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <h1 class="text-2xl font-bold text-highlighted">Patient dashboard</h1>
      <p class="mt-2 text-sm text-muted">Cross-clinic appointments and financial activity.</p>
    </UCard>

    <div class="grid gap-6 lg:grid-cols-2">
      <UCard>
        <template #header><h2 class="font-semibold text-highlighted">Appointments</h2></template>
        <div class="space-y-3">
          <div v-for="item in store.dashboard?.appointments ?? []" :key="item.id" class="rounded-lg border border-default p-3">
            <p class="font-medium text-highlighted">{{ item.tenant }}</p>
            <p class="text-sm text-muted">{{ item.type }} · {{ item.status }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold text-highlighted">Invoices</h2></template>
        <div class="space-y-3">
          <div v-for="item in store.dashboard?.invoices ?? []" :key="item.id" class="rounded-lg border border-default p-3">
            <p class="font-medium text-highlighted">{{ item.tenant }}</p>
            <p class="text-sm text-muted">Copay: {{ item.copay_amount }} · {{ item.status }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
