<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const { current } = useWorkspace()
const { permissions, fetch: fetchPermissions } = useTenantPermissions()
await fetchPermissions()
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <h1 class="text-xl font-semibold text-highlighted">Workspace settings</h1>
      <p class="mt-2 text-sm text-muted">
        Clinic identity is managed by the platform. Below is your current workspace context and permissions.
      </p>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Clinic</h2>
      </template>
      <dl class="grid gap-3 sm:grid-cols-2">
        <div>
          <dt class="text-xs uppercase text-muted">Name</dt>
          <dd class="text-sm font-medium text-highlighted">{{ current?.name }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-muted">Slug</dt>
          <dd class="text-sm font-medium text-highlighted">{{ current?.subdomain }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-muted">Your role</dt>
          <dd class="text-sm font-medium text-highlighted">{{ current?.role || '—' }}</dd>
        </div>
      </dl>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Your permissions</h2>
      </template>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="codename in permissions"
          :key="codename"
          color="primary"
          variant="subtle"
          :label="codename"
        />
        <p v-if="!permissions.length" class="text-sm text-muted">No permissions loaded.</p>
      </div>
    </UCard>
  </div>
</template>
