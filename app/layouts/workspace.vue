<script setup lang="ts">
import { workspaceNavLinks } from '~/config/workspace-nav'

const { current } = useWorkspace()
const route = useRoute()

const links = computed(() => {
  const slug = String(current.value?.subdomain || route.params.slug || 'workspace')
  return workspaceNavLinks(slug)
})
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <div class="flex w-full max-w-none gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <aside class="hidden w-72 shrink-0 lg:block">
        <UCard>
          <div class="space-y-4">
            <div>
              <p class="text-xs uppercase tracking-wide text-muted">Workspace</p>
              <h1 class="text-lg font-semibold text-highlighted">{{ current?.name || 'Clinic workspace' }}</h1>
            </div>
            <UNavigationMenu orientation="vertical" :items="links" highlight />
          </div>
        </UCard>
      </aside>

      <main class="min-w-0 w-full flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
