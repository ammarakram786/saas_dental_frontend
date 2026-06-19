<script setup lang="ts">
import { mockMembers, type MockMember, type TenantRole } from '~/utils/mock'

definePageMeta({ layout: 'platform' })
useHead({ title: 'Team & Workspaces · MedSaaS' })

const { current } = useWorkspace()
const toast = useToast()

const { data, pending } = useMockQuery(() => [...mockMembers], { delay: 800 })
const members = ref<MockMember[]>([...mockMembers])
watch(data, (d) => {
  if (d) members.value = d
})

function onRoleChange(member: MockMember, role: TenantRole) {
  const m = members.value.find((x) => x.id === member.id)
  if (m) m.role = role
  toast.add({
    title: 'Role updated',
    description: `${member.name} is now ${role}.`,
    icon: 'i-lucide-user-cog',
    color: 'primary',
  })
}

const view = ref('members')
const viewItems = [
  { label: 'Members', icon: 'i-lucide-users', value: 'members' },
  { label: 'Create project', icon: 'i-lucide-plus', value: 'create' },
]
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">Team &amp; workspaces</h1>
        <p class="mt-1 text-sm text-muted">
          Managing <span class="font-medium text-highlighted">{{ current.name }}</span>.
        </p>
      </div>
      <UTabs v-model="view" :items="viewItems" :content="false" variant="pill" size="sm" />
    </div>

    <div v-if="view === 'members'">
      <TeamSeatMatrix :members="members" :loading="pending" @role-change="onRoleChange" />
    </div>

    <div v-else class="max-w-2xl">
      <OnboardingWizard />
    </div>
  </div>
</template>
