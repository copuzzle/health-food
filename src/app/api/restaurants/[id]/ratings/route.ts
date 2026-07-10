import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ratingSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  let user;
  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = ratingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid rating payload" }, { status: 400 });
  }

  try {
    const rating = await prisma.restaurantRating.create({
      data: {
        restaurantId: id,
        userId: user.id,
        ...parsed.data,
      },
    });

    return NextResponse.json({ rating }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "You already rated this restaurant" }, { status: 409 });
    }

    throw error;
  }
}
