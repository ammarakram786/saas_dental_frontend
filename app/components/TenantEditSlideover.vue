<script setup lang="ts">
import {
  SUBSCRIPTION_TIERS,
  TENANT_STATUS_META,
  type MockTenant,
  type TenantStatus,
  type SubscriptionTier,
} from '~/utils/mock'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ tenant: MockTenant | null }>()
const emit = defineEmits<{ save: [tenant: MockTenant] }>()

const toast = useToast()
const saving = ref(false)

const form = reactive({
  status: 'active' as TenantStatus,
  tier: 'starter' as SubscriptionTier,
  seats: 0,
})

watch(
  () => props.tenant,
  (t) => {
    if (t) {
      form.status = t.status
      form.tier = t.tier
      form.seats = t.seats
    }
  },
  { immediate: true },
)

const statusItems = (Object.keys(TENANT_STATUS_META) as TenantStatus[]).map((value) => ({
  label: TENANT_STATUS_META[value].label,
  value,
}))

async function save() {
  if (!props.tenant) return
  saving.value = true
  // Simulate a DRF PATCH against the tenant resource.
  await new Promise((r) => setTimeout(r, 700))
  saving.value = false
  emit('save', { ...props.tenant, status: form.status, tier: form.tier, seats: form.seats })
  toast.add({
    title: 'Tenant updated',
    description: `${props.tenant.name} subscription saved.`,
    icon: 'i-lucide-check',
    color: 'success',
  })
  open.value = false
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="tenant?.name ?? 'Edit tenant'"
    description="Manage subscription state and seat allocation."
  >
    <template #body>
      <div v-if="tenant" class="space-y-6">
        <div class="flex items-center gap-3 rounded-lg bg-elevated/50 p-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon name="i-lucide-building-2" class="size-5" />
          </div>
          <div class="min-w-0">
            <p class="truncate font-medium text-highlighted">{{ tenant.name }}</p>
            <p class="truncate text-sm text-muted">{{ tenant.subdomain }}.medsaas.io</p>
          </div>
        </div>

        <UFormField label="Subscription status" name="status">
          <USelect v-model="form.status" :items="statusItems" value-key="value" class="w-full" />
        </UFormField>

        <UFormField label="Plan tier" name="tier">
          <USelect v-model="form.tier" :items="SUBSCRIPTION_TIERS" value-key="value" class="w-full" />
        </UFormField>

        <UFormField label="Seats" name="seats">
          <UInput v-model.number="form.seats" type="number" min="0" class="w-full" />
        </UFormField>

        <div
          v-if="form.status === 'suspended'"
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
        <UButton label="Save changes" icon="i-lucide-save" :loading="saving" @click="save" />
      </div>
    </template>
  </USlideover>
</template>
