<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreatePlatformTenantPayload } from '~/types/api'
import * as z from 'zod'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ created: [] }>()

const store = usePlatformTenantsStore()
const toast = useToast()

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens'),
  is_active: z.boolean(),
  admin_email: z.string().trim().email('Valid email is required'),
  admin_first_name: z.string().optional(),
  admin_last_name: z.string().optional(),
  admin_password: z.string().optional(),
})

type FormSchema = z.output<typeof schema>

const state = reactive({
  name: '',
  slug: '',
  is_active: true,
  admin_email: '',
  admin_first_name: '',
  admin_last_name: '',
  admin_password: '',
})

const slugTouched = ref(false)

watch(
  () => state.name,
  (name) => {
    if (slugTouched.value) return
    state.slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },
)

const formError = ref('')

function resetForm() {
  state.name = ''
  state.slug = ''
  state.is_active = true
  state.admin_email = ''
  state.admin_first_name = ''
  state.admin_last_name = ''
  state.admin_password = ''
  slugTouched.value = false
  formError.value = ''
}

watch(open, (isOpen) => {
  if (!isOpen) resetForm()
})

function formatApiError(error: unknown): string {
  const data = (error as { data?: Record<string, unknown> })?.data
  if (!data || typeof data !== 'object') return 'Could not create tenant. Please try again.'

  const messages: string[] = []
  for (const [key, value] of Object.entries(data)) {
    if (key === 'admin_user' && value && typeof value === 'object' && !Array.isArray(value)) {
      for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
        const text = Array.isArray(nestedValue) ? nestedValue.join(' ') : String(nestedValue)
        messages.push(`Admin ${nestedKey}: ${text}`)
      }
      continue
    }
    const text = Array.isArray(value) ? value.join(' ') : String(value)
    messages.push(`${key}: ${text}`)
  }
  return messages.join(' ') || 'Could not create tenant. Please try again.'
}

async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  formError.value = ''

  const payload: CreatePlatformTenantPayload = {
    name: event.data.name,
    slug: event.data.slug,
    is_active: event.data.is_active,
    admin_user: {
      email: event.data.admin_email,
      first_name: event.data.admin_first_name || undefined,
      last_name: event.data.admin_last_name || undefined,
      password: event.data.admin_password || undefined,
    },
  }

  try {
    const tenant = await store.create(payload)
    const adminLabel = tenant.admin_user?.created
      ? `Admin account created for ${tenant.admin_user.email}.`
      : `Existing user ${tenant.admin_user?.email ?? event.data.admin_email} assigned as admin.`
    toast.add({
      title: 'Tenant provisioned',
      description: `${tenant.name} is ready. ${adminLabel}`,
      icon: 'i-lucide-building-2',
      color: 'success',
    })
    emit('created')
    open.value = false
  } catch (error) {
    formError.value = formatApiError(error)
  }
}
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Provision tenant"
    description="Create an organization and its first administrator in one step."
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        <div class="space-y-4">
          <p class="text-sm font-medium text-highlighted">Organization</p>

          <UFormField label="Name" name="name" required>
            <UInput v-model="state.name" placeholder="Acme Dental" class="w-full" />
          </UFormField>

          <UFormField label="Slug" name="slug" required hint="Used for workspace URLs">
            <UInput
              v-model="state.slug"
              placeholder="acme"
              class="w-full"
              @input="slugTouched = true"
            />
          </UFormField>

          <UFormField label="Status" name="is_active">
            <UCheckbox v-model="state.is_active" label="Active" />
          </UFormField>
        </div>

        <div class="space-y-4 border-t border-default pt-5">
          <p class="text-sm font-medium text-highlighted">Tenant administrator</p>
          <p class="text-sm text-muted">
            This user receives the tenant admin role with full workspace permissions.
          </p>

          <UFormField label="Email" name="admin_email" required>
            <UInput v-model="state.admin_email" type="email" placeholder="admin@clinic.io" class="w-full" />
          </UFormField>

          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField label="First name" name="admin_first_name">
              <UInput v-model="state.admin_first_name" class="w-full" />
            </UFormField>
            <UFormField label="Last name" name="admin_last_name">
              <UInput v-model="state.admin_last_name" class="w-full" />
            </UFormField>
          </div>

          <UFormField
            label="Password"
            name="admin_password"
            hint="Required only when creating a new user account"
          >
            <UInput
              v-model="state.admin_password"
              type="password"
              autocomplete="new-password"
              class="w-full"
            />
          </UFormField>
        </div>

        <div
          v-if="formError"
          class="flex items-start gap-2 rounded-lg border border-error/30 bg-error/5 p-3 text-sm text-error"
        >
          <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0" />
          <span>{{ formError }}</span>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <UButton color="neutral" variant="outline" label="Cancel" type="button" @click="open = false" />
          <UButton
            type="submit"
            label="Provision tenant"
            icon="i-lucide-building-2"
            :loading="store.creating"
          />
        </div>
      </UForm>
    </template>
  </USlideover>
</template>
