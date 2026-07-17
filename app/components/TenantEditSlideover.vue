<script setup lang="ts">
import type { PlatformTenant, UpdatePlatformTenantPayload } from '~/types/api'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ tenant: PlatformTenant | null }>()
const emit = defineEmits<{ saved: [tenant: PlatformTenant] }>()

const store = usePlatformTenantsStore()
const toast = useToast()

const form = reactive({
  name: '',
  slug: '',
  is_active: true,
})

watch(
  () => props.tenant,
  (t) => {
    if (t) {
      form.name = t.name
      form.slug = t.slug
      form.is_active = t.is_active
    }
  },
  { immediate: true },
)

async function save() {
  if (!props.tenant) return
  const payload: UpdatePlatformTenantPayload = {
    name: form.name.trim(),
    slug: form.slug.trim(),
    is_active: form.is_active,
  }
  try {
    const tenant = await store.update(props.tenant.id, payload)
    emit('saved', tenant)
    toast.add({
      title: 'Tenant updated',
      description: `${tenant.name} saved successfully.`,
      icon: 'i-lucide-check',
      color: 'success',
    })
    open.value = false
  } catch (err: any) {
    toast.add({
      title: 'Update failed',
      description: err?.data?.detail || err?.message || 'Could not update tenant.',
      color: 'error',
    })
  }
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="tenant?.name ?? 'Edit tenant'"
    description="Update clinic identity and activation status."
  >
    <template #body>
      <div v-if="tenant" class="space-y-6">
        <div class="flex items-center gap-3 rounded-lg bg-elevated/50 p-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon name="i-lucide-building-2" class="size-5" />
          </div>
          <div class="min-w-0">
            <p class="truncate font-medium text-highlighted">{{ tenant.name }}</p>
            <p class="truncate text-sm text-muted">{{ tenant.slug }}.dentaldoodle.pk</p>
          </div>
        </div>

        <UFormField label="Name" name="name">
          <UInput v-model="form.name" class="w-full" />
        </UFormField>

        <UFormField label="Slug" name="slug">
          <UInput v-model="form.slug" class="w-full" />
        </UFormField>

        <div class="flex items-center justify-between rounded-lg border border-default p-3">
          <div>
            <p class="text-sm font-medium text-highlighted">Active</p>
            <p class="text-xs text-muted">Inactive tenants cannot resolve workspace context.</p>
          </div>
          <USwitch v-model="form.is_active" />
        </div>

        <div
          v-if="!form.is_active"
          class="flex items-start gap-2 rounded-lg border border-error/30 bg-error/5 p-3 text-sm text-error"
        >
          <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0" />
          <span>Suspending blocks all member access for this organization.</span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="outline" label="Cancel" @click="open = false" />
        <UButton label="Save changes" icon="i-lucide-save" :loading="store.updating" @click="save" />
      </div>
    </template>
  </USlideover>
</template>
