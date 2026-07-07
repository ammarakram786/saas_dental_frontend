<script setup lang="ts">
import { toQueryParams } from '~/types/api'

definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const { apiFetch } = useApi()
const { current } = useWorkspace()
const route = useRoute()

const patientId = computed(() => Number(route.params.patientId))

const { data } = await useAsyncData(
  () => `patient-clinical-${patientId.value}-${current.value?.id}`,
  async () => {
    const query = toQueryParams({ patient: patientId.value, ordering: '-created_at' })
    const [odontograms, notes, plans] = await Promise.all([
      apiFetch<{ results?: any[] }>('clinical/odontograms', {
        tenantId: current.value?.id,
        query,
      }),
      apiFetch<{ results?: any[] }>('clinical/notes', {
        tenantId: current.value?.id,
        query,
      }),
      apiFetch<{ results?: any[] }>('clinical/treatment-plans', {
        tenantId: current.value?.id,
        query,
      }),
    ])

    return {
      odontogram: odontograms.results?.[0]?.tooth_map ?? {},
      notes: notes.results ?? [],
      plans: plans.results ?? [],
    }
  },
  { watch: [patientId, () => current.value?.id] },
)
</script>

<template>
  <div class="space-y-6">
    <OdontogramCanvas :model-value="data?.odontogram" />

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">Clinical notes</h2>
      </template>
      <div class="space-y-3">
        <div v-for="note in data?.notes ?? []" :key="note.id" class="rounded-lg border border-default p-3">
          <p class="text-sm text-highlighted">{{ note.body }}</p>
          <p class="text-xs text-muted">Locked: {{ note.is_locked ? 'Yes' : 'No' }}</p>
        </div>
        <p v-if="!data?.notes?.length" class="text-sm text-muted">No clinical notes for this patient.</p>
      </div>
    </UCard>
  </div>
</template>
