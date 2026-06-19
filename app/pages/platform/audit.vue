<script setup lang="ts">
import { mockAuditEvents } from '~/utils/mock'

definePageMeta({ layout: 'platform' })
useHead({ title: 'Security Audit · MedSaaS' })

const { hasModule } = usePlatformUser()
const allowed = computed(() => hasModule('security_audit'))

const { data: events, pending } = useMockQuery(() => [...mockAuditEvents], { delay: 850 })

const filter = ref('all')
const filterItems = [
  { label: 'All events', value: 'all' },
  { label: 'Billing', value: 'billing' },
  { label: 'Members', value: 'members' },
  { label: 'Projects', value: 'projects' },
  { label: 'Security', value: 'security' },
]

const filtered = computed(() => {
  const list = events.value ?? []
  if (filter.value === 'all') return list
  return list.filter((e) => e.category === filter.value)
})
</script>

<template>
  <div>
    <AccessRestricted v-if="!allowed" module="Security Audit" />

    <div v-else class="mx-auto max-w-3xl">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-highlighted">Security audit</h1>
          <p class="mt-1 text-sm text-muted">Chronological log of sensitive platform operations.</p>
        </div>
        <USelect v-model="filter" :items="filterItems" value-key="value" class="min-w-40" />
      </div>

      <UCard>
        <AuditTimeline :events="filtered" :loading="pending" />
        <p v-if="!pending && !filtered.length" class="py-8 text-center text-sm text-muted">
          No events in this category.
        </p>
      </UCard>
    </div>
  </div>
</template>
