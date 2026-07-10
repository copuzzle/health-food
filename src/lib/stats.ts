export type SymptomForStats = {
  symptomType: string;
  severity: number;
  occurredAt: Date | string;
};

export function groupSymptomsByDay(symptoms: SymptomForStats[]) {
  return symptoms.reduce<Record<string, { count: number; avgSeverity: number; totalSeverity: number }>>(
    (acc, symptom) => {
      const day = new Date(symptom.occurredAt).toISOString().slice(0, 10);
      const current = acc[day] ?? { count: 0, avgSeverity: 0, totalSeverity: 0 };
      current.count += 1;
      current.totalSeverity += symptom.severity;
      current.avgSeverity = Math.round((current.totalSeverity / current.count) * 10) / 10;
      acc[day] = current;
      return acc;
    },
    {},
  );
}

export function countSymptomsByType(symptoms: SymptomForStats[]) {
  return symptoms.reduce<Record<string, { count: number; maxSeverity: number }>>((acc, symptom) => {
    const current = acc[symptom.symptomType] ?? { count: 0, maxSeverity: 0 };
    current.count += 1;
    current.maxSeverity = Math.max(current.maxSeverity, symptom.severity);
    acc[symptom.symptomType] = current;
    return acc;
  }, {});
}
