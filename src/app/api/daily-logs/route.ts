import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { DEFAULT_SYMPTOM_TYPES } from "@/lib/constants";
import { toDateOnlyUtc } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { dailyLogSchema } from "@/lib/validation";

export async function GET() {
  let user;
  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const logs = await prisma.dailyLog.findMany({
    where: { userId: user.id },
    include: { symptoms: { orderBy: { symptomType: "asc" } } },
    orderBy: { date: "desc" },
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
  const parsed = dailyLogSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid daily log payload" }, { status: 400 });
  }

  const symptomPreferences = await prisma.symptomPreference.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  });
  const allowedSymptoms = new Set(
    symptomPreferences.length > 0
      ? symptomPreferences.map((symptom) => symptom.name)
      : [...DEFAULT_SYMPTOM_TYPES],
  );

  if (parsed.data.symptoms.some((symptom) => !allowedSymptoms.has(symptom.symptomType))) {
    return NextResponse.json({ error: "Symptoms must match your profile settings" }, { status: 400 });
  }

  const { symptoms, date, ...dailyLog } = parsed.data;
  const dateOnly = toDateOnlyUtc(date);
  const log = await prisma.$transaction(async (tx) => {
    const savedLog = await tx.dailyLog.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: dateOnly,
        },
      },
      create: {
        ...dailyLog,
        date: dateOnly,
        userId: user.id,
      },
      update: dailyLog,
    });

    await tx.dailySymptomRating.deleteMany({ where: { dailyLogId: savedLog.id } });
    await tx.dailySymptomRating.createMany({
      data: symptoms.map((symptom) => ({
        dailyLogId: savedLog.id,
        userId: user.id,
        symptomType: symptom.symptomType,
        severity: symptom.severity,
      })),
    });

    return tx.dailyLog.findUnique({
      where: { id: savedLog.id },
      include: { symptoms: true },
    });
  });

  return NextResponse.json({ log }, { status: 201 });
}
