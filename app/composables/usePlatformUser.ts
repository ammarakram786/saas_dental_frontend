import type { PlatformModuleCodename } from '~/utils/mock'

const ALL_MODULES: PlatformModuleCodename[] = [
  'manage_tenants',
  'manage_billing',
  'manage_support',
  'security_audit',
]

/**
 * Role-aware wrapper around the auth session.
 *
 * Platform user = `is_super_admin === true` OR `platform_role !== null`.
 * Everyone else is treated as a tenant user (welcome screen only).
 *
 * `allowedModules` mocks `platform_role.allowed_modules`. It is shared app-wide
 * via `useState` and can be toggled at runtime to demo permission-lock states.
 */
export function usePlatformUser() {
  const { user, loggedIn } = useUserSession()

  const isPlatformUser = computed(() => {
    const u = user.value
    if (!u) return false
    if (u.actor_types?.includes('platform')) return true
    return u.is_super_admin === true || u.platform_role !== null
  })

  const isTenantUser = computed(() => loggedIn.value && !isPlatformUser.value)

  const allowedModules = computed<PlatformModuleCodename[]>(() => {
    const modules = (user.value?.platform_modules ?? []) as PlatformModuleCodename[]
    return modules.length ? modules : [...ALL_MODULES]
  })

  function hasModule(codename: PlatformModuleCodename) {
    if (user.value?.is_super_admin) return true
    return allowedModules.value.includes(codename)
  }

  const displayName = computed(() => {
    const u = user.value
    if (!u) return 'there'
    const full = [u.first_name, u.last_name].filter(Boolean).join(' ')
    return full || u.username
  })

  const initials = computed(() => {
    const u = user.value
    if (!u) return '?'
    const parts = [u.first_name, u.last_name].filter(Boolean)
    if (parts.length) return parts.map((p) => p[0]!.toUpperCase()).join('')
    return u.username.slice(0, 2).toUpperCase()
  })

  return {
    user,
    loggedIn,
    isPlatformUser,
    isTenantUser,
    allowedModules,
    hasModule,
    displayName,
    initials,
    ALL_MODULES,
  }
}
