// prisma
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

// route: GET /api/products
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);
    const prisma = new PrismaClient();
    const products = await prisma.product.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// route: POST /api/products
// protected route->user check
export async function POST(req: any, res: NextApiResponse) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);
    // check if user is admin
    // TODO : check interface of session
    if (!session?.user || session?.user?.role !== "ADMIN") {
      console.log("Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      console.log("Authorized");
      const prisma = new PrismaClient();
      let data = await req.json();
      console.log("hello", data);
      console.log("data", data);
      data = { ...data, userId: session?.user?.id };
      console.log(data);
      const product = await prisma.product.create({
        data,
      });
      return NextResponse.json(product, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
