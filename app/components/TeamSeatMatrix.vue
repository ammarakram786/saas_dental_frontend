<script setup lang="ts">
import { TENANT_ROLES, type MockMember, type TenantRole } from '~/utils/mock'

const props = defineProps<{
  members: MockMember[]
  loading?: boolean
}>()

const emit = defineEmits<{ 'role-change': [member: MockMember, role: TenantRole] }>()

const roleColor: Record<TenantRole, 'primary' | 'info' | 'neutral'> = {
  admin: 'primary',
  manager: 'info',
  member: 'neutral',
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function onRole(member: MockMember, role: TenantRole) {
  emit('role-change', member, role)
}

const skeletons = computed(() => (props.loading ? 6 : 0))
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <template v-if="loading">
      <UCard v-for="i in skeletons" :key="`s-${i}`">
        <div class="flex items-center gap-3">
          <USkeleton class="size-11 rounded-full" />
          <div class="flex-1 space-y-2">
            <USkeleton class="h-4 w-2/3" />
            <USkeleton class="h-3 w-3/4" />
          </div>
        </div>
        <USkeleton class="mt-4 h-9 w-full" />
      </UCard>
    </template>

    <template v-else>
      <UCard v-for="member in members" :key="member.id" :ui="{ body: 'space-y-4' }">
        <div class="flex items-center gap-3">
          <UAvatar :text="initials(member.name)" :alt="member.name" size="lg" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="truncate font-medium text-highlighted">{{ member.name }}</p>
              <UBadge :color="roleColor[member.role]" variant="subtle" size="sm" class="capitalize" :label="member.role" />
            </div>
            <p class="truncate text-sm text-muted">{{ member.email }}</p>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-muted">Role scope</label>
          <USelect
            :model-value="member.role"
            :items="TENANT_ROLES"
            value-key="value"
            class="w-full"
            @update:model-value="(v) => onRole(member, v as TenantRole)"
          />
        </div>
      </UCard>
    </template>
  </div>
</template>
