<script setup lang="ts">
const toothStates = ['healthy', 'caries', 'filled', 'missing', 'crown', 'root_canal'] as const

const model = defineModel<Record<string, string>>({ default: () => ({}) })
defineProps<{ editable?: boolean }>()

const entries = computed(() => {
  const map = model.value && Object.keys(model.value).length
    ? model.value
    : Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`T${i + 1}`, 'healthy']))
  return Object.entries(map)
})

function cycleState(tooth: string, current: string) {
  const idx = toothStates.indexOf(current as any)
  const next = toothStates[(idx + 1) % toothStates.length]
  model.value = { ...model.value, [tooth]: next }
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-semibold text-highlighted">Odontogram</h2>
    </template>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      <button
        v-for="[tooth, state] in entries"
        :key="tooth"
        type="button"
        class="rounded-lg border border-default p-3 text-center transition-colors"
        :class="editable ? 'hover:border-primary cursor-pointer' : 'cursor-default'"
        :disabled="!editable"
        @click="editable && cycleState(tooth, state)"
      >
        <p class="text-sm font-medium text-highlighted">{{ tooth }}</p>
        <p class="text-xs text-muted">{{ state }}</p>
      </button>
    </div>
    <p v-if="editable" class="mt-3 text-xs text-muted">Click a tooth to cycle clinical state.</p>
  </UCard>
</template>
