import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";

export const metadata: Metadata = {
  title: "Eat Health | 低FODMAP餐馆与记录",
  description: "移动优先的低FODMAP餐馆地图与个人食物症状记录工具。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-24 pt-4">
          <header className="mb-4 flex items-center justify-between rounded-[2rem] border border-white/60 bg-white/55 px-4 py-3 shadow-soft backdrop-blur">
            <Link href="/logs" className="leading-tight">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay">Eat Health</p>
              <h1 className="text-xl font-black text-kelp">饮食记录</h1>
            </Link>
            <Link
              href="/profile"
              className="rounded-full bg-kelp px-4 py-2 text-sm font-bold text-oat shadow-sm"
            >
              我的
            </Link>
          </header>
          <main className="flex-1">{children}</main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
