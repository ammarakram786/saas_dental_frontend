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
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password.',
    })
  }

  const user = await $fetch('/api/auth/me/', {
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${tokens.access}` },
  })

  await setUserSession(event, {
    user,
    secure: {
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
    },
    loggedInAt: new Date().toISOString(),
  })

  return { user }
})
