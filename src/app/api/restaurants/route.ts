import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { restaurantSchema } from "@/lib/validation";
import { summarizeRestaurant } from "@/lib/ratings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const tag = searchParams.get("tag")?.trim();

  const restaurants = await prisma.restaurant.findMany({
    where: {
      city: city || undefined,
      tags: tag ? { has: tag } : undefined,
    },
    include: {
      ratings: {
        select: { fodmapScore: true, symptomSafetyScore: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    restaurants: restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      city: restaurant.city,
      lat: restaurant.lat,
      lng: restaurant.lng,
      tags: restaurant.tags,
      ...summarizeRestaurant(restaurant.ratings),
    })),
  });
}

export async function POST(request: Request) {
  let user;
  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = restaurantSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid restaurant payload" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      ...parsed.data,
      createdBy: user.id,
    },
  });

  return NextResponse.json({ restaurant }, { status: 201 });
}
