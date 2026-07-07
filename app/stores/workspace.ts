export interface WorkspaceSummary {
  id: number
  name: string
  subdomain: string
  role?: string
}

export const useWorkspaceStore = defineStore('workspace', () => {
  const { user } = useUserSession()
  const currentId = useState<number | null>('workspace-current-id', () => null)

  const workspaces = computed<WorkspaceSummary[]>(() => user.value?.workspaces ?? [])
  const current = computed(() => {
    if (!workspaces.value.length) return null
    return (
      workspaces.value.find((item) => item.id === currentId.value) ??
      workspaces.value[0] ??
      null
    )
  })

  watch(
    workspaces,
    (items) => {
      if (!items.length) {
        currentId.value = null
        return
      }
      if (!items.some((item) => item.id === currentId.value)) {
        currentId.value = items[0]!.id
      }
    },
    { immediate: true },
  )

  function switchTo(id: number) {
    currentId.value = id
  }

  return { workspaces, current, currentId, switchTo }
})
