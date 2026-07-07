export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig(event)
  const session = await getUserSession(event)
  const path = getRouterParam(event, 'path')
  const targetPath = Array.isArray(path) ? path.join('/') : path

  const method = event.method
  const body = method === 'GET' || method === 'HEAD' ? undefined : await readBody(event)
  const query = getQuery(event)
  const tenantHeader = getHeader(event, 'x-tenant-id')

  return await $fetch(`/api/${targetPath}/`, {
    baseURL: apiBase,
    method,
    query,
    body,
    headers: {
      ...(session.secure?.accessToken
        ? { Authorization: `Bearer ${session.secure.accessToken}` }
        : {}),
      ...(tenantHeader ? { 'X-Tenant-ID': tenantHeader } : {}),
    },
  })
})
