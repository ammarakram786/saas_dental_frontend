import { mockWorkspaces, type MockWorkspace } from '~/utils/mock'

/**
 * Client-side "current workspace" context for the workspace switcher.
 * Purely in-memory mock state — switching does not hit any backend.
 */
export function useWorkspace() {
  const workspaces = useState<MockWorkspace[]>('workspaces', () => mockWorkspaces)
  const currentId = useState<number>('current-workspace-id', () => mockWorkspaces[0]!.id)

  const current = computed(
    () => workspaces.value.find((w) => w.id === currentId.value) ?? workspaces.value[0]!,
  )

  function switchTo(id: number) {
    if (workspaces.value.some((w) => w.id === id)) {
      currentId.value = id
    }
  }

  return { workspaces, current, switchTo }
}
