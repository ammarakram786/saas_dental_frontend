export const useAuthStore = defineStore('auth', () => {
  const { user, loggedIn, fetch: refreshSession, clear } = useUserSession()

  async function login(username: string, password: string) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    })
    await refreshSession()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clear()
  }

  async function beginPasskey(username: string) {
    return await $fetch('/api/auth/webauthn/authenticate/begin', {
      method: 'POST',
      body: { username },
    })
  }

  async function finishPasskey(username: string, credential: Record<string, any>) {
    await $fetch('/api/auth/webauthn/authenticate/finish', {
      method: 'POST',
      body: { username, credential },
    })
    await refreshSession()
  }

  async function requestMagicLink(email: string) {
    return await $fetch('/api/auth/magic-link/request', {
      method: 'POST',
      body: { email },
    })
  }

  return { user, loggedIn, login, logout, beginPasskey, finishPasskey, requestMagicLink }
})
