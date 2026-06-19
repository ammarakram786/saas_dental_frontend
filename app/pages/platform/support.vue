<script setup lang="ts">
definePageMeta({ layout: 'platform' })
useHead({ title: 'System Support · MedSaaS' })

const { hasModule } = usePlatformUser()
const allowed = computed(() => hasModule('manage_support'))

const services = [
  { name: 'API Gateway', status: 'operational', uptime: '99.98%' },
  { name: 'Tenant Database Cluster', status: 'operational', uptime: '99.95%' },
  { name: 'Background Workers', status: 'degraded', uptime: '98.40%' },
  { name: 'Notification Service', status: 'operational', uptime: '99.99%' },
]

const tickets = [
  { id: 'SUP-2041', subject: 'Cannot invite member', tenant: 'Brightsmile Clinics', priority: 'high', age: '2h' },
  { id: 'SUP-2039', subject: 'Invoice PDF missing', tenant: 'Atlas Orthodontics', priority: 'medium', age: '5h' },
  { id: 'SUP-2035', subject: 'SSO login loop', tenant: 'Lumen Pediatrics', priority: 'high', age: '1d' },
  { id: 'SUP-2030', subject: 'Export timing out', tenant: 'Riverside Care Partners', priority: 'low', age: '2d' },
]

const statusMeta = {
  operational: { color: 'success', icon: 'i-lucide-circle-check', label: 'Operational' },
  degraded: { color: 'warning', icon: 'i-lucide-circle-alert', label: 'Degraded' },
  down: { color: 'error', icon: 'i-lucide-circle-x', label: 'Down' },
} as const

const priorityColor = { high: 'error', medium: 'warning', low: 'neutral' } as const
</script>

<template>
  <div>
    <AccessRestricted v-if="!allowed" module="System Support" />

    <div v-else>
      <div class="mb-6">
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">System support</h1>
        <p class="mt-1 text-sm text-muted">Operational health and customer support queue.</p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">Service status</h2>
          </template>
          <ul class="divide-y divide-default">
            <li
              v-for="svc in services"
              :key="svc.name"
              class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div class="flex items-center gap-2.5">
                <UIcon
                  :name="statusMeta[svc.status as keyof typeof statusMeta].icon"
                  class="size-4"
                  :class="{
                    'text-success': svc.status === 'operational',
                    'text-warning': svc.status === 'degraded',
                    'text-error': svc.status === 'down',
                  }"
                />
                <span class="text-sm font-medium text-highlighted">{{ svc.name }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-muted">{{ svc.uptime }}</span>
                <UBadge
                  :color="statusMeta[svc.status as keyof typeof statusMeta].color"
                  variant="subtle"
                  size="sm"
                  :label="statusMeta[svc.status as keyof typeof statusMeta].label"
                />
              </div>
            </li>
          </ul>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="font-semibold text-highlighted">Open tickets</h2>
              <UBadge color="neutral" variant="subtle" :label="`${tickets.length} open`" />
            </div>
          </template>
          <ul class="divide-y divide-default">
            <li
              v-for="ticket in tickets"
              :key="ticket.id"
              class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-highlighted">{{ ticket.subject }}</p>
                <p class="truncate text-xs text-muted">{{ ticket.id }} · {{ ticket.tenant }} · {{ ticket.age }} ago</p>
              </div>
              <UBadge
                :color="priorityColor[ticket.priority as keyof typeof priorityColor]"
                variant="subtle"
                size="sm"
                class="capitalize"
                :label="ticket.priority"
              />
            </li>
          </ul>
        </UCard>
      </div>
    </div>
  </div>
</template>
