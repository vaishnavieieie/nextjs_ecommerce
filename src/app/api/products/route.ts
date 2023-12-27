// prisma
import { getAuthUser } from "@/app/lib/authUser";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// route: GET /api/products
export async function GET(req: NextRequest, res: NextResponse) {
  try {
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
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await getAuthUser(req, res);
    // check if user is admin
    if (!session?.user || session?.user?.role !== "ADMIN") {
      console.log("Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
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
