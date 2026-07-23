export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig(event)
  const session = await getUserSession(event)
  const path = getRouterParam(event, 'path')
  const targetPath = Array.isArray(path) ? path.join('/') : path

  if (!session.secure?.accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required.',
    })
  }

  const method = event.method
  const body = method === 'GET' || method === 'HEAD' ? undefined : await readBody(event)
  const query = getQuery(event)
  const tenantHeader = getHeader(event, 'x-tenant-id')

  try {
    return await $fetch(`/api/${targetPath}/`, {
      baseURL: apiBase,
      method,
      query,
      body,
      headers: {
        Authorization: `Bearer ${session.secure.accessToken}`,
        ...(tenantHeader ? { 'X-Tenant-ID': tenantHeader } : {}),
      },
    })
  } catch (error: any) {
    const status = error?.statusCode || error?.response?.status || 502
    throw createError({
      statusCode: status,
      statusMessage:
        error?.data?.detail ||
        error?.statusMessage ||
        error?.message ||
        'Upstream API request failed.',
      data: error?.data,
    })
  }
})
