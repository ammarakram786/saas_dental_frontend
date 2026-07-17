<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const billing = useBillingStore()
const scheduling = useSchedulingStore()
const { current } = useWorkspace()
const toast = useToast()

const status = ref<string | undefined>(undefined)
const createOpen = ref(false)
const payOpen = ref(false)
const selectedInvoiceId = ref<number | null>(null)

const statusItems = [
  { label: 'All statuses', value: undefined },
  { label: 'Draft', value: 'draft' },
  { label: 'Issued', value: 'issued' },
  { label: 'Paid', value: 'paid' },
  { label: 'Void', value: 'void' },
]

const invoiceForm = reactive({
  appointment: '' as string | number,
  patient: '' as string | number,
  subtotal: '0',
  copay_amount: '0',
  insurance_coverage: '0',
  status: 'issued',
  description: 'Consultation',
})

const payForm = reactive({
  amount: '0',
  method: 'cash' as 'cash' | 'jazzcash',
})

async function loadBilling() {
  const tenantId = current.value?.id
  const invoiceQuery = {
    ordering: '-created_at' as const,
    ...(status.value ? { status: status.value as 'draft' | 'issued' | 'paid' | 'void' } : {}),
  }
  await Promise.all([
    billing.fetchInvoices(tenantId, invoiceQuery),
    billing.fetchPayments(tenantId, { ordering: '-created_at' }),
    scheduling.fetchAppointments(tenantId, { ordering: '-created_at' }),
  ])
}

await loadBilling()

watch([status, () => current.value?.id], () => {
  loadBilling()
})

const appointmentItems = computed(() =>
  scheduling.items.map((a) => ({
    label: `#${a.id} · patient ${a.patient} · ${a.appointment_type}`,
    value: a.id,
  })),
)

watch(
  () => invoiceForm.appointment,
  (id) => {
    const appt = scheduling.items.find((a) => a.id === Number(id))
    if (appt) invoiceForm.patient = appt.patient
  },
)

async function createInvoice() {
  try {
    await billing.createInvoice(current.value?.id, {
      appointment: Number(invoiceForm.appointment),
      patient: Number(invoiceForm.patient),
      line_items: [{ description: invoiceForm.description, amount: invoiceForm.subtotal }],
      subtotal: invoiceForm.subtotal,
      copay_amount: invoiceForm.copay_amount,
      insurance_coverage: invoiceForm.insurance_coverage,
      status: invoiceForm.status as any,
    })
    toast.add({ title: 'Invoice created', color: 'success' })
    createOpen.value = false
    await loadBilling()
  } catch (err: any) {
    toast.add({ title: 'Create failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}

function openPay(invoiceId: number, amount: string | number) {
  selectedInvoiceId.value = invoiceId
  payForm.amount = String(amount)
  payOpen.value = true
}

async function recordPayment() {
  if (!selectedInvoiceId.value) return
  try {
    await billing.createPayment(current.value?.id, {
      invoice: selectedInvoiceId.value,
      amount: payForm.amount,
      method: payForm.method,
      gateway_status: payForm.method === 'cash' ? 'manual' : 'pending',
    })
    toast.add({ title: 'Payment recorded', color: 'success' })
    payOpen.value = false
    await loadBilling()
  } catch (err: any) {
    toast.add({ title: 'Payment failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <ListToolbar
        v-model:status="status"
        :status-items="statusItems"
        :show-search="false"
        show-status
      />
      <UButton label="New invoice" icon="i-lucide-plus" @click="createOpen = true" />
    </div>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Invoice terminal</h2>
      </template>
      <div class="space-y-3">
        <div
          v-for="invoice in billing.invoices"
          :key="invoice.id"
          class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-default p-3"
        >
          <div>
            <p class="font-medium text-highlighted">Invoice #{{ invoice.id }}</p>
            <p class="text-xs text-muted">
              Patient {{ invoice.patient }} · Status: {{ invoice.status }} · Copay {{ invoice.copay_amount }}
            </p>
          </div>
          <UButton
            size="sm"
            variant="soft"
            label="Record payment"
            @click="openPay(invoice.id, invoice.copay_amount)"
          />
        </div>
        <p v-if="!billing.invoices.length" class="text-sm text-muted">No invoices available.</p>
      </div>
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
          <span class="text-sm text-highlighted">
            {{ payment.method }} · {{ payment.amount }} · invoice {{ payment.invoice }}
          </span>
          <UBadge color="neutral" variant="subtle" :label="payment.gateway_status" />
        </div>
        <p v-if="!billing.payments.length" class="text-sm text-muted">No payments recorded.</p>
      </div>
    </UCard>

    <UModal v-model:open="createOpen" title="Create invoice">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Appointment">
            <USelect v-model="invoiceForm.appointment" :items="appointmentItems" value-key="value" class="w-full" />
          </UFormField>
          <UFormField label="Patient ID">
            <UInput v-model="invoiceForm.patient" type="number" class="w-full" />
          </UFormField>
          <UFormField label="Description">
            <UInput v-model="invoiceForm.description" class="w-full" />
          </UFormField>
          <UFormField label="Subtotal">
            <UInput v-model="invoiceForm.subtotal" class="w-full" />
          </UFormField>
          <UFormField label="Insurance coverage">
            <UInput v-model="invoiceForm.insurance_coverage" class="w-full" />
          </UFormField>
          <UFormField label="Copay">
            <UInput v-model="invoiceForm.copay_amount" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="outline" label="Cancel" @click="createOpen = false" />
          <UButton label="Create" :loading="billing.mutating" @click="createInvoice" />
        </div>
      </template>
    </UModal>

    <UModal v-model:open="payOpen" title="Record payment">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Amount">
            <UInput v-model="payForm.amount" class="w-full" />
          </UFormField>
          <UFormField label="Method">
            <USelect
              v-model="payForm.method"
              :items="[{ label: 'Cash', value: 'cash' }, { label: 'JazzCash', value: 'jazzcash' }]"
              value-key="value"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="outline" label="Cancel" @click="payOpen = false" />
          <UButton label="Record" :loading="billing.mutating" @click="recordPayment" />
        </div>
      </template>
    </UModal>
  </div>
</template>
