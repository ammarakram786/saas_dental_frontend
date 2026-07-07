<script setup lang="ts">
const { current } = useWorkspace()
const route = useRoute()

const links = computed(() => {
  const slug = current.value?.subdomain || route.params.slug || 'workspace'
  return [
    { label: 'Overview', to: `/workspace/${slug}` },
    { label: 'Team', to: `/workspace/${slug}/team` },
    { label: 'Schedule', to: `/workspace/${slug}/schedule` },
    { label: 'Billing', to: `/workspace/${slug}/billing/invoices` },
  ]
})
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <div class="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
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

      <main class="min-w-0 flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
