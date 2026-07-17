export function useTenantPermissions() {
  const { apiFetch } = useApi()
  const { current } = useWorkspace()
  const permissions = useState<string[]>('tenant-permissions', () => [])
  const pending = ref(false)

  async function fetch() {
    if (!current.value?.id) {
      permissions.value = []
      return
    }
    pending.value = true
    try {
      const data = await apiFetch<{ permissions: string[] }>('tenant/me/permissions', {
        tenantId: current.value.id,
      })
      permissions.value = data.permissions ?? []
    } finally {
      pending.value = false
    }
  }

  function hasPermission(codename: string) {
    return permissions.value.includes(codename)
  }

  return { permissions, pending, fetch, hasPermission }
}
