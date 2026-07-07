<script setup lang="ts">
definePageMeta({ layout: 'platform' })
useHead({ title: 'Billing · MedSaaS' })

const { hasModule } = usePlatformUser()
const allowed = computed(() => hasModule('manage_billing'))
const store = usePlatformBillingStore()

const status = ref<string | undefined>(undefined)
const statusItems = [
  { label: 'All statuses', value: undefined },
  { label: 'Draft', value: 'draft' },
  { label: 'Issued', value: 'issued' },
  { label: 'Paid', value: 'paid' },
  { label: 'Void', value: 'void' },
]

async function loadInvoices() {
  await store.fetch({
    ordering: '-created_at',
    ...(status.value ? { status: status.value as 'draft' | 'issued' | 'paid' | 'void' } : {}),
  })
}

await loadInvoices()

watch(status, () => {
  loadInvoices()
})

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const totalCollected = computed(() =>
  store.items.filter((e) => e.status === 'paid').reduce((sum, e) => sum + Number(e.copay_amount), 0),
)
const outstanding = computed(() =>
  store.items
    .filter((e) => e.status !== 'paid')
    .reduce((sum, e) => sum + Number(e.copay_amount), 0),
)

const statusColor = { paid: 'success', draft: 'neutral', issued: 'warning', void: 'error' } as const
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
          <USkeleton v-if="store.pending" class="mt-2 h-8 w-28" />
          <p v-else class="mt-1 text-2xl font-bold text-highlighted">{{ currency.format(totalCollected) }}</p>
        </UCard>
        <UCard>
          <p class="text-sm text-muted">Outstanding</p>
          <USkeleton v-if="store.pending" class="mt-2 h-8 w-28" />
          <p v-else class="mt-1 text-2xl font-bold text-warning">{{ currency.format(outstanding) }}</p>
        </UCard>
        <UCard>
          <p class="text-sm text-muted">Active subscriptions</p>
          <USkeleton v-if="store.pending" class="mt-2 h-8 w-16" />
          <p v-else class="mt-1 text-2xl font-bold text-highlighted">{{ store.count }}</p>
        </UCard>
      </div>

      <UCard>
        <template #header>
          <h2 class="font-semibold text-highlighted">Invoice history</h2>
        </template>

        <ListToolbar
          v-model:status="status"
          :status-items="statusItems"
          :show-search="false"
          show-status
        />

        <div v-if="store.pending" class="space-y-3 p-4">
          <USkeleton v-for="i in 5" :key="i" class="h-10 w-full" />
        </div>
        <ul v-else class="divide-y divide-default px-4">
          <li
            v-for="entry in store.items"
            :key="entry.id"
            class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-highlighted">Invoice #{{ entry.id }}</p>
              <p class="truncate text-xs text-muted">
                {{ entry.tenant_name }} · {{ dateFmt.format(new Date(entry.created_at)) }}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              <span class="text-sm font-medium text-highlighted">{{ currency.format(Number(entry.copay_amount)) }}</span>
              <UBadge :color="statusColor[entry.status as keyof typeof statusColor]" variant="subtle" class="capitalize" :label="entry.status" />
            </div>
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
