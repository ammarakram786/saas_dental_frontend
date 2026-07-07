<script setup lang="ts">
const props = defineProps<{
  modelValue?: Record<string, string>
}>()

const entries = computed(() =>
  Object.entries(props.modelValue ?? {}).length
    ? Object.entries(props.modelValue ?? {})
    : Array.from({ length: 8 }, (_, index) => [`T${index + 1}`, 'healthy']),
)
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-semibold text-highlighted">Odontogram</h2>
    </template>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      <div
        v-for="[tooth, state] in entries"
        :key="tooth"
        class="rounded-lg border border-default p-3 text-center"
      >
        <p class="text-sm font-medium text-highlighted">{{ tooth }}</p>
        <p class="text-xs text-muted">{{ state }}</p>
      </div>
    </div>
  </UCard>
</template>
