<script setup lang="ts">
withDefaults(
  defineProps<{
    module?: string
    title?: string
    description?: string
  }>(),
  {
    module: 'this module',
    title: 'Access restricted',
    description: '',
  },
)

const toast = useToast()
const requesting = ref(false)

function requestAccess() {
  requesting.value = true
  setTimeout(() => {
    requesting.value = false
    toast.add({
      title: 'Access request sent',
      description: 'A platform administrator will review your request shortly.',
      icon: 'i-lucide-send',
      color: 'primary',
    })
  }, 700)
}
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center">
    <UCard class="max-w-md text-center" :ui="{ body: 'p-8' }">
      <div class="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
        <UIcon name="i-lucide-lock" class="size-7" />
      </div>
      <h2 class="text-xl font-semibold text-highlighted">{{ title }}</h2>
      <p class="mx-auto mt-2 max-w-sm text-sm text-muted">
        {{ description || `Your platform role does not grant access to ${module}. Request elevated permissions to continue.` }}
      </p>
      <div class="mt-6 flex items-center justify-center gap-3">
        <UButton
          icon="i-lucide-shield-plus"
          label="Request access"
          :loading="requesting"
          @click="requestAccess"
        />
        <UButton to="/platform" color="neutral" variant="outline" label="Back to dashboard" />
      </div>
    </UCard>
  </div>
</template>
