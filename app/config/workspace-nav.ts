export function workspaceNavLinks(slug: string) {
  return [
    { label: 'Overview', icon: 'i-lucide-layout-dashboard', to: `/workspace/${slug}` },
    { label: 'Patients', icon: 'i-lucide-user-round', to: `/workspace/${slug}/patients` },
    { label: 'Team', icon: 'i-lucide-users', to: `/workspace/${slug}/team` },
    { label: 'Schedule', icon: 'i-lucide-calendar', to: `/workspace/${slug}/schedule` },
    { label: 'Billing', icon: 'i-lucide-receipt', to: `/workspace/${slug}/billing/invoices` },
    { label: 'Insurance', icon: 'i-lucide-shield', to: `/workspace/${slug}/billing/insurance-panels` },
    { label: 'Settings', icon: 'i-lucide-settings', to: `/workspace/${slug}/settings` },
  ]
}
