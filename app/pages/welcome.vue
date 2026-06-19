<script setup lang="ts">
definePageMeta({ layout: false })

const { displayName, user, initials } = usePlatformUser()
const { clear } = useUserSession()
const router = useRouter()
const colorMode = useColorMode()

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

const highlights = [
  { icon: 'i-lucide-calendar-check', title: 'Appointments', text: 'View and manage your schedule in one place.' },
  { icon: 'i-lucide-users', title: 'Your team', text: 'Collaborate with colleagues across your clinic.' },
  { icon: 'i-lucide-bar-chart-3', title: 'Insights', text: 'Track performance with clear, simple reports.' },
]
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-default to-muted/40">
    <header class="border-b border-default bg-default/70 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-2.5">
          <div class="flex size-9 items-center justify-center rounded-xl bg-primary text-inverted">
            <UIcon name="i-lucide-stethoscope" class="size-5" />
          </div>
          <span class="text-lg font-semibold text-highlighted">MedSaaS</span>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            aria-label="Toggle color mode"
            @click="isDark = !isDark"
          />
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-log-out"
            label="Sign out"
            :loading="loggingOut"
            @click="logout"
          />
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div class="flex flex-col items-center text-center">
        <UAvatar :text="initials" :alt="displayName" size="3xl" class="mb-6 ring-4 ring-primary/10" />
        <UBadge color="primary" variant="subtle" label="Workspace member" class="mb-4" />
        <h1 class="text-4xl font-bold tracking-tight text-highlighted sm:text-5xl">
          Welcome back, {{ displayName }}.
        </h1>
        <p class="mt-4 max-w-xl text-lg text-muted">
          You're signed in to your MedSaaS workspace. Everything you need to support
          your clinic is right here.
        </p>
        <p v-if="user?.email" class="mt-2 text-sm text-dimmed">{{ user.email }}</p>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <UButton size="lg" color="primary" trailing-icon="i-lucide-arrow-right" label="Open my workspace" />
          <UButton size="lg" color="neutral" variant="outline" icon="i-lucide-circle-help" label="Get help" />
        </div>
      </div>

      <div class="mt-16 grid gap-4 sm:grid-cols-3">
        <UCard v-for="item in highlights" :key="item.title" class="text-center sm:text-left">
          <div class="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mb-3">
            <UIcon :name="item.icon" class="size-5" />
          </div>
          <h3 class="mt-3 font-semibold text-highlighted sm:mt-0">{{ item.title }}</h3>
          <p class="mt-1 text-sm text-muted">{{ item.text }}</p>
        </UCard>
      </div>
    </main>
  </div>
</template>
