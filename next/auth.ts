import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Staff are the only people who log in — job applicants apply anonymously,
// with no account.
//
// Every session still carries an explicit `kind: "staff"` claim, and the
// middleware requires it before serving /admin. With one provider that check
// is trivially true today; it is kept because the alternative guard ("a token
// exists") silently becomes a privilege escalation the moment any second
// identity type is introduced. Asserting who the token belongs to costs one
// line and does not rot.

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Credentials({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          // Lazy imports to avoid build-time DB connection
          const { default: prisma } = await import("@/lib/prisma");
          const bcrypt = await import("bcryptjs");

          const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (!admin) return null;

          const passwordMatch = await bcrypt.compare(password, admin.password);
          if (!passwordMatch) return null;

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            kind: "staff" as const,
          };
        } catch (error) {
          console.error("[AUTH] admin authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.kind = user.kind ?? "staff";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.kind = token.kind;
      }
      return session;
    },
  },
});
