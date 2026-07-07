import type { InvoiceListQuery, PaginatedResponse, PaymentListQuery } from '~/types/api'
import { toQueryParams } from '~/types/api'

export const useBillingStore = defineStore('billing', () => {
  const { apiFetch } = useApi()
  const invoices = ref<any[]>([])
  const payments = ref<any[]>([])
  const invoiceCount = ref(0)
  const paymentCount = ref(0)
  const pending = ref(false)

  async function fetchInvoices(
    tenantId?: string | number | null,
    query: InvoiceListQuery = {},
  ) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<any>>('billing/invoices', {
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
      const response = await apiFetch<PaginatedResponse<any>>('billing/payments', {
        tenantId,
        query: toQueryParams(query),
      })
      payments.value = response.results ?? []
      paymentCount.value = response.count ?? payments.value.length
    } finally {
      pending.value = false
    }
  }

  return {
    invoices,
    payments,
    invoiceCount,
    paymentCount,
    pending,
    fetchInvoices,
    fetchPayments,
  }
})
