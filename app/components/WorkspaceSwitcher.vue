<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { workspaces, current, switchTo } = useWorkspace()
const toast = useToast()

const items = computed<DropdownMenuItem[][]>(() => [
  [{ label: 'Switch workspace', type: 'label' }],
  workspaces.value.map((w) => ({
    label: w.name,
    icon: 'i-lucide-building',
    trailingIcon: w.id === current.value.id ? 'i-lucide-check' : undefined,
    onSelect: () => {
      switchTo(w.id)
      toast.add({
        title: `Switched to ${w.name}`,
        icon: 'i-lucide-arrow-left-right',
        color: 'primary',
      })
    },
  })),
  [
    {
      label: 'Create workspace',
      icon: 'i-lucide-plus',
      to: '/platform/tenants',
    },
  ],
])
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'start' }" :ui="{ content: 'w-64' }">
    <UButton
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevrons-up-down"
      class="max-w-56"
    >
      <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <UIcon name="i-lucide-building" class="size-3.5" />
      </span>
      <span class="flex min-w-0 flex-col items-start leading-tight">
        <span class="truncate text-sm font-medium text-highlighted">{{ current?.name || 'Workspace' }}</span>
        <span class="truncate text-xs text-muted capitalize">{{ current?.role || 'member' }}</span>
      </span>
    </UButton>
  </UDropdownMenu>
</template>
