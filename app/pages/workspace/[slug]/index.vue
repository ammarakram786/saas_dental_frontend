<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const { current } = useWorkspace()
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <h1 class="text-2xl font-bold text-highlighted">{{ current?.name || 'Workspace overview' }}</h1>
      <p class="mt-2 text-sm text-muted">
        Clinic dashboard shell for scheduling, billing, and clinical workflows.
      </p>
    </UCard>
  </div>
</template>
