type TrendLog = {
  date: Date;
  symptoms: Array<{
    symptomType: string;
    severity: number;
  }>;
};

const COLORS = ["#c96f4a", "#4d7c69", "#d1a54a"];
const WIDTH = 640;
const HEIGHT = 260;
const PADDING = { top: 18, right: 18, bottom: 42, left: 34 };

export async function SymptomTrendChart({
  logs,
  symptomTypes,
}: {
  logs: TrendLog[];
  symptomTypes: string[];
}) {
  const { locale, dictionary } = await getI18n();
  const valuesByDay = new Map(
    logs.map((log) => [
      formatDay(log.date),
      new Map(log.symptoms.map((symptom) => [symptom.symptomType, symptom.severity])),
    ]),
  );
  const pointsByDay = getRecentDays(7).map((day) => ({
    day,
    values: valuesByDay.get(day) ?? new Map<string, number>(),
  }));
  const hasValues = pointsByDay.some((point) => symptomTypes.some((type) => point.values.has(type)));

  if (!hasValues) {
    return <p className="text-sm text-kelp/65">{dictionary["trend.empty"]}</p>;
  }

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const x = (index: number) =>
    PADDING.left + (pointsByDay.length === 1 ? plotWidth / 2 : (index / (pointsByDay.length - 1)) * plotWidth);
  const y = (value: number) => PADDING.top + plotHeight - (value / 5) * plotHeight;
  const labelIndexes = new Set([0, Math.floor((pointsByDay.length - 1) / 2), pointsByDay.length - 1]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-kelp/75">
        {symptomTypes.map((type, index) => (
          <span key={type} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            {type}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl bg-oat/70 p-2">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={translate(dictionary, "trend.aria", { types: symptomTypes.join(locale === "en" ? ", " : "、") })}
          className="h-auto min-w-[36rem] w-full"
        >
          {[0, 1, 2, 3, 4, 5].map((tick) => (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke="currentColor"
                className="text-kelp/10"
              />
              <text x={PADDING.left - 10} y={y(tick) + 4} textAnchor="end" className="fill-kelp/55 text-[11px]">
                {tick}
              </text>
            </g>
          ))}

          {symptomTypes.map((type, typeIndex) => {
            const segments = createSegments(pointsByDay, type);
            const color = COLORS[typeIndex % COLORS.length];

            return (
              <g key={type}>
                {segments.map((segment, segmentIndex) => (
                  <polyline
                    key={segmentIndex}
                    points={segment.map((point) => `${x(point.index)},${y(point.value)}`).join(" ")}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {pointsByDay.map((point, index) => {
                  const value = point.values.get(type);
                  return value === undefined ? null : (
                    <circle key={point.day} cx={x(index)} cy={y(value)} r="4" fill={color}>
                      <title>{`${point.day} ${type} ${formatSeverity(value)} / 5`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}

          {pointsByDay.map((point, index) =>
            labelIndexes.has(index) ? (
              <text
                key={point.day}
                x={x(index)}
                y={HEIGHT - 14}
                textAnchor={index === 0 ? "start" : index === pointsByDay.length - 1 ? "end" : "middle"}
                className="fill-kelp/55 text-[11px]"
              >
                {point.day.slice(5)}
              </text>
            ) : null,
          )}
        </svg>
      </div>
      <p className="mt-2 text-xs text-kelp/50">{dictionary["trend.note"]}</p>
    </div>
  );
}

function createSegments(
  points: Array<{ values: Map<string, number> }>,
  symptomType: string,
) {
  const segments: Array<Array<{ index: number; value: number }>> = [];
  let current: Array<{ index: number; value: number }> = [];

  points.forEach((point, index) => {
    const value = point.values.get(symptomType);
    if (value === undefined) {
      if (current.length > 0) segments.push(current);
      current = [];
      return;
    }
    current.push({ index, value });
  });

  if (current.length > 0) segments.push(current);
  return segments;
}

function formatDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getRecentDays(count: number) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, index) => {
    const day = new Date(today);
    day.setUTCDate(today.getUTCDate() - (count - 1 - index));
    return formatDay(day);
  });
}

function formatSeverity(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
import { getI18n } from "@/lib/i18n-server";
import { translate } from "@/lib/i18n";
