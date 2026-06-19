<script setup lang="ts">
import { mockMetrics, mockAuditEvents } from '~/utils/mock'

definePageMeta({ layout: 'platform' })
useHead({ title: 'Dashboard · MedSaaS' })

const search = ref('')
const category = ref('All categories')
const range = ref('Last 7 days')

const { data: metrics, pending } = useMockQuery(() => mockMetrics, { delay: 900 })
const recent = computed(() => mockAuditEvents.slice(0, 4))
</script>

<template>
  <div>
    <div class="mb-1 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">Analytics overview</h1>
        <p class="mt-1 text-sm text-muted">
          Cross-tenant telemetry aggregated across isolated database scopes.
        </p>
      </div>
      <UBadge color="success" variant="subtle" icon="i-lucide-circle" label="Live" />
    </div>

    <FilterBar v-model:search="search" v-model:category="category" v-model:range="range" />

    <!-- Metrics grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        v-for="metric in (metrics ?? mockMetrics)"
        :key="metric.id"
        :metric="metric"
        :loading="pending"
      />
    </div>

    <!-- Lower panels -->
    <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-highlighted">Usage trend</h2>
            <span class="text-xs text-muted">{{ range }}</span>
          </div>
        </template>

        <div v-if="pending" class="space-y-3">
          <USkeleton class="h-40 w-full" />
        </div>
        <div v-else class="flex h-40 items-end gap-2">
          <div
            v-for="(h, i) in [40, 62, 48, 75, 58, 88, 70]"
            :key="i"
            class="flex-1 rounded-t-md bg-primary/80 transition-all hover:bg-primary"
            :style="{ height: `${h}%` }"
          />
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-highlighted">Recent activity</h2>
            <UButton
              to="/platform/audit"
              size="xs"
              color="neutral"
              variant="link"
              label="View all"
              trailing-icon="i-lucide-arrow-right"
            />
          </div>
        </template>

        <div v-if="pending" class="space-y-4">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3">
            <USkeleton class="size-8 rounded-full" />
            <div class="flex-1 space-y-1.5">
              <USkeleton class="h-3 w-3/4" />
              <USkeleton class="h-3 w-1/3" />
            </div>
          </div>
        </div>
        <ul v-else class="space-y-4">
          <li v-for="event in recent" :key="event.id" class="flex items-start gap-3">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-elevated text-muted">
              <UIcon name="i-lucide-activity" class="size-4" />
            </span>
            <div class="min-w-0 text-sm">
              <p class="text-highlighted">
                <span class="font-medium">{{ event.actor }}</span>
                {{ event.action }}
                <span class="font-medium">{{ event.target }}</span>
              </p>
              <p class="text-xs text-dimmed">{{ new Date(event.timestamp).toLocaleString() }}</p>
            </div>
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
