// take the request and return the user object if authenticated

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import authOptions from "../api/auth/[...nextauth]/options";

export async function getAuthUser(req: any, res: any) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    // check if user exists in database
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return null;
    } else {
      return session;
    }
  }
}
