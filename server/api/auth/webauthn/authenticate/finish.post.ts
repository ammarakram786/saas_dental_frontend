export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig(event)
  const body = await readBody(event)
  const result = await $fetch<{
    user: any
    access: string
    refresh: string
  }>('/api/auth/webauthn/authenticate/finish/', {
    baseURL: apiBase,
    method: 'POST',
    body,
  })

  await setUserSession(event, {
    user: result.user,
    secure: {
      accessToken: result.access,
      refreshToken: result.refresh,
    },
    loggedInAt: new Date().toISOString(),
  })

  return { user: result.user }
})
