/**
 * Simulates an async data fetch against an isolated tenant scope so that
 * `<USkeleton>` loaders can be exercised. Returns reactive `data` + `pending`.
 */
export function useMockQuery<T>(
  source: T | (() => T),
  options: { delay?: number; immediate?: boolean } = {},
) {
  const { delay = 750, immediate = true } = options

  const resolve = () =>
    typeof source === 'function' ? (source as () => T)() : source

  const data = ref<T | null>(null) as Ref<T | null>
  const pending = ref(false)

  let timer: ReturnType<typeof setTimeout> | undefined

  function run() {
    pending.value = true
    data.value = null
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      data.value = resolve()
      pending.value = false
    }, delay)
  }

  if (immediate && import.meta.client) {
    run()
  } else if (immediate) {
    // On the server resolve synchronously so SSR has content.
    data.value = resolve()
  }

  onScopeDispose(() => {
    if (timer) clearTimeout(timer)
  })

  return { data, pending, refresh: run }
}
