<script setup lang="ts">
defineProps<{
  invoices: Array<any>
}>()
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-semibold text-highlighted">Invoice terminal</h2>
    </template>

    <div class="space-y-3">
      <div
        v-for="invoice in invoices"
        :key="invoice.id"
        class="flex items-center justify-between rounded-lg border border-default p-3"
      >
        <div>
          <p class="font-medium text-highlighted">Invoice #{{ invoice.id }}</p>
          <p class="text-xs text-muted">Status: {{ invoice.status }}</p>
        </div>
        <UBadge color="primary" variant="subtle" :label="String(invoice.copay_amount)" />
      </div>
      <p v-if="!invoices.length" class="text-sm text-muted">No invoices available.</p>
    </div>
  </UCard>
</template>
