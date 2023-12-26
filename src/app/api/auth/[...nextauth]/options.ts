import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          const user = await res.json();

          let userrole;
          if (user.email == "vvv@gmail.com") {
            userrole = "ADMIN";
          } else {
            userrole = "USER";
          }
          console.log("User", user, "/nCredentials: ", credentials);
          // check password
          if (res.ok && user) {
            var unhashed = await bcrypt.compare(
              credentials.password,
              user.password,
            );
            if (unhashed) {
              // delete password
              delete user.password;
              return { ...user, role: userrole };
            }
          }
          return { error: "Invalid credentials" };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async signIn(user: any) {
      if (user?.user?.error) {
        return false;
      }
      return true;
    },
    // async redirect({ url, baseUrl }: { url: any; baseUrl: any }) {
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },
  },
};
// export authoptions
export default authOptions;
