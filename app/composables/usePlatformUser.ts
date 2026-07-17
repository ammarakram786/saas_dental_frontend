import type { PlatformModuleCodename } from '~/types/api'
import { ALL_PLATFORM_MODULES } from '~/config/platform-nav'

/**
 * Role-aware wrapper around the auth session.
 *
 * Platform user = `is_super_admin === true` OR `platform_role !== null`
 * OR actor_types includes 'platform'.
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

  const isPatientUser = computed(() => {
    const actors = user.value?.actor_types ?? []
    return actors.includes('patient')
  })

  const allowedModules = computed<PlatformModuleCodename[]>(() => {
    const modules = (user.value?.platform_modules ?? []) as PlatformModuleCodename[]
    return modules.length ? modules : [...ALL_PLATFORM_MODULES]
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
    isPatientUser,
    allowedModules,
    hasModule,
    displayName,
    initials,
    ALL_MODULES: ALL_PLATFORM_MODULES,
  }
}
