<script setup lang="ts">
const search = defineModel<string>('search', { default: '' })
const status = defineModel<string | undefined>('status', { default: undefined })
const ordering = defineModel<string | undefined>('ordering', { default: undefined })

withDefaults(
  defineProps<{
    searchPlaceholder?: string
    statusItems?: Array<{ label: string; value: string | undefined }>
    orderingItems?: Array<{ label: string; value: string }>
    showSearch?: boolean
    showStatus?: boolean
    showOrdering?: boolean
  }>(),
  {
    searchPlaceholder: 'Search...',
    showSearch: true,
    showStatus: false,
    showOrdering: false,
    statusItems: () => [],
    orderingItems: () => [],
  },
)
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 border-b border-default p-4">
    <UInput
      v-if="showSearch"
      v-model="search"
      icon="i-lucide-search"
      :placeholder="searchPlaceholder"
      class="max-w-sm flex-1"
    />
    <USelect
      v-if="showStatus && statusItems.length"
      v-model="status"
      :items="statusItems"
      value-key="value"
      placeholder="All statuses"
      class="min-w-40"
    />
    <USelect
      v-if="showOrdering && orderingItems.length"
      v-model="ordering"
      :items="orderingItems"
      value-key="value"
      placeholder="Sort by"
      class="min-w-44"
    />
    <slot />
  </div>
</template>
