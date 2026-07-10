import "server-only";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { dictionaries, localeFromAcceptLanguage, normalizeLocale } from "@/lib/i18n";

export async function getI18n() {
  const savedLocale = (await cookies()).get("locale")?.value;
  const locale = savedLocale
    ? normalizeLocale(savedLocale)
    : localeFromAcceptLanguage((await headers()).get("accept-language"));
  return { locale, dictionary: dictionaries[locale] };
}
