<script setup lang="ts">
import type { DashboardMetric } from '~/types/api'

definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const { current } = useWorkspace()
const scheduling = useSchedulingStore()
const billing = useBillingStore()
const memberships = useTenantMembershipStore()

await Promise.all([
  scheduling.fetchAppointments(current.value?.id, { ordering: '-created_at' }),
  billing.fetchInvoices(current.value?.id, { ordering: '-created_at' }),
  billing.fetchPayments(current.value?.id, { ordering: '-created_at' }),
  memberships.fetch(current.value?.id),
])

const metrics = computed<DashboardMetric[]>(() => {
  const byStatus = scheduling.items.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  }, {})
  const outstanding = billing.invoices
    .filter((i) => i.status !== 'paid' && i.status !== 'void')
    .reduce((sum, i) => sum + Number(i.copay_amount || 0), 0)

  return [
    {
      id: 'appts',
      label: 'Appointments',
      value: String(scheduling.count),
      icon: 'i-lucide-calendar',
      delta: byStatus.confirmed || 0,
      hint: `${byStatus.confirmed || 0} confirmed`,
    },
    {
      id: 'outstanding',
      label: 'Outstanding copay',
      value: `PKR ${outstanding.toLocaleString()}`,
      icon: 'i-lucide-receipt',
      delta: billing.invoices.filter((i) => i.status === 'issued').length,
      hint: 'open invoices',
    },
    {
      id: 'team',
      label: 'Team size',
      value: String(memberships.count),
      icon: 'i-lucide-users',
      delta: 0,
      hint: 'active memberships',
    },
    {
      id: 'payments',
      label: 'Payments recorded',
      value: String(billing.paymentCount),
      icon: 'i-lucide-wallet',
      delta: 0,
      hint: 'all time',
    },
  ]
})

const slug = computed(() => current.value?.subdomain || '')
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <h1 class="text-2xl font-bold text-highlighted">{{ current?.name || 'Workspace overview' }}</h1>
      <p class="mt-2 text-sm text-muted">
        Clinic dashboard for scheduling, billing, and clinical workflows.
      </p>
    </UCard>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard v-for="metric in metrics" :key="metric.id" :metric="metric" />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-highlighted">Recent appointments</h2>
            <UButton size="sm" variant="ghost" :to="`/workspace/${slug}/schedule`">View all</UButton>
          </div>
        </template>
        <div class="space-y-2">
          <div
            v-for="appt in scheduling.items.slice(0, 5)"
            :key="appt.id"
            class="flex items-center justify-between rounded-lg border border-default p-3"
          >
            <div>
              <p class="text-sm font-medium text-highlighted">{{ appt.appointment_type }}</p>
              <p class="text-xs text-muted">Patient #{{ appt.patient }}</p>
            </div>
            <UBadge color="neutral" variant="subtle" class="capitalize" :label="appt.status" />
          </div>
          <p v-if="!scheduling.items.length" class="text-sm text-muted">No appointments yet.</p>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-highlighted">Outstanding invoices</h2>
            <UButton size="sm" variant="ghost" :to="`/workspace/${slug}/billing/invoices`">View all</UButton>
          </div>
        </template>
        <div class="space-y-2">
          <div
            v-for="inv in billing.invoices.filter((i) => i.status !== 'paid').slice(0, 5)"
            :key="inv.id"
            class="flex items-center justify-between rounded-lg border border-default p-3"
          >
            <div>
              <p class="text-sm font-medium text-highlighted">Invoice #{{ inv.id }}</p>
              <p class="text-xs text-muted">Copay {{ inv.copay_amount }}</p>
            </div>
            <UBadge color="warning" variant="subtle" class="capitalize" :label="inv.status" />
          </div>
          <p
            v-if="!billing.invoices.filter((i) => i.status !== 'paid').length"
            class="text-sm text-muted"
          >
            No outstanding invoices.
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
