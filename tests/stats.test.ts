import { describe, expect, it } from "vitest";
import { countSymptomsByType, groupSymptomsByDay } from "@/lib/stats";

describe("symptom stats", () => {
  const symptoms = [
    { symptomType: "腹泻", severity: 4, occurredAt: "2026-07-10T01:00:00.000Z" },
    { symptomType: "腹泻", severity: 2, occurredAt: "2026-07-10T08:00:00.000Z" },
    { symptomType: "胀气", severity: 5, occurredAt: "2026-07-11T08:00:00.000Z" },
  ];

  it("groups symptoms by UTC day", () => {
    expect(groupSymptomsByDay(symptoms)).toEqual({
      "2026-07-10": { count: 2, totalSeverity: 6, avgSeverity: 3 },
      "2026-07-11": { count: 1, totalSeverity: 5, avgSeverity: 5 },
    });
  });

  it("counts symptoms by type with max severity", () => {
    expect(countSymptomsByType(symptoms)).toEqual({
      "腹泻": { count: 2, maxSeverity: 4 },
      "胀气": { count: 1, maxSeverity: 5 },
    });
  });
});
