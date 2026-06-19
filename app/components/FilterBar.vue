<script setup lang="ts">
const search = defineModel<string>('search', { default: '' })
const category = defineModel<string>('category', { default: 'All categories' })
const range = defineModel<string>('range', { default: 'Last 7 days' })

withDefaults(
  defineProps<{
    categories?: string[]
    ranges?: string[]
  }>(),
  {
    categories: () => ['All categories', 'Billing', 'Members', 'Projects', 'Security'],
    ranges: () => ['Today', 'Last 7 days', 'Last 30 days', 'This quarter', 'Year to date'],
  },
)
</script>

<template>
  <div
    class="sticky top-16 z-20 -mx-4 mb-6 border-b border-default bg-default/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
  >
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Search analytics..."
        class="sm:max-w-xs sm:flex-1"
      />
      <div class="flex flex-wrap items-center gap-3 sm:ms-auto">
        <USelectMenu
          v-model="range"
          :items="ranges"
          icon="i-lucide-calendar"
          class="min-w-40"
        />
        <USelectMenu
          v-model="category"
          :items="categories"
          icon="i-lucide-filter"
          class="min-w-44"
        />
        <UButton color="neutral" variant="outline" icon="i-lucide-download" label="Export" />
      </div>
    </div>
  </div>
</template>
