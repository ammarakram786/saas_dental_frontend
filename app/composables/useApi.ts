type ApiOptions<T> = Parameters<typeof $fetch<T>>[1] & {
  tenantId?: string | number | null
  query?: Record<string, string | number | boolean | undefined>
}

export function useApi() {
  async function apiFetch<T>(path: string, options: ApiOptions<T> = {}) {
    const headers = new Headers(options.headers as HeadersInit | undefined)
    if (options.tenantId) headers.set('X-Tenant-ID', String(options.tenantId))

    return await $fetch<T>(`/api/proxy/${path.replace(/^\/+/, '')}`, {
      ...options,
      headers,
    })
  }

  return { apiFetch }
}
