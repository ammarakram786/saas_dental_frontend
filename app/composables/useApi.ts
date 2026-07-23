type ApiOptions<T> = Parameters<typeof $fetch<T>>[1] & {
  tenantId?: string | number | null
  query?: Record<string, string | number | boolean | undefined>
}

export function useApi() {
  // Forward the incoming Cookie header during SSR so /api/proxy can read the
  // sealed session and attach the Django JWT. Plain $fetch does not do this.
  const requestFetch = useRequestFetch()

  async function apiFetch<T>(path: string, options: ApiOptions<T> = {}) {
    const headers = new Headers(options.headers as HeadersInit | undefined)
    if (options.tenantId) headers.set('X-Tenant-ID', String(options.tenantId))

    return await requestFetch<T>(`/api/proxy/${path.replace(/^\/+/, '')}`, {
      ...options,
      headers,
    })
  }

  return { apiFetch }
}
