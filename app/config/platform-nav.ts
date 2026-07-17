import type { PlatformModuleCodename } from '~/types/api'

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
    codename: 'security_audit',
    label: 'Security Audit',
    description: 'Chronological log of sensitive operations.',
    icon: 'i-lucide-shield-check',
    to: '/platform/audit',
  },
]

export const ALL_PLATFORM_MODULES: PlatformModuleCodename[] = [
  'manage_tenants',
  'manage_billing',
  'manage_support',
  'security_audit',
]
