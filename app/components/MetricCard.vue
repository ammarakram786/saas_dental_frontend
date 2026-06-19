<script setup lang="ts">
import type { MockMetric } from '~/utils/mock'

const props = defineProps<{
  metric: MockMetric
  loading?: boolean
}>()

const trendUp = computed(() => props.metric.delta >= 0)
</script>

<template>
  <UCard :ui="{ body: 'sm:p-5' }">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 space-y-2">
        <p class="truncate text-sm font-medium text-muted">{{ metric.label }}</p>

        <USkeleton v-if="loading" class="h-8 w-24" />
        <p v-else class="text-3xl font-bold tracking-tight text-highlighted">
          {{ metric.value }}
        </p>

        <USkeleton v-if="loading" class="h-4 w-28" />
        <div v-else class="flex items-center gap-1.5 text-sm">
          <span
            class="inline-flex items-center gap-0.5 font-medium"
            :class="trendUp ? 'text-success' : 'text-error'"
          >
            <UIcon
              :name="trendUp ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
              class="size-4"
            />
            {{ trendUp ? '+' : '' }}{{ metric.delta }}%
          </span>
          <span class="text-dimmed">{{ metric.hint }}</span>
        </div>
      </div>

      <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <UIcon :name="metric.icon" class="size-5" />
      </div>
    </div>
  </UCard>
</template>
