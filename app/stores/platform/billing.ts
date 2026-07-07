import type { InvoiceListQuery, PaginatedResponse } from '~/types/api'
import { toQueryParams } from '~/types/api'

export interface PlatformInvoice {
  id: number
  tenant_name: string
  subtotal: number
  insurance_coverage: number
  copay_amount: number
  status: string
  created_at: string
}

export const usePlatformBillingStore = defineStore('platform-billing', () => {
  const { apiFetch } = useApi()
  const items = ref<PlatformInvoice[]>([])
  const count = ref(0)
  const pending = ref(false)

  async function fetch(query: InvoiceListQuery = {}) {
    pending.value = true
    try {
      const response = await apiFetch<PaginatedResponse<PlatformInvoice>>('platform/billing', {
        query: toQueryParams(query),
      })
      items.value = response.results ?? []
      count.value = response.count ?? items.value.length
    } finally {
      pending.value = false
    }
  }

  /** @deprecated use fetch() */
  async function fetchAll() {
    return fetch()
  }

  return { items, count, pending, fetch, fetchAll }
})
