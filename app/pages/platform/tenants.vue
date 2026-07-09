<script setup lang="ts">
definePageMeta({ layout: 'platform' })
useHead({ title: 'Tenants · MedSaaS' })

const { hasModule } = usePlatformUser()
const allowed = computed(() => hasModule('manage_tenants'))
const store = usePlatformTenantsStore()

const search = ref('')
const createOpen = ref(false)
await store.fetch()

watchDebounced(
  search,
  (value) => {
    store.fetch({ search: value || undefined })
  },
  { debounce: 300 },
)
</script>

<template>
  <div>
    <AccessRestricted v-if="!allowed" module="Tenant Management" />

    <div v-else>
      <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-highlighted">Tenant management</h1>
          <p class="mt-1 text-sm text-muted">Provision and operate customer organizations.</p>
        </div>
        <div class="flex items-center gap-2">
          <UBadge color="primary" variant="subtle" :label="`${store.count} tenants`" />
          <UButton label="Provision tenant" icon="i-lucide-plus" @click="createOpen = true" />
        </div>
      </div>

      <UCard>
        <ListToolbar v-model:search="search" search-placeholder="Filter tenants..." />

        <div v-if="store.pending" class="space-y-3 p-4">
          <USkeleton v-for="i in 5" :key="i" class="h-12 w-full" />
        </div>
        <div v-else class="divide-y divide-default">
          <div
            v-for="tenant in store.items"
            :key="tenant.id"
            class="flex items-center justify-between gap-4 p-4"
          >
            <div>
              <p class="font-medium text-highlighted">{{ tenant.name }}</p>
              <p class="text-sm text-muted">{{ tenant.slug }}.dentaldoodle.pk</p>
            </div>
            <UBadge
              :color="tenant.is_active ? 'success' : 'error'"
              variant="subtle"
              :label="tenant.is_active ? 'Active' : 'Inactive'"
            />
          </div>
          <p v-if="!store.items.length" class="p-4 text-sm text-muted">No tenants match your search.</p>
        </div>
      </UCard>

      <TenantCreateSlideover v-model:open="createOpen" @created="store.fetch({ search: search || undefined })" />
    </div>
  </div>
</template>
