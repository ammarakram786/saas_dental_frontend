<script setup lang="ts">
definePageMeta({ layout: 'workspace', middleware: ['tenant'] })

const billing = useBillingStore()
const { current } = useWorkspace()
const toast = useToast()
const createOpen = ref(false)

const form = reactive({
  insurer_name: '',
  panel_code: '',
  coverage_rules: '{\n  "coverage_percent": 80\n}',
})

await billing.fetchInsurancePanels(current.value?.id)

watch(() => current.value?.id, () => billing.fetchInsurancePanels(current.value?.id))

async function createPanel() {
  try {
    const coverage_rules = JSON.parse(form.coverage_rules)
    await billing.createPanel(current.value?.id, {
      insurer_name: form.insurer_name,
      panel_code: form.panel_code,
      coverage_rules,
    })
    toast.add({ title: 'Panel created', color: 'success' })
    createOpen.value = false
    form.insurer_name = ''
    form.panel_code = ''
  } catch (err: any) {
    toast.add({ title: 'Create failed', description: err?.message || err?.data?.detail, color: 'error' })
  }
}

async function removePanel(id: number) {
  try {
    await billing.deletePanel(current.value?.id, id)
    toast.add({ title: 'Panel removed', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Delete failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-highlighted">Insurance panels</h1>
        <p class="text-sm text-muted">Manage insurer panels and coverage rules for this clinic.</p>
      </div>
      <UButton label="Add panel" icon="i-lucide-plus" @click="createOpen = true" />
    </div>

    <UCard>
      <div v-if="billing.pending" class="space-y-3 p-4">
        <USkeleton v-for="i in 3" :key="i" class="h-12 w-full" />
      </div>
      <div v-else class="divide-y divide-default">
        <div
          v-for="panel in billing.panels"
          :key="panel.id"
          class="flex flex-wrap items-start justify-between gap-3 p-4"
        >
          <div>
            <p class="font-medium text-highlighted">{{ panel.insurer_name }}</p>
            <p class="text-sm text-muted">Code: {{ panel.panel_code }}</p>
            <pre class="mt-2 overflow-auto text-xs text-muted">{{ JSON.stringify(panel.coverage_rules, null, 2) }}</pre>
          </div>
          <UButton color="error" variant="soft" size="sm" label="Delete" @click="removePanel(panel.id)" />
        </div>
        <p v-if="!billing.panels.length" class="p-4 text-sm text-muted">No insurance panels yet.</p>
      </div>
    </UCard>

    <UModal v-model:open="createOpen" title="Add insurance panel">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Insurer name">
            <UInput v-model="form.insurer_name" class="w-full" />
          </UFormField>
          <UFormField label="Panel code">
            <UInput v-model="form.panel_code" class="w-full" />
          </UFormField>
          <UFormField label="Coverage rules (JSON)">
            <UTextarea v-model="form.coverage_rules" class="w-full font-mono text-xs" :rows="6" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="outline" label="Cancel" @click="createOpen = false" />
          <UButton label="Create" :loading="billing.mutating" @click="createPanel" />
        </div>
      </template>
    </UModal>
  </div>
</template>
