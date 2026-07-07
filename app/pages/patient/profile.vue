<script setup lang="ts">
definePageMeta({ layout: 'patient' })

const store = usePatientStore()
await callOnce(() => store.fetchMedicalProfile())
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-xl font-semibold text-highlighted">Medical profile</h1>
    </template>
    <pre class="overflow-auto rounded-lg bg-elevated p-4 text-sm">{{ store.medicalProfile }}</pre>
  </UCard>
</template>
