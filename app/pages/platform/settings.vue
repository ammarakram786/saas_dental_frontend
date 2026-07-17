<script setup lang="ts">
definePageMeta({ layout: 'platform' })
useHead({ title: 'Settings · MedSaaS' })

const { user, displayName } = usePlatformUser()
const toast = useToast()
const billingStore = usePlatformBillingStore()

type Section = 'general' | 'security' | 'billing'
const active = ref<Section>('general')

const sections: { id: Section; label: string; icon: string; description: string }[] = [
  { id: 'general', label: 'General', icon: 'i-lucide-settings-2', description: 'Profile basics' },
  { id: 'security', label: 'Security', icon: 'i-lucide-shield', description: 'Authentication' },
  { id: 'billing', label: 'Billing overview', icon: 'i-lucide-receipt', description: 'Cross-tenant invoices' },
]

const profile = reactive({
  name: displayName.value,
  email: user.value?.email ?? '',
  notifications: true,
})

function saveProfile() {
  toast.add({
    title: 'Profile preferences saved locally',
    description: 'Account profile updates via API are not yet available.',
    icon: 'i-lucide-check',
    color: 'success',
  })
}

await billingStore.fetch({ ordering: '-created_at', page_size: 20 })

const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
const currency = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' })

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  paid: 'success',
  issued: 'warning',
  draft: 'neutral',
  void: 'error',
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-highlighted">Settings</h1>
      <p class="mt-1 text-sm text-muted">Manage your account and review platform billing.</p>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <nav class="md:col-span-1">
        <ul class="space-y-1">
          <li v-for="s in sections" :key="s.id">
            <button
              type="button"
              class="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
              :class="active === s.id ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-elevated/60'"
              @click="active = s.id"
            >
              <UIcon :name="s.icon" class="mt-0.5 size-5 shrink-0" />
              <span class="min-w-0">
                <span class="block text-sm font-medium" :class="active === s.id ? 'text-primary' : 'text-highlighted'">
                  {{ s.label }}
                </span>
                <span class="block text-xs text-dimmed">{{ s.description }}</span>
              </span>
            </button>
          </li>
        </ul>
      </nav>

      <div class="md:col-span-2">
        <UCard v-if="active === 'general'">
          <template #header>
            <h2 class="font-semibold text-highlighted">General</h2>
          </template>
          <div class="space-y-5">
            <UFormField label="Display name" name="name">
              <UInput v-model="profile.name" class="w-full" />
            </UFormField>
            <UFormField label="Email address" name="email">
              <UInput v-model="profile.email" type="email" class="w-full" />
            </UFormField>
            <div class="flex items-center justify-between rounded-lg border border-default p-3">
              <div>
                <p class="text-sm font-medium text-highlighted">Email notifications</p>
                <p class="text-xs text-muted">Receive operational alerts and digests.</p>
              </div>
              <USwitch v-model="profile.notifications" />
            </div>
          </div>
          <template #footer>
            <div class="flex justify-end">
              <UButton label="Save changes" icon="i-lucide-save" @click="saveProfile" />
            </div>
          </template>
        </UCard>

        <UCard v-else-if="active === 'security'">
          <template #header>
            <h2 class="font-semibold text-highlighted">Security</h2>
          </template>
          <div class="space-y-4">
            <div class="flex items-center justify-between rounded-lg border border-default p-3">
              <div>
                <p class="text-sm font-medium text-highlighted">Passkeys</p>
                <p class="text-xs text-muted">Register and use WebAuthn credentials from the login page.</p>
              </div>
              <UButton color="neutral" variant="outline" label="Open login" to="/login" />
            </div>
          </div>
        </UCard>

        <UCard v-else>
          <template #header>
            <h2 class="font-semibold text-highlighted">Cross-tenant invoices</h2>
          </template>
          <div v-if="billingStore.pending" class="space-y-3">
            <USkeleton v-for="i in 4" :key="i" class="h-10 w-full" />
          </div>
          <ul v-else class="divide-y divide-default">
            <li
              v-for="entry in billingStore.items"
              :key="entry.id"
              class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-highlighted">Invoice #{{ entry.id }}</p>
                <p class="truncate text-xs text-muted">
                  {{ entry.tenant_name || `Tenant ${entry.tenant}` }} · Patient {{ entry.patient }}
                  <span v-if="entry.created_at"> · {{ dateFmt.format(new Date(entry.created_at)) }}</span>
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-3">
                <span class="text-sm font-medium text-highlighted">
                  {{ currency.format(Number(entry.copay_amount || 0)) }}
                </span>
                <UBadge
                  :color="statusColor[entry.status] || 'neutral'"
                  variant="subtle"
                  class="capitalize"
                  :label="entry.status"
                />
              </div>
            </li>
            <li v-if="!billingStore.items.length" class="py-4 text-sm text-muted">No invoices yet.</li>
          </ul>
        </UCard>
      </div>
    </div>
  </div>
</template>
