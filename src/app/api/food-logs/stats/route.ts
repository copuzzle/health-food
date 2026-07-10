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

  const symptoms = await prisma.symptomLog.findMany({
    where: { userId: user.id },
    orderBy: { occurredAt: "desc" },
    take: 120,
  });

  return NextResponse.json({
    byDay: groupSymptomsByDay(symptoms),
    byType: countSymptomsByType(symptoms),
  });
}
