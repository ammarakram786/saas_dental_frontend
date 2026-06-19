<script setup lang="ts">
// `/` is a role-based router target only — the global auth middleware
// redirects to `/platform` (platform users) or `/welcome` (tenant users).
const { isPlatformUser } = usePlatformUser()

onMounted(() => {
  navigateTo(isPlatformUser.value ? '/platform' : '/welcome')
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-default">
    <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-primary" />
  </div>
</template>
