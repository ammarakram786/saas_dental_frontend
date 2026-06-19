<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import {
  mockTenants,
  TENANT_STATUS_META,
  type MockTenant,
} from '~/utils/mock'

definePageMeta({ layout: 'platform' })
useHead({ title: 'Tenants · MedSaaS' })

const { hasModule } = usePlatformUser()
const allowed = computed(() => hasModule('manage_tenants'))

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const { data, pending } = useMockQuery(() => [...mockTenants], { delay: 800 })
const rows = ref<MockTenant[]>([...mockTenants])
watch(data, (d) => {
  if (d) rows.value = d
})

const globalFilter = ref('')

const editing = ref<MockTenant | null>(null)
const slideoverOpen = ref(false)

function openEdit(tenant: MockTenant) {
  editing.value = tenant
  slideoverOpen.value = true
}

function onSaved(updated: MockTenant) {
  const idx = rows.value.findIndex((t) => t.id === updated.id)
  if (idx !== -1) rows.value[idx] = updated
}

const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const columns: TableColumn<MockTenant>[] = [
  {
    accessorKey: 'name',
    header: 'Tenant Name',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-3' }, [
        h(
          'span',
          { class: 'flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-semibold' },
          row.original.name.slice(0, 2).toUpperCase(),
        ),
        h('span', { class: 'font-medium text-highlighted' }, row.original.name),
      ]),
  },
  {
    accessorKey: 'subdomain',
    header: 'Subdomain',
    cell: ({ row }) =>
      h('span', { class: 'text-muted' }, `${row.original.subdomain}.medsaas.io`),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const meta = TENANT_STATUS_META[row.original.status]
      return h(UBadge, { color: meta.color, variant: 'subtle', label: meta.label })
    },
  },
  {
    accessorKey: 'tier',
    header: 'Plan',
    cell: ({ row }) => h('span', { class: 'capitalize text-muted' }, row.original.tier),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
    cell: ({ row }) =>
      h('span', { class: 'text-muted' }, dateFmt.format(new Date(row.original.createdAt))),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) =>
      h('div', { class: 'text-right' }, [
        h(UButton, {
          icon: 'i-lucide-pencil',
          color: 'neutral',
          variant: 'ghost',
          size: 'sm',
          'aria-label': 'Edit tenant',
          onClick: () => openEdit(row.original),
        }),
      ]),
  },
]
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
        <UButton icon="i-lucide-plus" label="New tenant" />
      </div>

      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <div class="flex items-center gap-3 border-b border-default p-4">
          <UInput
            v-model="globalFilter"
            icon="i-lucide-search"
            placeholder="Filter tenants..."
            class="max-w-sm flex-1"
          />
          <span class="ms-auto text-sm text-muted">{{ rows.length }} organizations</span>
        </div>

        <UTable
          v-model:global-filter="globalFilter"
          :data="rows"
          :columns="columns"
          :loading="pending"
          class="w-full"
        />
      </UCard>
    </div>

    <TenantEditSlideover v-model:open="slideoverOpen" :tenant="editing" @save="onSaved" />
  </div>
</template>
