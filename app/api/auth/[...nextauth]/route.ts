import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'UFC Login',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu.email@ufc.br" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        // Por enquanto, vamos usar uma autenticação simples para teste
        if (credentials?.email === "admin@ufc.br" && credentials?.password === "admin123") {
          return {
            id: "1",
            email: "admin@ufc.br",
            name: "Administrador",
            role: "ADMIN"
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }
