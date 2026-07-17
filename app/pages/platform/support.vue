<script setup lang="ts">
definePageMeta({ layout: 'platform' })
useHead({ title: 'System Support · MedSaaS' })

const { hasModule } = usePlatformUser()
const allowed = computed(() => hasModule('manage_support'))
</script>

<template>
  <div>
    <AccessRestricted v-if="!allowed" module="System Support" />

    <div v-else>
      <div class="mb-6">
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">System support</h1>
        <p class="mt-1 text-sm text-muted">Support ticketing is planned for a future release.</p>
      </div>

      <UCard>
        <div class="flex flex-col items-start gap-3 py-6">
          <div class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UIcon name="i-lucide-life-buoy" class="size-6" />
          </div>
          <h2 class="text-lg font-semibold text-highlighted">Coming in v2</h2>
          <p class="max-w-lg text-sm text-muted">
            There is no ticketing or status API yet. Use the audit log for security events and
            contact your operations channel for urgent incidents.
          </p>
          <UButton label="View audit log" icon="i-lucide-shield-check" to="/platform/audit" />
        </div>
      </UCard>
    </div>
  </div>
</template>
