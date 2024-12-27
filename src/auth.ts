process.env.AUTH_URL = `https://${process.env.NEXT_PUBLIC_DOMAIN}`

import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Resend({
    apiKey: process.env.RESEND_API_KEY,
    from: `noreply@${process.env.NEXT_PUBLIC_DOMAIN}`,
  })],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  }
})