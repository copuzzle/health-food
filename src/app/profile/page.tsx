import { LoginPanel } from "@/components/login-panel";
import { SymptomPreferencesForm } from "@/components/symptom-preferences-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getI18n } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { dictionary } = await getI18n();
  const user = await getCurrentUser().catch(() => null);
  const symptomPreferences = user
    ? await prisma.symptomPreference.findMany({
        where: { userId: user.id },
        orderBy: { sortOrder: "asc" },
      }).catch(() => [])
    : [];

  return (
    <div className="space-y-5">
      <LoginPanel user={user} />
      <SymptomPreferencesForm
        disabled={!user}
        initialSymptoms={symptomPreferences.map((item) => item.name)}
      />
      <section className="rounded-[2rem] bg-white/65 p-5 text-sm leading-6 text-kelp/70">
        <h3 className="font-black text-kelp">{dictionary["privacy.title"]}</h3>
        <p className="mt-2">
          {dictionary["privacy.body"]}
        </p>
      </section>
    </div>
  );
}
