export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()
  const { isPlatformUser } = usePlatformUser()

  const actors = user.value?.actor_types ?? []
  const workspaces = (user.value as { workspaces?: unknown[] } | null)?.workspaces
  const isPatientOnly =
    !isPlatformUser.value &&
    actors.includes('patient') &&
    (!actors.includes('tenant') || !workspaces || workspaces.length === 0)

  if (to.path === '/login') {
    if (loggedIn.value) {
      if (isPlatformUser.value) return navigateTo('/platform')
      if (isPatientOnly) return navigateTo('/patient/dashboard')
      return navigateTo('/welcome')
    }
    return
  }

  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  if (to.path === '/') {
    if (isPlatformUser.value) return navigateTo('/platform')
    if (isPatientOnly) return navigateTo('/patient/dashboard')
    return navigateTo('/welcome')
  }

  if (to.path.startsWith('/platform') && !isPlatformUser.value) {
    return navigateTo(isPatientOnly ? '/patient/dashboard' : '/welcome')
  }
})
