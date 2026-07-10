import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { symptomPreferencesSchema } from "@/lib/validation";

export async function GET() {
  let user;
  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const symptoms = await prisma.symptomPreference.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ symptoms });
}

export async function PUT(request: Request) {
  let user;
  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = symptomPreferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid symptom preferences" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.symptomPreference.deleteMany({ where: { userId: user.id } }),
    ...parsed.data.symptoms.map((name, index) =>
      prisma.symptomPreference.create({
        data: {
          userId: user.id,
          name,
          sortOrder: index,
        },
      }),
    ),
  ]);

  const symptoms = await prisma.symptomPreference.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ symptoms });
}
