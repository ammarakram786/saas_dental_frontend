<script setup lang="ts">
import { mockBillingHistory } from '~/utils/mock'

definePageMeta({ layout: 'platform' })
useHead({ title: 'Billing · MedSaaS' })

const { hasModule } = usePlatformUser()
const allowed = computed(() => hasModule('manage_billing'))

const { data, pending } = useMockQuery(() => [...mockBillingHistory], { delay: 800 })

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const totalCollected = computed(() =>
  (data.value ?? []).filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0),
)
const outstanding = computed(() =>
  (data.value ?? [])
    .filter((e) => e.status !== 'paid')
    .reduce((sum, e) => sum + e.amount, 0),
)

const statusColor = { paid: 'success', pending: 'warning', failed: 'error' } as const
</script>

<template>
  <div>
    <AccessRestricted v-if="!allowed" module="Billing" />

    <div v-else>
      <div class="mb-6">
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">Billing</h1>
        <p class="mt-1 text-sm text-muted">Revenue, subscriptions and invoice history.</p>
      </div>

      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UCard>
          <p class="text-sm text-muted">Collected (MTD)</p>
          <USkeleton v-if="pending" class="mt-2 h-8 w-28" />
          <p v-else class="mt-1 text-2xl font-bold text-highlighted">{{ currency.format(totalCollected) }}</p>
        </UCard>
        <UCard>
          <p class="text-sm text-muted">Outstanding</p>
          <USkeleton v-if="pending" class="mt-2 h-8 w-28" />
          <p v-else class="mt-1 text-2xl font-bold text-warning">{{ currency.format(outstanding) }}</p>
        </UCard>
        <UCard>
          <p class="text-sm text-muted">Active subscriptions</p>
          <USkeleton v-if="pending" class="mt-2 h-8 w-16" />
          <p v-else class="mt-1 text-2xl font-bold text-highlighted">{{ (data ?? []).length }}</p>
        </UCard>
      </div>

      <UCard>
        <template #header>
          <h2 class="font-semibold text-highlighted">Invoice history</h2>
        </template>

        <div v-if="pending" class="space-y-3">
          <USkeleton v-for="i in 5" :key="i" class="h-10 w-full" />
        </div>
        <ul v-else class="divide-y divide-default">
          <li
            v-for="entry in data"
            :key="entry.id"
            class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-highlighted">{{ entry.description }}</p>
              <p class="truncate text-xs text-muted">
                {{ entry.id }} · {{ entry.tenant }} · {{ dateFmt.format(new Date(entry.date)) }}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              <span class="text-sm font-medium text-highlighted">{{ currency.format(entry.amount) }}</span>
              <UBadge :color="statusColor[entry.status]" variant="subtle" class="capitalize" :label="entry.status" />
            </div>
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
