import { HEALTH_DISCLAIMER } from "@/lib/constants";

export function HealthDisclaimer() {
  return (
    <aside className="rounded-3xl border border-citrus/40 bg-citrus/15 px-4 py-3 text-xs leading-5 text-kelp">
      <strong className="font-black">健康边界：</strong>
      {HEALTH_DISCLAIMER}
    </aside>
  );
}
