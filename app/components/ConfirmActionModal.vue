<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    confirmLabel?: string
    /** The exact string the user must type to enable confirmation. */
    confirmText: string
    loading?: boolean
  }>(),
  {
    title: 'Are you absolutely sure?',
    description: '',
    confirmLabel: 'Confirm Action',
    loading: false,
  },
)

const emit = defineEmits<{ confirm: [] }>()

const typed = ref('')
const matches = computed(() => typed.value.trim() === props.confirmText)

watch(open, (v) => {
  if (!v) typed.value = ''
})

function confirm() {
  if (matches.value) emit('confirm')
}
</script>

<template>
  <UModal v-model:open="open" :title="title" :description="description">
    <template #body>
      <div class="space-y-4">
        <div class="flex items-start gap-3 rounded-lg border border-error/30 bg-error/5 p-3">
          <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-5 shrink-0 text-error" />
          <p class="text-sm text-error">
            This action is permanent and cannot be undone.
          </p>
        </div>

        <div class="space-y-1.5">
          <p class="text-sm text-muted">
            Type <span class="font-semibold text-highlighted">{{ confirmText }}</span> to confirm.
          </p>
          <UInput
            v-model="typed"
            :placeholder="confirmText"
            autocomplete="off"
            class="w-full"
            @keydown.enter="confirm"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="outline" label="Cancel" @click="open = false" />
        <UButton
          color="error"
          :label="confirmLabel"
          icon="i-lucide-trash-2"
          :disabled="!matches"
          :loading="loading"
          @click="confirm"
        />
      </div>
    </template>
  </UModal>
</template>
