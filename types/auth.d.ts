declare module '#auth-utils' {
  interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    is_super_admin: boolean
    platform_role: number | null
    is_staff: boolean
    is_active: boolean
  }

  interface UserSession {
    loggedInAt?: string
  }

  interface SecureSessionData {
    accessToken: string
    refreshToken: string
  }
}

export {}
