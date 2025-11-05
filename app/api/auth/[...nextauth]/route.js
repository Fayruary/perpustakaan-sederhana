import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Contoh login sederhana dengan username/password
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // cek login dari DB atau data dummy
        const user = {
          id: 1,
          name: "Admin",
          email: "admin@example.com",
          role: "admin",
        };

        if (
          credentials.email === user.email &&
          credentials.password === "123456"
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" }, // redirect ke login jika belum login
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
