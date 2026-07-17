<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const membershipStore = useTenantMembershipStore()
const { current } = useWorkspace()
const toast = useToast()
const inviteOpen = ref(false)
const search = ref('')

const invite = reactive({
  user: '' as string | number,
  role: '' as string | number,
})

async function loadMembers() {
  await Promise.all([
    membershipStore.fetch(current.value?.id, {
      search: search.value || undefined,
      ordering: '-created_at',
    }),
    membershipStore.fetchRoles(current.value?.id),
  ])
}

await loadMembers()

watch(() => current.value?.id, () => loadMembers())
watchDebounced(search, () => loadMembers(), { debounce: 300 })

const roleItems = computed(() =>
  membershipStore.roles.map((r) => ({ label: r.name, value: r.id })),
)

async function inviteMember() {
  try {
    await membershipStore.createMembership(current.value?.id, {
      user: Number(invite.user),
      role: Number(invite.role),
      is_active: true,
    })
    toast.add({ title: 'Member added', color: 'success' })
    inviteOpen.value = false
    await loadMembers()
  } catch (err: any) {
    toast.add({ title: 'Invite failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}

async function changeRole(membershipId: number, roleId: number) {
  try {
    await membershipStore.updateMembership(current.value?.id, membershipId, { role: roleId })
    toast.add({ title: 'Role updated', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Update failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-xl font-semibold text-highlighted">Team</h1>
        <UButton label="Add member" icon="i-lucide-user-plus" @click="inviteOpen = true" />
      </div>
    </template>

    <ListToolbar v-model:search="search" search-placeholder="Search team members..." />

    <div v-if="membershipStore.pending" class="space-y-3 p-4">
      <USkeleton v-for="i in 4" :key="i" class="h-12 w-full" />
    </div>
    <div v-else class="space-y-3 p-4">
      <div
        v-for="member in membershipStore.items"
        :key="member.id"
        class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-default p-3"
      >
        <div>
          <p class="font-medium text-highlighted">{{ member.user_display || member.user }}</p>
          <p class="text-sm text-muted">{{ member.role_name || 'Role' }}</p>
        </div>
        <USelect
          :model-value="typeof member.role === 'number' ? member.role : (member.role as any)?.id"
          :items="roleItems"
          value-key="value"
          class="min-w-40"
          @update:model-value="(v: number) => changeRole(member.id, v)"
        />
      </div>
      <p v-if="!membershipStore.items.length" class="text-sm text-muted">No team members found.</p>
    </div>

    <UModal v-model:open="inviteOpen" title="Add team member">
      <template #body>
        <div class="space-y-4">
          <UFormField label="User ID">
            <UInput v-model="invite.user" type="number" class="w-full" />
          </UFormField>
          <UFormField label="Role">
            <USelect v-model="invite.role" :items="roleItems" value-key="value" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="outline" label="Cancel" @click="inviteOpen = false" />
          <UButton label="Add" :loading="membershipStore.mutating" @click="inviteMember" />
        </div>
      </template>
    </UModal>
  </UCard>
</template>
