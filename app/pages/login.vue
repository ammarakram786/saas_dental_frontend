<script setup lang="ts">
import type { FormSubmitEvent, FormError } from '@nuxt/ui'

definePageMeta({ layout: false })

const auth = useAuthStore()
const toast = useToast()
const router = useRouter()

const state = reactive({
  username: '',
  password: '',
  email: '',
})

const loading = ref(false)
const passkeyLoading = ref(false)
const magicLinkLoading = ref(false)
const showPassword = ref(false)

function validate(state: { username: string; password: string }): FormError[] {
  const errors: FormError[] = []
  if (!state.username) errors.push({ name: 'username', message: 'Email or username is required' })
  if (!state.password) errors.push({ name: 'password', message: 'Password is required' })
  return errors
}

async function onSubmit(_event: FormSubmitEvent<typeof state>) {
  loading.value = true
  try {
    await auth.login(state.username, state.password)
    toast.add({ title: 'Welcome back!', color: 'success', icon: 'i-lucide-check' })
    await router.push('/')
  } catch (error: any) {
    toast.add({
      title: 'Login failed',
      description: error?.data?.statusMessage || 'Invalid username or password.',
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  } finally {
    loading.value = false
  }
}

async function signInWithPasskey() {
  passkeyLoading.value = true
  try {
    const options: any = await auth.beginPasskey(state.username)
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: Uint8Array.from(atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
        allowCredentials: (options.allowCredentials ?? []).map((item: any) => ({
          ...item,
          id: Uint8Array.from(atob(String(item.id).replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
        })),
      },
    })

    const publicKeyCredential = credential as PublicKeyCredential
    await auth.finishPasskey(state.username, {
      id: publicKeyCredential.id,
      type: publicKeyCredential.type,
      rawId: publicKeyCredential.id,
    })
    toast.add({ title: 'Signed in with passkey', color: 'success', icon: 'i-lucide-fingerprint' })
    await router.push('/')
  } catch (error: any) {
    toast.add({
      title: 'Passkey sign-in failed',
      description: error?.data?.statusMessage || error?.message || 'Unable to complete passkey sign-in.',
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  } finally {
    passkeyLoading.value = false
  }
}

async function sendMagicLink() {
  magicLinkLoading.value = true
  try {
    await auth.requestMagicLink(state.email)
    toast.add({
      title: 'Magic link prepared',
      description: 'Check your inbox for the magic link.',
      color: 'primary',
      icon: 'i-lucide-mail',
    })
  } catch (error: any) {
    toast.add({
      title: 'Magic link failed',
      description: error?.data?.statusMessage || 'Unable to prepare magic link.',
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  } finally {
    magicLinkLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2">
    <!-- Brand / hero panel -->
    <div class="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-12 text-white">
      <div class="absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" />
      <div class="absolute -bottom-32 -left-16 size-96 rounded-full bg-white/10 blur-3xl" />

      <div class="relative flex items-center gap-3">
        <div class="flex size-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <UIcon name="i-lucide-stethoscope" class="size-6" />
        </div>
        <span class="text-xl font-semibold tracking-tight">MedSaaS</span>
      </div>

      <div class="relative space-y-6">
        <h1 class="text-4xl font-bold leading-tight">
          Care, coordinated.
        </h1>
        <p class="max-w-md text-lg text-white/80">
          The modern platform for managing clinics, patients, and teams — secure,
          fast, and built for healthcare.
        </p>
        <ul class="space-y-3 text-white/90">
          <li class="flex items-center gap-3">
            <UIcon name="i-lucide-shield-check" class="size-5" />
            <span>HIPAA-grade encryption at rest</span>
          </li>
          <li class="flex items-center gap-3">
            <UIcon name="i-lucide-building-2" class="size-5" />
            <span>Multi-clinic ready</span>
          </li>
          <li class="flex items-center gap-3">
            <UIcon name="i-lucide-zap" class="size-5" />
            <span>Lightning-fast workflows</span>
          </li>
        </ul>
      </div>

      <p class="relative text-sm text-white/60">
        &copy; {{ new Date().getFullYear() }} MedSaaS. All rights reserved.
      </p>
    </div>

    <!-- Form panel -->
    <div class="flex items-center justify-center p-6 sm:p-12 bg-default">
      <div class="w-full max-w-sm space-y-8">
        <div class="space-y-2">
          <div class="flex lg:hidden items-center gap-2 mb-6">
            <div class="flex size-9 items-center justify-center rounded-xl bg-primary text-inverted">
              <UIcon name="i-lucide-stethoscope" class="size-5" />
            </div>
            <span class="text-lg font-semibold">MedSaaS</span>
          </div>
          <h2 class="text-2xl font-bold text-highlighted">Sign in to your account</h2>
          <p class="text-muted">Enter your credentials to continue.</p>
        </div>

        <UForm :state="state" :validate="validate" class="space-y-5" @submit="onSubmit">
          <UFormField label="Email or username" name="username">
            <UInput
              v-model="state.username"
              placeholder="jane@clinic.com or jane.doe"
              icon="i-lucide-at-sign"
              size="lg"
              autocomplete="username"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-lucide-lock"
              size="lg"
              autocomplete="current-password"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
            label="Sign in"
            icon="i-lucide-log-in"
          />

          <UButton
            block
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-lucide-fingerprint"
            label="Use passkey"
            :loading="passkeyLoading"
            @click="signInWithPasskey"
          />
        </UForm>

        <USeparator label="Or use a magic link" />

        <div class="space-y-3">
          <UFormField label="Email" name="email">
            <UInput
              v-model="state.email"
              placeholder="jane@clinic.com"
              icon="i-lucide-mail"
              size="lg"
              class="w-full"
            />
          </UFormField>
          <UButton
            block
            size="lg"
            color="neutral"
            variant="soft"
            icon="i-lucide-send"
            label="Send magic link"
            :loading="magicLinkLoading"
            @click="sendMagicLink"
          />
        </div>

        <p class="text-center text-sm text-muted">
          Trouble signing in? Contact your administrator.
        </p>
      </div>
    </div>
  </div>
</template>
