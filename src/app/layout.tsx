import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { I18nProvider } from "@/components/i18n-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getI18n } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const { dictionary } = await getI18n();
  return { title: dictionary["meta.title"], description: dictionary["meta.description"] };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, dictionary } = await getI18n();
  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale} dictionary={dictionary}>
        <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-24 pt-4">
          <header className="mb-4 flex items-center justify-between rounded-[2rem] border border-white/60 bg-white/55 px-4 py-3 shadow-soft backdrop-blur">
            <Link href="/logs" className="leading-tight">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay">Eat Health</p>
              <h1 className="text-xl font-black text-kelp">{dictionary["app.subtitle"]}</h1>
            </Link>
            <div className="flex items-center gap-2"><LanguageSwitcher /><Link href="/profile" className="rounded-full bg-kelp px-4 py-2 text-sm font-bold text-oat shadow-sm">{dictionary["app.profile"]}</Link></div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
        <BottomNav />
        </I18nProvider>
      </body>
    </html>
  );
}
