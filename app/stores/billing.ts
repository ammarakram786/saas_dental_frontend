import type {
  InsurancePanel,
  InsurancePanelListQuery,
  Invoice,
  InvoiceListQuery,
  PaginatedResponse,
  PaymentListQuery,
  PaymentRecord,
} from '~/types/api'
import { toQueryParams } from '~/types/api'

export const useBillingStore = defineStore('billing', () => {
  const { apiFetch } = useApi()
  const invoices = ref<Invoice[]>([])
  const payments = ref<PaymentRecord[]>([])
  const panels = ref<InsurancePanel[]>([])
  const invoiceCount = ref(0)
  const paymentCount = ref(0)
  const pending = ref(false)
  const mutating = ref(false)

  async function fetchInvoices(
    tenantId?: string | number | null,
    query: InvoiceListQuery = {},
  ) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<Invoice>>('billing/invoices', {
        tenantId,
        query: toQueryParams(query),
      })
      invoices.value = response.results ?? []
      invoiceCount.value = response.count ?? invoices.value.length
    } finally {
      pending.value = false
    }
  }

  async function fetchPayments(
    tenantId?: string | number | null,
    query: PaymentListQuery = {},
  ) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<PaymentRecord>>('billing/payments', {
        tenantId,
        query: toQueryParams(query),
      })
      payments.value = response.results ?? []
      paymentCount.value = response.count ?? payments.value.length
    } finally {
      pending.value = false
    }
  }

  async function fetchInsurancePanels(
    tenantId?: string | number | null,
    query: InsurancePanelListQuery = {},
  ) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<InsurancePanel>>(
        'billing/insurance-panels',
        { tenantId, query: toQueryParams(query) },
      )
      panels.value = response.results ?? []
    } finally {
      pending.value = false
    }
  }

  async function createInvoice(
    tenantId: string | number | null | undefined,
    payload: Partial<Invoice>,
  ) {
    mutating.value = true
    try {
      const invoice = await apiFetch<Invoice>('billing/invoices', {
        method: 'POST',
        tenantId,
        body: payload,
      })
      invoices.value = [invoice, ...invoices.value]
      invoiceCount.value += 1
      return invoice
    } finally {
      mutating.value = false
    }
  }

  async function createPayment(
    tenantId: string | number | null | undefined,
    payload: Partial<PaymentRecord>,
  ) {
    mutating.value = true
    try {
      const payment = await apiFetch<PaymentRecord>('billing/payments', {
        method: 'POST',
        tenantId,
        body: payload,
      })
      payments.value = [payment, ...payments.value]
      paymentCount.value += 1
      return payment
    } finally {
      mutating.value = false
    }
  }

  async function createPanel(
    tenantId: string | number | null | undefined,
    payload: Partial<InsurancePanel>,
  ) {
    mutating.value = true
    try {
      const panel = await apiFetch<InsurancePanel>('billing/insurance-panels', {
        method: 'POST',
        tenantId,
        body: payload,
      })
      panels.value = [panel, ...panels.value]
      return panel
    } finally {
      mutating.value = false
    }
  }

  async function updatePanel(
    tenantId: string | number | null | undefined,
    id: number,
    payload: Partial<InsurancePanel>,
  ) {
    mutating.value = true
    try {
      const panel = await apiFetch<InsurancePanel>(`billing/insurance-panels/${id}`, {
        method: 'PATCH',
        tenantId,
        body: payload,
      })
      panels.value = panels.value.map((p) => (p.id === id ? panel : p))
      return panel
    } finally {
      mutating.value = false
    }
  }

  async function deletePanel(tenantId: string | number | null | undefined, id: number) {
    mutating.value = true
    try {
      await apiFetch(`billing/insurance-panels/${id}`, { method: 'DELETE', tenantId })
      panels.value = panels.value.filter((p) => p.id !== id)
    } finally {
      mutating.value = false
    }
  }

  return {
    invoices,
    payments,
    panels,
    invoiceCount,
    paymentCount,
    pending,
    mutating,
    fetchInvoices,
    fetchPayments,
    fetchInsurancePanels,
    createInvoice,
    createPayment,
    createPanel,
    updatePanel,
    deletePanel,
  }
})
