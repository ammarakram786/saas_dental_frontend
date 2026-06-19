<script setup lang="ts">
import { mockBillingHistory } from '~/utils/mock'

definePageMeta({ layout: 'platform' })
useHead({ title: 'Settings · MedSaaS' })

const { user, displayName } = usePlatformUser()
const { current } = useWorkspace()
const toast = useToast()

type Section = 'general' | 'security' | 'billing'
const active = ref<Section>('general')

const sections: { id: Section; label: string; icon: string; description: string }[] = [
  { id: 'general', label: 'General', icon: 'i-lucide-settings-2', description: 'Profile and workspace basics' },
  { id: 'security', label: 'Security', icon: 'i-lucide-shield', description: 'Authentication and danger zone' },
  { id: 'billing', label: 'Billing History', icon: 'i-lucide-receipt', description: 'Invoices and payments' },
]

const profile = reactive({
  name: displayName.value,
  email: user.value?.email ?? '',
  notifications: true,
})

function saveProfile() {
  toast.add({ title: 'Settings saved', icon: 'i-lucide-check', color: 'success' })
}

// Destructive: delete workspace with type-to-confirm.
const deleteOpen = ref(false)
const deleting = ref(false)
function confirmDelete() {
  deleting.value = true
  setTimeout(() => {
    deleting.value = false
    deleteOpen.value = false
    toast.add({
      title: 'Workspace deletion scheduled',
      description: `${current.value.name} will be removed in 30 days.`,
      icon: 'i-lucide-trash-2',
      color: 'error',
    })
  }, 800)
}

const statusColor = {
  paid: 'success',
  pending: 'warning',
  failed: 'error',
} as const

const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-highlighted">Settings</h1>
      <p class="mt-1 text-sm text-muted">Manage your account, security and billing.</p>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- Left nav -->
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

      <!-- Right panel -->
      <div class="md:col-span-2">
        <!-- General -->
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

        <!-- Security -->
        <div v-else-if="active === 'security'" class="space-y-6">
          <UCard>
            <template #header>
              <h2 class="font-semibold text-highlighted">Security</h2>
            </template>
            <div class="space-y-4">
              <div class="flex items-center justify-between rounded-lg border border-default p-3">
                <div>
                  <p class="text-sm font-medium text-highlighted">Two-factor authentication</p>
                  <p class="text-xs text-muted">Add an extra layer of protection.</p>
                </div>
                <UButton color="neutral" variant="outline" label="Enable" />
              </div>
              <div class="flex items-center justify-between rounded-lg border border-default p-3">
                <div>
                  <p class="text-sm font-medium text-highlighted">Active sessions</p>
                  <p class="text-xs text-muted">Sign out of all other devices.</p>
                </div>
                <UButton color="neutral" variant="outline" label="Revoke all" />
              </div>
            </div>
          </UCard>

          <UCard :ui="{ root: 'ring-error/30' }">
            <template #header>
              <h2 class="font-semibold text-error">Danger zone</h2>
            </template>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-highlighted">Delete workspace</p>
                <p class="text-xs text-muted">
                  Permanently remove <span class="font-medium">{{ current.name }}</span> and all of its data.
                </p>
              </div>
              <UButton color="error" variant="soft" icon="i-lucide-trash-2" label="Delete" @click="deleteOpen = true" />
            </div>
          </UCard>
        </div>

        <!-- Billing History -->
        <UCard v-else>
          <template #header>
            <h2 class="font-semibold text-highlighted">Billing history</h2>
          </template>
          <ul class="divide-y divide-default">
            <li
              v-for="entry in mockBillingHistory"
              :key="entry.id"
              class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-highlighted">{{ entry.description }}</p>
                <p class="truncate text-xs text-muted">
                  {{ entry.id }} · {{ entry.tenant }} · {{ dateFmt.format(new Date(entry.date)) }}
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-3">
                <span class="text-sm font-medium text-highlighted">{{ currency.format(entry.amount) }}</span>
                <UBadge :color="statusColor[entry.status]" variant="subtle" class="capitalize" :label="entry.status" />
              </div>
            </li>
          </ul>
        </UCard>
      </div>
    </div>

    <ConfirmActionModal
      v-model:open="deleteOpen"
      title="Delete workspace"
      :description="`This will permanently delete ${current.name}.`"
      :confirm-text="current.name"
      confirm-label="Delete workspace"
      :loading="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>
