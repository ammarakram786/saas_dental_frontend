interface TokenResponse {
  access: string
  refresh: string
}

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{
    username?: string
    password?: string
  }>(event)

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required.',
    })
  }

  const { apiBase } = useRuntimeConfig(event)

  let tokens: TokenResponse
  try {
    tokens = await $fetch<TokenResponse>('/api/auth/token/', {
      baseURL: apiBase,
      method: 'POST',
      body: { username, password },
    })
  } catch (error: any) {
    const status = error?.statusCode || error?.response?.status
    throw createError({
      statusCode: status === 401 ? 401 : 502,
      statusMessage:
        status === 401
          ? 'Invalid username or password.'
          : 'Unable to reach authentication service.',
    })
  }

  let user
  try {
    user = await $fetch('/api/auth/me/', {
      baseURL: apiBase,
      headers: { Authorization: `Bearer ${tokens.access}` },
    })
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Authenticated, but failed to load user profile.',
    })
  }

  try {
    await setUserSession(event, {
      user,
      secure: {
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
      },
      loggedInAt: new Date().toISOString(),
    })
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        error?.message === 'Empty password'
          ? 'Server misconfiguration: NUXT_SESSION_PASSWORD is missing.'
          : 'Failed to create login session.',
    })
  }

  return { user }
})
