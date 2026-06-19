<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const { current } = useWorkspace()
const toast = useToast()

const steps: (TabsItem & { value: string; slot: string })[] = [
  { label: 'Details', icon: 'i-lucide-folder', value: 'details', slot: 'details' },
  { label: 'Team', icon: 'i-lucide-users', value: 'team', slot: 'team' },
  { label: 'Review', icon: 'i-lucide-check-check', value: 'review', slot: 'review' },
]

const step = ref('details')
const stepIndex = computed(() => steps.findIndex((s) => s.value === step.value))

const form = reactive({
  name: '',
  description: '',
  visibility: 'private' as 'private' | 'workspace',
  invites: '',
})

const visibilityItems = [
  { label: 'Private', value: 'private' },
  { label: 'Entire workspace', value: 'workspace' },
]

// Tenant tag is auto-appended and read-only — enforces tenant scoping.
const tenantTag = computed(() => `tenant:${current.value.subdomain}`)

const canNext = computed(() => {
  if (step.value === 'details') return form.name.trim().length > 1
  return true
})

function next() {
  if (stepIndex.value < steps.length - 1 && canNext.value) {
    step.value = steps[stepIndex.value + 1]!.value
  }
}
function back() {
  if (stepIndex.value > 0) step.value = steps[stepIndex.value - 1]!.value
}

const submitting = ref(false)
function submit() {
  submitting.value = true
  // Simulate POST /api/projects/ with tenant tag injected server-side.
  setTimeout(() => {
    submitting.value = false
    toast.add({
      title: 'Project created',
      description: `${form.name} provisioned under ${tenantTag.value}.`,
      icon: 'i-lucide-rocket',
      color: 'success',
    })
    form.name = ''
    form.description = ''
    form.invites = ''
    step.value = 'details'
  }, 900)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-highlighted">New project</h2>
        <UBadge color="neutral" variant="subtle" :label="`Step ${stepIndex + 1} of ${steps.length}`" />
      </div>
    </template>

    <UTabs v-model="step" :items="steps" :content="false" color="primary" class="mb-6" />

    <!-- Step content -->
    <div v-if="step === 'details'" class="space-y-5">
      <UFormField label="Project name" name="name" required>
        <UInput v-model="form.name" placeholder="e.g. Patient Onboarding" class="w-full" />
      </UFormField>
      <UFormField label="Description" name="description">
        <UTextarea v-model="form.description" :rows="3" placeholder="What is this project for?" class="w-full" />
      </UFormField>
      <UFormField label="Visibility" name="visibility">
        <USelect v-model="form.visibility" :items="visibilityItems" value-key="value" class="w-full" />
      </UFormField>
    </div>

    <div v-else-if="step === 'team'" class="space-y-5">
      <UFormField label="Invite members" name="invites" hint="Comma-separated emails">
        <UTextarea v-model="form.invites" :rows="3" placeholder="jane@clinic.io, john@clinic.io" class="w-full" />
      </UFormField>
      <div class="flex items-center gap-2 rounded-lg bg-elevated/50 p-3 text-sm text-muted">
        <UIcon name="i-lucide-shield-check" class="size-4 shrink-0 text-primary" />
        Members are scoped to <span class="font-medium text-highlighted">{{ current.name }}</span> only.
      </div>
    </div>

    <div v-else class="space-y-3">
      <dl class="divide-y divide-default text-sm">
        <div class="flex justify-between py-2">
          <dt class="text-muted">Name</dt>
          <dd class="font-medium text-highlighted">{{ form.name || '—' }}</dd>
        </div>
        <div class="flex justify-between py-2">
          <dt class="text-muted">Visibility</dt>
          <dd class="font-medium capitalize text-highlighted">{{ form.visibility }}</dd>
        </div>
        <div class="flex justify-between py-2">
          <dt class="text-muted">Invites</dt>
          <dd class="font-medium text-highlighted">
            {{ form.invites ? form.invites.split(',').filter(Boolean).length : 0 }} members
          </dd>
        </div>
        <div class="flex items-center justify-between py-2">
          <dt class="text-muted">Auto tag</dt>
          <dd><UBadge color="primary" variant="subtle" :label="tenantTag" /></dd>
        </div>
      </dl>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <UButton color="neutral" variant="ghost" label="Back" icon="i-lucide-arrow-left" :disabled="stepIndex === 0" @click="back" />
        <UButton
          v-if="step !== 'review'"
          label="Continue"
          trailing-icon="i-lucide-arrow-right"
          :disabled="!canNext"
          @click="next"
        />
        <UButton
          v-else
          label="Create project"
          icon="i-lucide-rocket"
          :loading="submitting"
          @click="submit"
        />
      </div>
    </template>
  </UCard>
</template>
