// Centralized frontend mock data + types for the platform control plane.
// No backend wiring — these simulate the shape of future DRF responses.

export type PlatformModuleCodename =
  | 'manage_tenants'
  | 'manage_billing'
  | 'manage_support'
  | 'security_audit'

export type TenantStatus = 'active' | 'suspended' | 'trial'

export type SubscriptionTier = 'starter' | 'growth' | 'scale' | 'enterprise'

export interface MockTenant {
  id: number
  name: string
  subdomain: string
  status: TenantStatus
  tier: SubscriptionTier
  seats: number
  createdAt: string
}

export type TenantRole = 'admin' | 'manager' | 'member'

export interface MockMember {
  id: number
  name: string
  email: string
  role: TenantRole
  avatar?: string
  lastActive: string
}

export interface MockWorkspace {
  id: number
  name: string
  subdomain: string
  plan: SubscriptionTier
}

export type AuditSeverity = 'info' | 'warning' | 'critical'

export interface MockAuditEvent {
  id: number
  actor: string
  action: string
  target: string
  severity: AuditSeverity
  category: 'billing' | 'members' | 'projects' | 'security'
  timestamp: string
}

export interface MockMetric {
  id: string
  label: string
  value: string
  icon: string
  delta: number
  hint: string
}

export interface MockBillingEntry {
  id: string
  description: string
  tenant: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  date: string
}

export const PLATFORM_MODULES: {
  codename: PlatformModuleCodename
  label: string
  description: string
  icon: string
  to: string
}[] = [
  {
    codename: 'manage_tenants',
    label: 'Tenants',
    description: 'Provision and manage customer organizations.',
    icon: 'i-lucide-building-2',
    to: '/platform/tenants',
  },
  {
    codename: 'manage_billing',
    label: 'Billing',
    description: 'Subscriptions, invoices and revenue.',
    icon: 'i-lucide-credit-card',
    to: '/platform/billing',
  },
  {
    codename: 'manage_support',
    label: 'System Support',
    description: 'Operational health and customer support.',
    icon: 'i-lucide-life-buoy',
    to: '/platform/support',
  },
  {
    codename: 'security_audit',
    label: 'Security Audit',
    description: 'Chronological log of sensitive operations.',
    icon: 'i-lucide-shield-check',
    to: '/platform/audit',
  },
]

export const mockTenants: MockTenant[] = [
  { id: 1, name: 'Northgate Dental Group', subdomain: 'northgate', status: 'active', tier: 'scale', seats: 48, createdAt: '2024-01-12T09:24:00Z' },
  { id: 2, name: 'Brightsmile Clinics', subdomain: 'brightsmile', status: 'active', tier: 'growth', seats: 22, createdAt: '2024-03-03T14:10:00Z' },
  { id: 3, name: 'Cedar Valley Health', subdomain: 'cedarvalley', status: 'trial', tier: 'starter', seats: 6, createdAt: '2025-11-21T08:00:00Z' },
  { id: 4, name: 'Atlas Orthodontics', subdomain: 'atlas', status: 'suspended', tier: 'growth', seats: 14, createdAt: '2023-09-18T16:45:00Z' },
  { id: 5, name: 'Lumen Pediatrics', subdomain: 'lumen', status: 'active', tier: 'enterprise', seats: 130, createdAt: '2022-06-30T11:30:00Z' },
  { id: 6, name: 'Riverside Care Partners', subdomain: 'riverside', status: 'active', tier: 'scale', seats: 57, createdAt: '2024-07-09T10:05:00Z' },
  { id: 7, name: 'Summit Family Dentistry', subdomain: 'summit', status: 'trial', tier: 'starter', seats: 4, createdAt: '2026-01-04T12:00:00Z' },
  { id: 8, name: 'Harbor Vision Group', subdomain: 'harbor', status: 'suspended', tier: 'growth', seats: 19, createdAt: '2023-12-22T15:20:00Z' },
  { id: 9, name: 'Meadow Wellness Co.', subdomain: 'meadow', status: 'active', tier: 'growth', seats: 31, createdAt: '2025-02-14T09:00:00Z' },
  { id: 10, name: 'Pinnacle Surgical', subdomain: 'pinnacle', status: 'active', tier: 'enterprise', seats: 210, createdAt: '2021-11-02T08:40:00Z' },
]

export const mockWorkspaces: MockWorkspace[] = [
  { id: 1, name: 'Northgate Dental Group', subdomain: 'northgate', plan: 'scale' },
  { id: 5, name: 'Lumen Pediatrics', subdomain: 'lumen', plan: 'enterprise' },
  { id: 10, name: 'Pinnacle Surgical', subdomain: 'pinnacle', plan: 'enterprise' },
]

export const mockMembers: MockMember[] = [
  { id: 1, name: 'John Okafor', email: 'john@northgate.io', role: 'admin', lastActive: '2026-06-18T08:12:00Z' },
  { id: 2, name: 'Priya Raman', email: 'priya@northgate.io', role: 'manager', lastActive: '2026-06-17T19:40:00Z' },
  { id: 3, name: 'Marco Bellini', email: 'marco@northgate.io', role: 'manager', lastActive: '2026-06-18T07:05:00Z' },
  { id: 4, name: 'Sara Lindqvist', email: 'sara@northgate.io', role: 'member', lastActive: '2026-06-16T13:22:00Z' },
  { id: 5, name: 'Dmitri Volkov', email: 'dmitri@northgate.io', role: 'member', lastActive: '2026-06-18T06:50:00Z' },
  { id: 6, name: 'Aisha Bello', email: 'aisha@northgate.io', role: 'member', lastActive: '2026-06-15T18:00:00Z' },
]

export const mockMetrics: MockMetric[] = [
  { id: 'projects', label: 'Monthly Active Projects', value: '1,284', icon: 'i-lucide-folder-kanban', delta: 12, hint: 'vs last week' },
  { id: 'quota', label: 'Used API Quota', value: '74%', icon: 'i-lucide-gauge', delta: 5, hint: 'of monthly allowance' },
  { id: 'storage', label: 'Active Storage', value: '3.9 TB', icon: 'i-lucide-database', delta: -3, hint: 'vs last week' },
  { id: 'tenants', label: 'Active Tenants', value: '218', icon: 'i-lucide-building-2', delta: 8, hint: 'vs last month' },
]

export const mockAuditEvents: MockAuditEvent[] = [
  { id: 1, actor: 'John Okafor', action: 'updated billing tier to', target: 'Scale', severity: 'info', category: 'billing', timestamp: '2026-06-18T09:42:00Z' },
  { id: 2, actor: 'System', action: 'suspended tenant', target: 'Atlas Orthodontics', severity: 'warning', category: 'security', timestamp: '2026-06-18T08:15:00Z' },
  { id: 3, actor: 'Priya Raman', action: 'deleted project', target: 'Project Beta', severity: 'warning', category: 'projects', timestamp: '2026-06-17T22:03:00Z' },
  { id: 4, actor: 'Marco Bellini', action: 'invited member', target: 'dmitri@northgate.io', severity: 'info', category: 'members', timestamp: '2026-06-17T16:48:00Z' },
  { id: 5, actor: 'Security Bot', action: 'flagged anomalous login for', target: 'harbor.medsaas.io', severity: 'critical', category: 'security', timestamp: '2026-06-17T11:20:00Z' },
  { id: 6, actor: 'Sara Lindqvist', action: 'exported reports for', target: 'Q2 Analytics', severity: 'info', category: 'projects', timestamp: '2026-06-16T14:30:00Z' },
  { id: 7, actor: 'John Okafor', action: 'revoked API key for', target: 'integration-svc', severity: 'warning', category: 'security', timestamp: '2026-06-15T09:10:00Z' },
]

export const mockBillingHistory: MockBillingEntry[] = [
  { id: 'INV-4601', description: 'Scale plan — monthly', tenant: 'Northgate Dental Group', amount: 1290, status: 'paid', date: '2026-06-01T00:00:00Z' },
  { id: 'INV-4602', description: 'Enterprise plan — monthly', tenant: 'Lumen Pediatrics', amount: 4800, status: 'paid', date: '2026-06-01T00:00:00Z' },
  { id: 'INV-4603', description: 'Growth plan — monthly', tenant: 'Brightsmile Clinics', amount: 540, status: 'pending', date: '2026-06-01T00:00:00Z' },
  { id: 'INV-4588', description: 'Growth plan — monthly', tenant: 'Atlas Orthodontics', amount: 540, status: 'failed', date: '2026-05-01T00:00:00Z' },
  { id: 'INV-4575', description: 'Enterprise plan — monthly', tenant: 'Pinnacle Surgical', amount: 7600, status: 'paid', date: '2026-05-01T00:00:00Z' },
]

export const TENANT_STATUS_META: Record<TenantStatus, { label: string; color: 'success' | 'warning' | 'error' | 'neutral' }> = {
  active: { label: 'Active', color: 'success' },
  trial: { label: 'Trial', color: 'warning' },
  suspended: { label: 'Suspended', color: 'error' },
}

export const SUBSCRIPTION_TIERS: { value: SubscriptionTier; label: string }[] = [
  { value: 'starter', label: 'Starter' },
  { value: 'growth', label: 'Growth' },
  { value: 'scale', label: 'Scale' },
  { value: 'enterprise', label: 'Enterprise' },
]

export const TENANT_ROLES: { value: TenantRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'member', label: 'Member' },
]
