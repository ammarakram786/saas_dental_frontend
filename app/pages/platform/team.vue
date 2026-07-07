<script setup lang="ts">
definePageMeta({ layout: 'platform' })
useHead({ title: 'Team & Workspaces · MedSaaS' })

const { current } = useWorkspace()
const store = usePlatformTeamStore()

const search = ref('')
await store.fetch()

watchDebounced(
  search,
  (value) => {
    store.fetch({ search: value || undefined })
  },
  { debounce: 300 },
)

const view = ref('members')
const viewItems = [
  { label: 'Members', icon: 'i-lucide-users', value: 'members' },
  { label: 'Workspace setup', icon: 'i-lucide-plus', value: 'create' },
]
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">Team &amp; workspaces</h1>
        <p class="mt-1 text-sm text-muted">
          Managing <span class="font-medium text-highlighted">{{ current?.name || 'your workspace' }}</span>.
        </p>
      </div>
      <UTabs v-model="view" :items="viewItems" :content="false" variant="pill" size="sm" />
    </div>

    <div v-if="view === 'members'">
      <UCard>
        <ListToolbar v-model:search="search" search-placeholder="Search team members..." />

        <div v-if="store.pending" class="space-y-3 p-4">
          <USkeleton v-for="i in 5" :key="i" class="h-12 w-full" />
        </div>
        <div v-else class="divide-y divide-default px-4">
          <div
            v-for="member in store.items"
            :key="member.id"
            class="flex items-center justify-between gap-4 py-3"
          >
            <div>
              <p class="font-medium text-highlighted">
                {{ [member.first_name, member.last_name].filter(Boolean).join(' ') || member.username }}
              </p>
              <p class="text-sm text-muted">{{ member.email }}</p>
            </div>
            <UBadge
              color="primary"
              variant="subtle"
              :label="member.platform_role ? `Role #${member.platform_role}` : 'No platform role'"
            />
          </div>
          <p v-if="!store.items.length" class="py-4 text-sm text-muted">No members match your search.</p>
        </div>
      </UCard>
    </div>

    <div v-else class="max-w-2xl">
      <OnboardingWizard />
    </div>
  </div>
</template>
