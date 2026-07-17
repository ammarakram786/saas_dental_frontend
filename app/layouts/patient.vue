<script setup lang="ts">
import { patientNavLinks } from '~/config/patient-nav'

const { displayName } = usePlatformUser()
const auth = useAuthStore()
const links = patientNavLinks()

async function logout() {
  await auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <header class="border-b border-default bg-default">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div>
          <p class="text-xs uppercase tracking-wide text-muted">Patient portal</p>
          <p class="font-semibold text-highlighted">Hi, {{ displayName }}</p>
        </div>
        <div class="flex items-center gap-3">
          <UNavigationMenu :items="links" highlight />
          <UButton color="neutral" variant="ghost" size="sm" @click="logout">Sign out</UButton>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
