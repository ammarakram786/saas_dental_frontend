<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const membershipStore = useTenantMembershipStore()
const { current } = useWorkspace()

const search = ref('')

async function loadMembers() {
  await membershipStore.fetch(current.value?.id, {
    search: search.value || undefined,
    ordering: '-created_at',
  })
}

await loadMembers()

watch(() => current.value?.id, () => loadMembers())

watchDebounced(search, () => loadMembers(), { debounce: 300 })
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-xl font-semibold text-highlighted">Team</h1>
    </template>

    <ListToolbar v-model:search="search" search-placeholder="Search team members..." />

    <div v-if="membershipStore.pending" class="space-y-3 p-4">
      <USkeleton v-for="i in 4" :key="i" class="h-12 w-full" />
    </div>
    <div v-else class="space-y-3 p-4">
      <div
        v-for="member in membershipStore.items"
        :key="member.id"
        class="rounded-lg border border-default p-3"
      >
        <p class="font-medium text-highlighted">{{ member.user_display }}</p>
        <p class="text-sm text-muted">{{ member.role_name }}</p>
      </div>
      <p v-if="!membershipStore.items.length" class="text-sm text-muted">No team members found.</p>
    </div>
  </UCard>
</template>
