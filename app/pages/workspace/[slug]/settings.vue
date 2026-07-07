<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })
</script>

<template>
  <UCard>
    <h1 class="text-xl font-semibold text-highlighted">Workspace settings</h1>
    <p class="mt-2 text-sm text-muted">
      Tenant branding, roles, and clinic configuration will live here.
    </p>
  </UCard>
</template>
