export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig(event)
  const body = await readBody(event)
  return await $fetch('/api/auth/magic-link/request/', {
    baseURL: apiBase,
    method: 'POST',
    body,
  })
})
