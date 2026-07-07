<script setup lang="ts">
definePageMeta({ layout: 'patient' })

const store = usePatientStore()
await callOnce(() => store.fetchDashboard())
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-xl font-semibold text-highlighted">Appointment history</h1>
    </template>
    <div class="space-y-3">
      <div v-for="item in store.dashboard?.appointments ?? []" :key="item.id" class="rounded-lg border border-default p-3">
        <p class="font-medium text-highlighted">{{ item.tenant }}</p>
        <p class="text-sm text-muted">{{ item.type }} · {{ item.status }}</p>
      </div>
    </div>
  </UCard>
</template>
