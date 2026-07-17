<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const { current } = useWorkspace()
const { apiFetch } = useApi()
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, pending } = await useAsyncData(
  () => `tenant-patients-${current.value?.id}`,
  async () => {
    if (!current.value?.id) return { results: [] as any[] }
    return apiFetch<{ results: any[] }>('tenant/patients', { tenantId: current.value.id })
  },
  { watch: [() => current.value?.id] },
)
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-xl font-semibold text-highlighted">Patients</h1>
    </template>

    <div v-if="pending" class="space-y-3">
      <USkeleton v-for="i in 4" :key="i" class="h-12 w-full" />
    </div>
    <div v-else class="divide-y divide-default">
      <NuxtLink
        v-for="patient in data?.results ?? []"
        :key="patient.id"
        :to="`/workspace/${slug}/clinical/${patient.id}`"
        class="flex items-center justify-between gap-3 p-4 hover:bg-elevated/50"
      >
        <div>
          <p class="font-medium text-highlighted">
            {{ [patient.first_name, patient.last_name].filter(Boolean).join(' ') || patient.username }}
          </p>
          <p class="text-sm text-muted">{{ patient.email }}</p>
        </div>
        <UIcon name="i-lucide-chevron-right" class="size-4 text-muted" />
      </NuxtLink>
      <p v-if="!(data?.results?.length)" class="p-4 text-sm text-muted">
        No patients with appointments yet.
      </p>
    </div>
  </UCard>
</template>
