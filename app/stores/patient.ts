export const usePatientStore = defineStore('patient', () => {
  const { apiFetch } = useApi()
  const dashboard = ref<any>(null)
  const medicalProfile = ref<any>(null)
  const pending = ref(false)

  async function fetchDashboard() {
    pending.value = true
    try {
      dashboard.value = await apiFetch('patient/dashboard')
    } finally {
      pending.value = false
    }
  }

  async function fetchMedicalProfile() {
    medicalProfile.value = await apiFetch('patient/medical-profile')
  }

  return { dashboard, medicalProfile, pending, fetchDashboard, fetchMedicalProfile }
})
