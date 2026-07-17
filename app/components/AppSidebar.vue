<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { PLATFORM_MODULES } from '~/config/platform-nav'

const { collapsed } = useSidebar()
const { hasModule, user } = usePlatformUser()

const moduleItems = computed<NavigationMenuItem[]>(() =>
  PLATFORM_MODULES.filter((m) => hasModule(m.codename)).map((m) => ({
    label: m.label,
    icon: m.icon,
    to: m.to,
  })),
)

const primaryItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/platform' },
  ...moduleItems.value,
])

const secondaryItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Team & Workspaces', icon: 'i-lucide-users', to: '/platform/team' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '/platform/settings' },
])
</script>

<template>
  <aside
    class="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-default bg-default transition-[width] duration-300 ease-in-out md:flex"
    :class="collapsed ? 'w-[72px]' : 'w-64'"
  >
    <!-- Brand -->
    <div class="flex h-16 items-center gap-2.5 border-b border-default px-4">
      <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-inverted">
        <UIcon name="i-lucide-shield" class="size-5" />
      </div>
      <div v-if="!collapsed" class="min-w-0">
        <p class="truncate text-sm font-semibold text-highlighted">MedSaaS</p>
        <p class="truncate text-xs text-muted">Control Plane</p>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
      <div>
        <p v-if="!collapsed" class="px-2 pb-1.5 text-xs font-semibold uppercase tracking-wider text-dimmed">
          Platform
        </p>
        <UNavigationMenu
          orientation="vertical"
          :collapsed="collapsed"
          :items="primaryItems"
          :tooltip="collapsed"
          highlight
        />
      </div>

      <div class="mt-auto">
        <p v-if="!collapsed" class="px-2 pb-1.5 text-xs font-semibold uppercase tracking-wider text-dimmed">
          Organization
        </p>
        <UNavigationMenu
          orientation="vertical"
          :collapsed="collapsed"
          :items="secondaryItems"
          :tooltip="collapsed"
        />
      </div>
    </div>

    <!-- Role footer -->
    <div class="border-t border-default p-3">
      <div
        class="flex items-center gap-2 rounded-lg bg-elevated/50 px-2 py-2"
        :class="collapsed && 'justify-center'"
      >
        <UIcon
          :name="user?.is_super_admin ? 'i-lucide-crown' : 'i-lucide-badge-check'"
          class="size-4 shrink-0 text-primary"
        />
        <span v-if="!collapsed" class="truncate text-xs font-medium text-muted">
          {{ user?.is_super_admin ? 'Super Admin' : 'Platform Operator' }}
        </span>
      </div>
    </div>
  </aside>
</template>
