export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  const { isPlatformUser } = usePlatformUser()

  // Unauthenticated: only /login is reachable.
  if (to.path === '/login') {
    if (loggedIn.value) {
      return navigateTo(isPlatformUser.value ? '/platform' : '/welcome')
    }
    return
  }

  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  // Branch the landing page by role.
  if (to.path === '/') {
    return navigateTo(isPlatformUser.value ? '/platform' : '/welcome')
  }

  // Tenant users have no access to the platform control plane.
  if (to.path.startsWith('/platform') && !isPlatformUser.value) {
    return navigateTo('/welcome')
  }
})
