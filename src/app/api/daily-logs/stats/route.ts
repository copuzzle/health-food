import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { countSymptomsByType, groupSymptomsByDay } from "@/lib/stats";

export async function GET() {
  let user;
  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const logs = await prisma.dailyLog.findMany({
    where: { userId: user.id },
    include: { symptoms: true },
    orderBy: { date: "desc" },
    take: 60,
  });
  const symptoms = logs.flatMap((log) =>
    log.symptoms.map((symptom) => ({
      symptomType: symptom.symptomType,
      severity: symptom.severity,
      occurredAt: log.date,
    })),
  );

  return NextResponse.json({
    byDay: groupSymptomsByDay(symptoms),
    byType: countSymptomsByType(symptoms),
  });
}
