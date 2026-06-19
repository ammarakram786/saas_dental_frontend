/**
 * Shared collapse state for the platform sidebar. Persisted to localStorage so
 * the user's preference survives reloads.
 */
export function useSidebar() {
  const collapsed = useState<boolean>('sidebar-collapsed', () => false)
  const mobileOpen = useState<boolean>('sidebar-mobile-open', () => false)

  if (import.meta.client) {
    const stored = useLocalStorage('platform-sidebar-collapsed', false)
    // Hydrate once from persisted value, then keep them in sync.
    collapsed.value = stored.value
    watch(collapsed, (v) => {
      stored.value = v
    })
  }

  function toggle() {
    collapsed.value = !collapsed.value
  }

  return { collapsed, mobileOpen, toggle }
}
