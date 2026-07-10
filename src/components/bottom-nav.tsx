"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/logs", label: "记录" },
  { href: "/profile", label: "我的" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-white/60 bg-oat/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 text-center text-sm font-black transition ${
                active ? "bg-kelp text-oat shadow-soft" : "bg-white/60 text-kelp"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
