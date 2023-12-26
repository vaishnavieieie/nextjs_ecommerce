import NextAuth, { DefaultSession } from "next-auth";

// To add custom fields in interface Session.user
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }
}
