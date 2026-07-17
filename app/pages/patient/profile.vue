<script setup lang="ts">
definePageMeta({ layout: 'patient' })

const store = usePatientStore()
const toast = useToast()

await Promise.all([store.fetchMedicalProfile(), store.fetchUserProfile()])

const profile = reactive({
  primary_phone: store.userProfile?.primary_phone || '',
  blood_type: store.userProfile?.blood_type || 'UNK',
  cnic: store.userProfile?.cnic || '',
  allergies: store.userProfile?.allergies || '',
  systemic_conditions: store.userProfile?.systemic_conditions || '',
  active_medications: store.userProfile?.active_medications || '',
  global_health_notes: (store.medicalProfile as any)?.global_health_notes || '',
})

watch(
  () => store.userProfile,
  (p) => {
    if (!p) return
    profile.primary_phone = p.primary_phone || ''
    profile.blood_type = p.blood_type || 'UNK'
    profile.cnic = p.cnic || ''
    profile.allergies = p.allergies || ''
    profile.systemic_conditions = p.systemic_conditions || ''
    profile.active_medications = p.active_medications || ''
  },
)

async function save() {
  try {
    await Promise.all([
      store.updateUserProfile({
        primary_phone: profile.primary_phone,
        blood_type: profile.blood_type,
        cnic: profile.cnic,
        allergies: profile.allergies,
        systemic_conditions: profile.systemic_conditions,
        active_medications: profile.active_medications,
      }),
      store.updateMedicalProfile({
        global_health_notes: profile.global_health_notes,
      }),
    ])
    toast.add({ title: 'Profile saved', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Save failed', description: err?.data?.detail || err?.message, color: 'error' })
  }
}

const bloodItems = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNK'].map((v) => ({
  label: v,
  value: v,
}))
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-xl font-semibold text-highlighted">Medical profile</h1>
    </template>

    <div class="space-y-4">
      <UFormField label="Primary phone (SMS reminders)">
        <UInput v-model="profile.primary_phone" class="w-full" placeholder="+92..." />
      </UFormField>
      <UFormField label="CNIC">
        <UInput v-model="profile.cnic" class="w-full" />
      </UFormField>
      <UFormField label="Blood type">
        <USelect v-model="profile.blood_type" :items="bloodItems" value-key="value" class="w-full" />
      </UFormField>
      <UFormField label="Allergies">
        <UTextarea v-model="profile.allergies" class="w-full" />
      </UFormField>
      <UFormField label="Systemic conditions">
        <UTextarea v-model="profile.systemic_conditions" class="w-full" />
      </UFormField>
      <UFormField label="Active medications">
        <UTextarea v-model="profile.active_medications" class="w-full" />
      </UFormField>
      <UFormField label="Global health notes">
        <UTextarea v-model="profile.global_health_notes" class="w-full" />
      </UFormField>
      <div class="flex justify-end">
        <UButton label="Save profile" icon="i-lucide-save" :loading="store.mutating" @click="save" />
      </div>
    </div>
  </UCard>
</template>
