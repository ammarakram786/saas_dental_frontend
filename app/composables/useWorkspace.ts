export function useWorkspace() {
  const store = useWorkspaceStore()
  return {
    workspaces: store.workspaces,
    current: store.current,
    switchTo: store.switchTo,
  }
}
