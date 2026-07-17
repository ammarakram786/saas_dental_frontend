<script setup lang="ts">
definePageMeta({ layout: 'platform' })
useHead({ title: 'Team & Workspaces · MedSaaS' })

const store = usePlatformTeamStore()
const toast = useToast()

const search = ref('')
await Promise.all([store.fetch(), store.fetchRoles()])

watchDebounced(
  search,
  (value) => {
    store.fetch({ search: value || undefined })
  },
  { debounce: 300 },
)

const roleItems = computed(() => [
  { label: 'No role', value: null as number | null },
  ...store.roles.map((r) => ({ label: r.name, value: r.id as number | null })),
])

async function onRoleChange(memberId: number, roleId: number | null) {
  try {
    await store.updateMember(memberId, { platform_role: roleId })
    toast.add({ title: 'Role updated', color: 'success', icon: 'i-lucide-check' })
  } catch (err: any) {
    toast.add({
      title: 'Update failed',
      description: err?.data?.detail || err?.message || 'Could not update role.',
      color: 'error',
    })
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">Platform team</h1>
        <p class="mt-1 text-sm text-muted">Assign control-plane roles to platform operators.</p>
      </div>
      <UButton label="Provision tenant" icon="i-lucide-plus" to="/platform/tenants" />
    </div>

    <UCard>
      <ListToolbar v-model:search="search" search-placeholder="Search team members..." />

      <div v-if="store.pending" class="space-y-3 p-4">
        <USkeleton v-for="i in 5" :key="i" class="h-12 w-full" />
      </div>
      <div v-else class="divide-y divide-default px-4">
        <div
          v-for="member in store.items"
          :key="member.id"
          class="flex flex-wrap items-center justify-between gap-4 py-3"
        >
          <div>
            <p class="font-medium text-highlighted">
              {{ [member.first_name, member.last_name].filter(Boolean).join(' ') || member.username }}
            </p>
            <p class="text-sm text-muted">{{ member.email }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UBadge
              v-if="member.is_super_admin"
              color="warning"
              variant="subtle"
              label="Super admin"
            />
            <USelect
              :model-value="member.platform_role"
              :items="roleItems"
              value-key="value"
              class="min-w-44"
              :disabled="member.is_super_admin || store.updating"
              @update:model-value="(v: number | null) => onRoleChange(member.id, v)"
            />
          </div>
        </div>
        <p v-if="!store.items.length" class="py-4 text-sm text-muted">No members match your search.</p>
      </div>
    </UCard>
  </div>
</template>
