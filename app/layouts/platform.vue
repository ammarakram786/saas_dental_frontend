<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { PLATFORM_MODULES } from '~/utils/mock'

const { mobileOpen } = useSidebar()
const { hasModule } = usePlatformUser()

const mobileItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/platform' },
  ...PLATFORM_MODULES.filter((m) => hasModule(m.codename)).map((m) => ({
    label: m.label,
    icon: m.icon,
    to: m.to,
  })),
  { label: 'Team & Workspaces', icon: 'i-lucide-users', to: '/platform/team' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '/platform/settings' },
])

const route = useRoute()
watch(() => route.fullPath, () => {
  mobileOpen.value = false
})
</script>

<template>
  <div class="flex min-h-screen bg-muted/30">
    <AppSidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader />
      <main class="flex-1">
        <div class="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile navigation -->
    <USlideover v-model:open="mobileOpen" side="left" title="MedSaaS" description="Control Plane">
      <template #body>
        <UNavigationMenu orientation="vertical" :items="mobileItems" highlight />
      </template>
    </USlideover>
  </div>
</template>
