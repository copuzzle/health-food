import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { DEFAULT_SYMPTOM_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { foodLogSchema } from "@/lib/validation";

export async function GET() {
  let user;
  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const logs = await prisma.foodLog.findMany({
    where: { userId: user.id },
    include: { symptoms: { orderBy: { occurredAt: "asc" } } },
    orderBy: { mealTime: "desc" },
    take: 60,
  });

  return NextResponse.json({ logs });
}

export async function POST(request: Request) {
  let user;
  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = foodLogSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid food log payload" }, { status: 400 });
  }

  const { symptoms, ...foodLog } = parsed.data;
  const symptomPreferences = await prisma.symptomPreference.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  });
  const allowedSymptoms = new Set(
    symptomPreferences.length > 0
      ? symptomPreferences.map((symptom) => symptom.name)
      : [...DEFAULT_SYMPTOM_TYPES],
  );

  if (symptoms.some((symptom) => !allowedSymptoms.has(symptom.symptomType))) {
    return NextResponse.json({ error: "Symptoms must match your profile settings" }, { status: 400 });
  }

  const log = await prisma.foodLog.create({
    data: {
      ...foodLog,
      userId: user.id,
      symptoms: {
        create: symptoms.map((symptom) => ({
          ...symptom,
          userId: user.id,
        })),
      },
    },
    include: { symptoms: true },
  });

  return NextResponse.json({ log }, { status: 201 });
}
