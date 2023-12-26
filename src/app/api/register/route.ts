import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: any, res: any) {
  try {
    // read request body
    const { username, email, password } = await req.json();
    // return NextResponse.json(req.body, { status: 200 });
    console.log(req.body, username, email, password);
    // email lower
    // const email_lower = email.toLowerCase();
    //   check if email and password are provided
    if (!email || !password || !username) {
      return NextResponse.json({ error: "Enter all fields" }, { status: 400 });
    }

    // check if email already exists
    const user_exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user_exist) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: username,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
