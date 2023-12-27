// prisma
import { getAuthUser } from "@/app/lib/authUser";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
let prisma: any;

// route: GET /api/products/[pid]
export async function GET(
  req: NextRequest,
  { params }: { params: { pid: string } },
  res: NextResponse,
) {
  try {
    prisma = new PrismaClient();
    const item = await prisma.product.findUnique({
      where: {
        id: String(params.pid),
      },
    });
    if (!item) {
      return NextResponse.json({ error: "Product Not Found" }, { status: 404 });
    } else {
      return NextResponse.json(item, { status: 200 });
    }
  } catch (error: any) {
    console.log(error);
    // check if error is P2023 i.e. 'Malformed ObjectID: provided hex string representation must be exactly 12 bytes, instead got __'
    if (error.code === "P2023") {
      return NextResponse.json({ error: "Product Not Found" }, { status: 404 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

// route: Put /api/products/[pid]
// protected route->user check
export async function PUT(
  req: NextRequest,
  { params }: { params: { pid: string } },
  res: NextResponse,
) {
  try {
    const session = await getAuthUser(req, null);
    console.log(session?.user);
    if (!session?.user || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      console.log("User exists");
      // get data
      prisma = new PrismaClient();
      const item = await prisma.product.findUnique({
        where: {
          id: String(params.pid),
        },
      });
      console.log(item);
      if (!item) {
        return NextResponse.json(
          { error: "Product Not Found" },
          { status: 404 },
        );
      } else {
        console.log("Item exists");
        const data = await req.json();
        // update item
        const updatedItem = await prisma.product.update({
          where: {
            id: params.pid,
          },
          data,
        });
        return NextResponse.json(
          { message: "Product Updated", data: updatedItem },
          { status: 200 },
        );
      }
    }
  } catch (error: any) {
    console.log(error);
    // check if error is P2023 i.e. 'Malformed ObjectID: provided hex string representation must be exactly 12 bytes, instead got __'
    if (error.code === "P2023") {
      return NextResponse.json({ error: "Product Not Found" }, { status: 404 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

// route: DELETE /api/products/[pid]
// protected route->user check

export async function DELETE(
  req: NextRequest,
  { params }: { params: { pid: string } },
  res: NextResponse,
) {
  try {
    const session = await getAuthUser(req, null);
    if (!session?.user || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      prisma = new PrismaClient();
      const item = await prisma.product.findUnique({
        where: {
          id: String(params.pid),
        },
      });
      if (!item) {
        return NextResponse.json(
          { error: "Product Not Found" },
          { status: 404 },
        );
      } else {
        const deletedItem = await prisma.product.delete({
          where: {
            id: String(params.pid),
          },
        });
        return NextResponse.json(
          { message: "Product Deleted", data: deletedItem },
          { status: 200 },
        );
      }
    }
  } catch (error: any) {
    console.log(error);
    // check if error is P2023 i.e. 'Malformed ObjectID: provided hex string representation must be exactly 12 bytes, instead got __'
    if (error.code === "P2023") {
      return NextResponse.json({ error: "Product Not Found" }, { status: 404 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}
