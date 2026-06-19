<script setup lang="ts">
import type { MockAuditEvent, AuditSeverity } from '~/utils/mock'

defineProps<{
  events: MockAuditEvent[]
  loading?: boolean
}>()

const SEVERITY_META: Record<
  AuditSeverity,
  { dot: string; ring: string; icon: string; badge: 'info' | 'warning' | 'error' }
> = {
  info: { dot: 'bg-info', ring: 'ring-info/20', icon: 'i-lucide-info', badge: 'info' },
  warning: { dot: 'bg-warning', ring: 'ring-warning/20', icon: 'i-lucide-triangle-alert', badge: 'warning' },
  critical: { dot: 'bg-error', ring: 'ring-error/20', icon: 'i-lucide-octagon-alert', badge: 'error' },
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div>
    <!-- Loading skeleton -->
    <ol v-if="loading" class="relative ms-2 space-y-8 border-s border-default ps-8">
      <li v-for="i in 4" :key="i" class="space-y-2">
        <USkeleton class="h-4 w-2/3" />
        <USkeleton class="h-3 w-1/4" />
      </li>
    </ol>

    <ol v-else class="relative ms-2 space-y-8 border-s border-default ps-8">
      <li v-for="event in events" :key="event.id" class="relative">
        <!-- Circle indicator -->
        <span
          class="absolute -start-[41px] flex size-5 items-center justify-center rounded-full ring-4 ring-default"
          :class="SEVERITY_META[event.severity].ring"
        >
          <span class="size-2.5 rounded-full" :class="SEVERITY_META[event.severity].dot" />
        </span>

        <div class="flex flex-col gap-1 rounded-xl border border-default bg-default p-4 shadow-sm">
          <div class="flex flex-wrap items-center gap-2">
            <UIcon
              :name="SEVERITY_META[event.severity].icon"
              class="size-4"
              :class="{
                'text-info': event.severity === 'info',
                'text-warning': event.severity === 'warning',
                'text-error': event.severity === 'critical',
              }"
            />
            <p class="text-sm text-highlighted">
              <span class="font-semibold">{{ event.actor }}</span>
              {{ event.action }}
              <span class="font-semibold">{{ event.target }}</span>
            </p>
            <UBadge
              :color="SEVERITY_META[event.severity].badge"
              variant="subtle"
              size="sm"
              class="capitalize"
              :label="event.category"
            />
          </div>
          <time class="text-xs text-dimmed">{{ formatTime(event.timestamp) }}</time>
        </div>
      </li>
    </ol>
  </div>
</template>
