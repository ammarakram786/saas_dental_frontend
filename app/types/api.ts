export interface PlatformTenant {
  id: number
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/** Params common to all list endpoints */
export interface ListQueryBase {
  search?: string
  ordering?: string
  page?: number
  page_size?: number
}

export interface InvoiceListQuery extends ListQueryBase {
  status?: 'draft' | 'issued' | 'paid' | 'void'
  patient?: number
  tenant?: number
}

export interface PaymentListQuery extends ListQueryBase {
  invoice?: number
  method?: 'cash' | 'jazzcash'
  gateway_status?: 'pending' | 'success' | 'failed' | 'manual'
}

export interface AppointmentListQuery extends ListQueryBase {
  status?: 'pending' | 'confirmed' | 'arrived' | 'completed' | 'cancelled'
  patient?: number
  appointment_type?: string
}

export interface ClinicalListQuery extends ListQueryBase {
  patient?: number
  appointment?: number
  is_locked?: boolean
  consent_signed?: boolean
}

export interface TenantListQuery extends ListQueryBase {
  is_active?: boolean
}

export interface TenantMembershipListQuery extends ListQueryBase {
  user?: number
  role?: number
  is_active?: boolean
}

export interface PlatformUserListQuery extends ListQueryBase {
  is_active?: boolean
  is_super_admin?: boolean
  platform_role?: number
}

export interface AuditListQuery extends ListQueryBase {
  severity?: 'info' | 'warning' | 'critical'
  category?: string
}

/** Strip undefined values so $fetch does not send empty query keys */
export function toQueryParams<T extends Record<string, unknown>>(query: T): Record<string, string | number> {
  const params: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value as string | number
    }
  }
  return params
}
