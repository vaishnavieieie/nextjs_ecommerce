// prisma
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// route: Put /api/products/[pid]
// protected route->user check
export async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  context: { params: { pid: string } },
) {
  try {
    const prisma = new PrismaClient();
    var data = req.body;

    const product = await prisma.product.update({
      where: {
        id: context.params.pid,
      },
      data,
    });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
