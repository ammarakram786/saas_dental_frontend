<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const billing = useBillingStore()
const { current } = useWorkspace()

const status = ref<string | undefined>(undefined)
const statusItems = [
  { label: 'All statuses', value: undefined },
  { label: 'Draft', value: 'draft' },
  { label: 'Issued', value: 'issued' },
  { label: 'Paid', value: 'paid' },
  { label: 'Void', value: 'void' },
]

async function loadBilling() {
  const tenantId = current.value?.id
  const invoiceQuery = {
    ordering: '-created_at' as const,
    ...(status.value ? { status: status.value as 'draft' | 'issued' | 'paid' | 'void' } : {}),
  }
  await Promise.all([
    billing.fetchInvoices(tenantId, invoiceQuery),
    billing.fetchPayments(tenantId, { ordering: '-created_at' }),
  ])
}

await loadBilling()

watch([status, () => current.value?.id], () => {
  loadBilling()
})
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <ListToolbar
        v-model:status="status"
        :status-items="statusItems"
        :show-search="false"
        show-status
      />
      <InvoiceTerminal :invoices="billing.invoices" />
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Payment history</h2>
      </template>
      <div class="space-y-3">
        <div
          v-for="payment in billing.payments"
          :key="payment.id"
          class="flex items-center justify-between rounded-lg border border-default p-3"
        >
          <span class="text-sm text-highlighted">{{ payment.method }}</span>
          <UBadge color="neutral" variant="subtle" :label="payment.gateway_status" />
        </div>
        <p v-if="!billing.payments.length" class="text-sm text-muted">No payments recorded.</p>
      </div>
    </UCard>
  </div>
</template>
