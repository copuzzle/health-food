"use client";

import { useRef, useState } from "react";
import { LoadingLabel } from "@/components/loading-label";

export function LoginPanel({ user }: { user: { email: string; name: string | null } | null }) {
  const formRef = useRef<HTMLFormElement | null>(null);
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
        setStatus(mode === "login" ? "已登录" : "已注册并登录");
        window.location.reload();
        return;
      }
      setStatus(mode === "login" ? "登录失败，请检查邮箱和密码" : "注册失败：邮箱可能已注册，或密码不足 8 位");
    } catch {
      setStatus("请求失败，请检查网络后重试");
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
        setStatus("退出失败，请重试");
        return;
      }
      window.location.reload();
    } catch {
      setStatus("退出失败，请检查网络后重试");
    } finally {
      setPendingAction(null);
    }
  }

  if (user) {
    return (
      <section className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
        <p className="text-sm text-kelp/60">当前账号</p>
        <h2 className="mt-1 text-xl font-black">{user.name || user.email}</h2>
        <p className="mt-1 text-sm text-kelp/70">{user.email}</p>
        <button
          onClick={logout}
          disabled={pendingAction !== null}
          className="mt-5 w-full rounded-2xl border border-kelp/20 px-4 py-3 text-sm font-black text-kelp disabled:opacity-45"
        >
          {pendingAction === "logout" ? <LoadingLabel>退出中...</LoadingLabel> : "退出登录"}
        </button>
        {status && <p className="mt-3 text-sm text-kelp/70">{status}</p>}
      </section>
    );
  }

  return (
    <form ref={formRef} className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
      <h2 className="text-xl font-black">登录后记录个人数据</h2>
      <p className="mt-2 text-sm leading-6 text-kelp/70">使用邮箱和密码注册账号，保护餐馆创建、评分和个人记录。</p>
      <label className="mt-5 block text-sm font-bold">
        邮箱
        <input name="email" type="email" required className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80" />
      </label>
      <label className="mt-4 block text-sm font-bold">
        密码
        <input name="password" type="password" required minLength={8} className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80" />
      </label>
      <label className="mt-4 block text-sm font-bold">
        昵称（注册时填写）
        <input name="name" type="text" maxLength={60} className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80" />
      </label>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" disabled={pendingAction !== null} onClick={() => submitCurrentForm("login")} className="rounded-2xl border border-kelp/20 px-4 py-3 font-black text-kelp disabled:opacity-45">
          {pendingAction === "login" ? <LoadingLabel>登录中...</LoadingLabel> : "登录"}
        </button>
        <button type="button" disabled={pendingAction !== null} onClick={() => submitCurrentForm("register")} className="rounded-2xl bg-kelp px-4 py-3 font-black text-oat disabled:opacity-45">
          {pendingAction === "register" ? <LoadingLabel>注册中...</LoadingLabel> : "注册"}
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-kelp/70">{status}</p>}
    </form>
  );
}
