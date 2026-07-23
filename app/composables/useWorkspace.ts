export function useWorkspace() {
  const store = useWorkspaceStore()
  const { workspaces, current, currentId } = storeToRefs(store)
  return {
    workspaces,
    current,
    currentId,
    switchTo: store.switchTo,
  }
}
