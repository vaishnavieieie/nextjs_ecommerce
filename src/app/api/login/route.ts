import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: any, res: any) {
  try {
    // read request body
    const { email, password } = await req.json();
    // return NextResponse.json(req.body, { status: 200 });
    console.log(req.body, email, password);
    // email lower
    // const email_lower = email.toLowerCase();
    //   check if email and password are provided
    if (!email || !password) {
      return NextResponse.json({ error: "Enter all fields" }, { status: 400 });
    }

    // fetch user
    const user_exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user_exist) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 },
      );
    }

    return NextResponse.json(user_exist, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
