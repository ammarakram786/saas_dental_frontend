export type PlatformModuleCodename =
  | 'manage_tenants'
  | 'manage_billing'
  | 'manage_support'
  | 'security_audit'

export interface PlatformTenant {
  id: number
  name: string
  slug: string
  is_active: boolean
  created_at: string
  updated_at?: string
  admin_user?: PlatformTenantAdminUser
}

export interface PlatformTenantAdminUser {
  id: number
  email: string
  first_name: string
  last_name: string
  created: boolean
}

export interface CreatePlatformTenantPayload {
  name: string
  slug: string
  is_active?: boolean
  admin_user: {
    email: string
    first_name?: string
    last_name?: string
    password?: string
  }
}

export interface UpdatePlatformTenantPayload {
  name?: string
  slug?: string
  is_active?: boolean
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

export interface InsurancePanelListQuery extends ListQueryBase {
  insurer_name?: string
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'arrived'
  | 'completed'
  | 'cancelled'

export interface AppointmentSlot {
  id: number
  tenant: number
  dentist: number
  chair: number
  start_time: string
  end_time: string
  is_available: boolean
}

export interface ClinicAsset {
  id: number
  tenant: number
  name: string
  asset_type: 'chair' | 'xray' | 'suite'
  is_operational: boolean
}

export interface Appointment {
  id: number
  tenant: number
  patient: number
  slot: number | AppointmentSlot
  status: AppointmentStatus
  appointment_type: string
  notes: string
  created_at: string
}

export interface CreateAppointmentPayload {
  patient: number
  slot: number
  status?: AppointmentStatus
  appointment_type: string
  notes?: string
}

export interface SlotAvailabilityQuery {
  tenant?: string | number
  date_from?: string
  date_to?: string
}

export interface Invoice {
  id: number
  tenant: number
  appointment: number
  patient: number
  line_items: unknown[]
  subtotal: string | number
  insurance_coverage: string | number
  copay_amount: string | number
  status: 'draft' | 'issued' | 'paid' | 'void'
  created_at?: string
}

export interface PaymentRecord {
  id: number
  tenant: number
  invoice: number
  method: 'cash' | 'jazzcash'
  amount: string | number
  gateway_ref?: string
  gateway_status: 'pending' | 'success' | 'failed' | 'manual'
  created_at?: string
}

export interface InsurancePanel {
  id: number
  tenant: number
  insurer_name: string
  panel_code: string
  coverage_rules: Record<string, unknown>
}

export interface Odontogram {
  id: number
  tenant: number
  appointment: number
  tooth_map: Record<string, string>
  created_at?: string
}

export interface ClinicalNote {
  id: number
  tenant: number
  appointment: number
  dentist: number
  body: string
  is_locked: boolean
  locked_at: string | null
  created_at?: string
}

export interface TreatmentPlan {
  id: number
  tenant: number
  appointment: number
  phases: unknown[]
  estimated_cost: string | number
  consent_signed: boolean
  created_at?: string
}

export interface Prescription {
  id: number
  tenant: number
  clinical_note: number
  medications: unknown[]
  created_at?: string
}

export interface CreateClinicalNotePayload {
  appointment: number
  dentist?: number
  body: string
}

export interface CreateTreatmentPlanPayload {
  appointment: number
  phases?: unknown[]
  estimated_cost?: string | number
  consent_signed?: boolean
}

export interface TenantMembership {
  id: number
  tenant: number
  user: number | { id: number; email?: string; username?: string; first_name?: string; last_name?: string }
  role: number | { id: number; name: string; slug: string }
  is_active: boolean
}

export interface TenantRole {
  id: number
  tenant: number
  name: string
  slug: string
  description?: string
  is_system?: boolean
  is_active: boolean
  permissions?: string[] | { id: number; codename: string }[]
}

export interface TenantPermissionsResponse {
  permissions: string[]
}

export interface TenantPatient {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  last_appointment_at?: string | null
}

export interface PatientDashboardAppointment {
  id: number
  tenant: number | string
  status: AppointmentStatus
  appointment_type: string
  created_at: string
  slot?: AppointmentSlot | null
}

export interface PatientDashboardInvoice {
  id: number
  status: string
  copay_amount: string | number
  created_at?: string
}

export interface PatientDashboard {
  appointments: PatientDashboardAppointment[]
  invoices: PatientDashboardInvoice[]
}

export interface PatientMedicalProfile {
  id?: number
  allergies?: string
  systemic_conditions?: string
  active_medications?: string
  notes?: string
  [key: string]: unknown
}

export interface UpdatePatientMedicalProfilePayload {
  allergies?: string
  systemic_conditions?: string
  active_medications?: string
  notes?: string
  global_health_notes?: string
}

export interface PatientUserProfile {
  id: number
  date_of_birth?: string | null
  cnic?: string
  primary_phone?: string
  blood_type?: string
  systemic_conditions?: string
  allergies?: string
  active_medications?: string
}

export interface PlatformTeamMember {
  id: number
  user: number | { id: number; email: string; username: string; first_name?: string; last_name?: string }
  role: number | { id: number; name: string; slug: string } | null
  is_super_admin: boolean
  contact_phone?: string
}

export interface PlatformAuditEvent {
  id: number
  actor: string
  action: string
  target: string
  severity: 'info' | 'warning' | 'critical'
  category: string
  created_at: string
}

export interface PlatformInvoice {
  id: number
  tenant: number
  tenant_name?: string
  patient: number
  status: string
  copay_amount: string | number
  subtotal?: string | number
  insurance_coverage?: string | number
  created_at?: string
}

export interface DashboardMetric {
  id: string
  label: string
  value: string
  icon: string
  delta: number
  hint: string
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
