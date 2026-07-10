"use client";

import { useRef, useState } from "react";
import { LoadingLabel } from "@/components/loading-label";
import { useI18n } from "@/components/i18n-provider";

export function LoginPanel({ user }: { user: { email: string; name: string | null } | null }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { t } = useI18n();
  const [status, setStatus] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"login" | "register" | "logout" | null>(null);

  async function submit(formData: FormData, mode: "login" | "register") {
    if (pendingAction) return;
    setPendingAction(mode);
    setStatus(null);
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          email: formData.get("email"),
          password: formData.get("password"),
          name: formData.get("name") || null,
        }),
      });

      if (response.ok) {
        setStatus(mode === "login" ? t("account.loggedIn") : t("account.registered"));
        window.location.reload();
        return;
      }
      setStatus(mode === "login" ? t("account.loginFailed") : t("account.registerFailed"));
    } catch {
      setStatus(t("common.networkError"));
    } finally {
      setPendingAction(null);
    }
  }

  function submitCurrentForm(mode: "login" | "register") {
    if (!formRef.current?.reportValidity()) {
      return;
    }

    void submit(new FormData(formRef.current), mode);
  }

  async function logout() {
    if (pendingAction) return;
    setPendingAction("logout");
    setStatus(null);
    try {
      const response = await fetch("/api/session", { method: "DELETE" });
      if (!response.ok) {
        setStatus(t("account.logoutFailed"));
        return;
      }
      window.location.reload();
    } catch {
      setStatus(t("account.logoutNetworkError"));
    } finally {
      setPendingAction(null);
    }
  }

  if (user) {
    return (
      <section className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
        <p className="text-sm text-kelp/60">{t("account.current")}</p>
        <h2 className="mt-1 text-xl font-black">{user.name || user.email}</h2>
        <p className="mt-1 text-sm text-kelp/70">{user.email}</p>
        <button
          onClick={logout}
          disabled={pendingAction !== null}
          className="mt-5 w-full rounded-2xl border border-kelp/20 px-4 py-3 text-sm font-black text-kelp disabled:opacity-45"
        >
          {pendingAction === "logout" ? <LoadingLabel>{t("account.loggingOut")}</LoadingLabel> : t("account.logout")}
        </button>
        {status && <p className="mt-3 text-sm text-kelp/70">{status}</p>}
      </section>
    );
  }

  return (
    <form ref={formRef} className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
      <h2 className="text-xl font-black">{t("account.title")}</h2>
      <p className="mt-2 text-sm leading-6 text-kelp/70">{t("account.description")}</p>
      <label className="mt-5 block text-sm font-bold">
        {t("account.email")}
        <input name="email" type="email" required className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80" />
      </label>
      <label className="mt-4 block text-sm font-bold">
        {t("account.password")}
        <input name="password" type="password" required minLength={8} className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80" />
      </label>
      <label className="mt-4 block text-sm font-bold">
        {t("account.name")}
        <input name="name" type="text" maxLength={60} className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80" />
      </label>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" disabled={pendingAction !== null} onClick={() => submitCurrentForm("login")} className="rounded-2xl border border-kelp/20 px-4 py-3 font-black text-kelp disabled:opacity-45">
          {pendingAction === "login" ? <LoadingLabel>{t("account.loggingIn")}</LoadingLabel> : t("account.login")}
        </button>
        <button type="button" disabled={pendingAction !== null} onClick={() => submitCurrentForm("register")} className="rounded-2xl bg-kelp px-4 py-3 font-black text-oat disabled:opacity-45">
          {pendingAction === "register" ? <LoadingLabel>{t("account.registering")}</LoadingLabel> : t("account.register")}
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-kelp/70">{status}</p>}
    </form>
  );
}
