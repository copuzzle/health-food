import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { summarizeRestaurant } from "@/lib/ratings";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      ratings: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  return NextResponse.json({
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      city: restaurant.city,
      lat: restaurant.lat,
      lng: restaurant.lng,
      tags: restaurant.tags,
      createdAt: restaurant.createdAt,
      ...summarizeRestaurant(restaurant.ratings),
      ratings: restaurant.ratings.map((rating) => ({
        id: rating.id,
        fodmapScore: rating.fodmapScore,
        symptomSafetyScore: rating.symptomSafetyScore,
        comment: rating.comment,
        createdAt: rating.createdAt,
        userName: rating.user.name ?? rating.user.email.split("@")[0],
      })),
    },
  });
}
