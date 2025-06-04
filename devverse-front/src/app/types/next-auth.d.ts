/* eslint-disable @typescript-eslint/no-explicit-any */

import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username?: string
      githubId?: string
      githubProfile?: string
    } & DefaultSession['user']

    // Auth tokens
    accessToken?: string
    backendToken?: string

    // Data user from the backend
    backendUser?: {
      id: string
      email: string
      username: string
      name: string
      githubId: string
      profileImageUrl: string
      bio?: string
      location?: string
      githubProfile: string
      emailVerified: boolean
      createdAt: string
      updatedAt: string
    }
  }

  interface User extends DefaultUser {
    username?: string
    accessToken?: string
    githubId?: string
    githubProfile?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string
    username?: string
    accessToken?: string
    githubId?: string
    githubProfile?: string
    backendToken?: string
    backendUser?: any // Back data
  }
}