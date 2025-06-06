/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'

// Interface for a GitHub profile
interface GitHubProfile {
  login: string;
  html_url: string;
  [key: string]: any; // For oder fields don't use
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          const data = await res.json()

          if (res.ok && data.success) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name || data.user.username,
              image: data.user.profileImageUrl,
              username: data.user.username,
              accessToken: data.token,
              githubId: data.user.githubId,
              githubProfile: data.user.githubProfile
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    }),
    GitHub({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        console.log('🔥 JWT Callback triggered');
        console.log('🔥 Provider:', account.provider);

        if (account.provider === 'github') {
          console.log('🔥 GitHub authentication detected');
          console.log('🔥 User data:', user);
          console.log('🔥 Profile data:', profile);
          console.log('🔥 Account data:', account);

          // Use the GitHub ID as the unique identifier
          const githubId = (profile as any)?.id || account.providerAccountId;

          // Prepare data for the backend - the backend expects only code and state
          const backendPayload = {
            code: account.access_token, // NextAuth handle interchange code
            state: 'nextauth'
          };

          console.log('🔥 Payload to backend:', backendPayload);

          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/github/callback`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(backendPayload)
            });

            console.log('🔥 Backend response status:', res.status);

            if (res.ok) {
              const data = await res.json();
              console.log('✅ Backend response:', data);

              if (data.success) {
                // Save the token in the backend for a future request
                token.backendToken = data.token;
                token.backendUser = data.user;
                console.log('✅ User saved to database successfully!');
              } else {
                console.error('❌ Backend returned success: false -', data.message);
              }
            } else {
              const errorText = await res.text();
              console.error('❌ Backend request failed:', res.status, errorText);
            }
          } catch (error) {
            console.error('❌ Network error calling backend:', error);
          }

          // Save the basic data in the token
          token.accessToken = account.access_token;
          token.id = githubId;
          token.username = (profile as GitHubProfile)?.login;
          token.githubId = user.id;
          token.githubProfile = (profile as GitHubProfile)?.html_url;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        // NextAuth/GitHub data
        session.user.id = token.id as string;
        session.user.username = token.username;
        session.user.githubId = token.githubId;
        session.user.githubProfile = token.githubProfile;
        session.accessToken = token.accessToken;

        // Backend data if available
        if (token.backendToken) {
          session.backendToken = token.backendToken;
        }
        if (token.backendUser) {
          session.backendUser = token.backendUser;
        }
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  debug: true,
})