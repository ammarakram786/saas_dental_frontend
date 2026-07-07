export default defineNuxtRouteMiddleware((to) => {
  const store = useWorkspaceStore()
  const slug = String(to.params.slug || '')
  const match = store.workspaces.find((item) => item.subdomain === slug)
  if (match) {
    store.switchTo(match.id)
  }
})
