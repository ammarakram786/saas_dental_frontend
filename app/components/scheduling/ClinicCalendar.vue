<script setup lang="ts">
defineProps<{
  appointments: Array<any>
  loading?: boolean
}>()
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-highlighted">Clinic schedule</h2>
        <UBadge color="primary" variant="subtle" label="Drag-and-drop ready" />
      </div>
    </template>

    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="i in 4" :key="i" class="h-16 w-full" />
    </div>
    <div v-else class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="item in appointments"
        :key="item.id"
        class="rounded-lg border border-default bg-default p-4"
      >
        <p class="font-medium text-highlighted">{{ item.appointment_type }}</p>
        <p class="text-sm text-muted">Status: {{ item.status }}</p>
        <p class="text-xs text-dimmed">Slot #{{ item.slot }}</p>
      </div>
      <p v-if="!appointments.length" class="text-sm text-muted">No appointments yet.</p>
    </div>
  </UCard>
</template>
