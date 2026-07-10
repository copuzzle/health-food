import { LoginPanel } from "@/components/login-panel";
import { SymptomPreferencesForm } from "@/components/symptom-preferences-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
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
        <h3 className="font-black text-kelp">隐私提示</h3>
        <p className="mt-2">
          MVP 不采集身份证、病历或诊断结论。请避免在备注中填写敏感医疗信息；如需导出或删除数据，可在后续版本加入账号数据管理。
        </p>
      </section>
    </div>
  );
}
