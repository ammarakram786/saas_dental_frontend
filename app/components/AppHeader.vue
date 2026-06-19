<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { toggle, mobileOpen } = useSidebar()
const { displayName, initials, user } = usePlatformUser()
const colorMode = useColorMode()
const router = useRouter()
const { clear } = useUserSession()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (v) => {
    colorMode.preference = v ? 'dark' : 'light'
  },
})

const loggingOut = ref(false)
async function logout() {
  loggingOut.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clear()
    await router.push('/login')
  } finally {
    loggingOut.value = false
  }
}

const userItems = computed<DropdownMenuItem[][]>(() => [
  [{ label: displayName.value, description: user.value?.email, type: 'label' }],
  [
    { label: 'Settings', icon: 'i-lucide-settings', to: '/platform/settings' },
    { label: 'Security audit', icon: 'i-lucide-shield-check', to: '/platform/audit' },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: () => logout(),
    },
  ],
])
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-default bg-default/80 px-4 backdrop-blur"
  >
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-panel-left"
      class="hidden md:inline-flex"
      aria-label="Toggle sidebar"
      @click="toggle"
    />
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-menu"
      class="md:hidden"
      aria-label="Open menu"
      @click="mobileOpen = true"
    />

    <WorkspaceSwitcher />

    <div class="ms-auto flex items-center gap-1.5">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-search"
        aria-label="Search"
        class="hidden sm:inline-flex"
      />
      <UButton
        color="neutral"
        variant="ghost"
        :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
        aria-label="Toggle color mode"
        @click="isDark = !isDark"
      />
      <UChip color="error" inset>
        <UButton color="neutral" variant="ghost" icon="i-lucide-bell" aria-label="Notifications" />
      </UChip>

      <UDropdownMenu :items="userItems" :content="{ align: 'end' }" :ui="{ content: 'w-56' }">
        <UButton color="neutral" variant="ghost" class="gap-2">
          <UAvatar :alt="displayName" :text="initials" size="sm" />
          <span class="hidden text-sm font-medium text-highlighted lg:inline">{{ displayName }}</span>
        </UButton>
      </UDropdownMenu>
    </div>
  </header>
</template>
