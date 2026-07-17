<script setup lang="ts">
const { isPlatformUser, isPatientUser } = usePlatformUser()
const { user } = useUserSession()

onMounted(() => {
  if (isPlatformUser.value) {
    navigateTo('/platform')
    return
  }
  const workspaces = (user.value as { workspaces?: unknown[] } | null)?.workspaces
  if (isPatientUser.value && (!workspaces || workspaces.length === 0)) {
    navigateTo('/patient/dashboard')
    return
  }
  navigateTo('/welcome')
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-default">
    <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-primary" />
  </div>
</template>
