"use client";

import { useEffect, useRef, useState } from "react";
import type { RestaurantSummary } from "@/lib/constants";

declare global {
  interface Window {
    AMap?: {
      Map: new (container: HTMLDivElement, options: Record<string, unknown>) => {
        add: (markers: unknown[]) => void;
        setFitView: () => void;
      };
      Marker: new (options: Record<string, unknown>) => unknown;
    };
  }
}

export function AmapMap({ restaurants }: { restaurants: RestaurantSummary[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const amapKey = process.env.NEXT_PUBLIC_AMAP_KEY;
  const shouldFallback = !amapKey || restaurants.length === 0;
  const visibleStatus = shouldFallback ? "fallback" : status;

  useEffect(() => {
    if (shouldFallback) {
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>("script[data-amap]");
    const loadMap = () => {
      if (!containerRef.current || !window.AMap) {
        setStatus("fallback");
        return;
      }

      const center = [restaurants[0].lng, restaurants[0].lat];
      const map = new window.AMap.Map(containerRef.current, {
        zoom: 12,
        center,
      });
      const markers = restaurants.map(
        (restaurant) =>
          new window.AMap!.Marker({
            position: [restaurant.lng, restaurant.lat],
            title: restaurant.name,
          }),
      );
      map.add(markers);
      map.setFitView();
      setStatus("ready");
    };

    if (window.AMap) {
      loadMap();
      return;
    }

    if (existing) {
      existing.addEventListener("load", loadMap, { once: true });
      return () => existing.removeEventListener("load", loadMap);
    }

    const script = document.createElement("script");
    script.dataset.amap = "true";
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`;
    script.async = true;
    script.onload = loadMap;
    script.onerror = () => setStatus("fallback");
    document.head.appendChild(script);
  }, [amapKey, restaurants, shouldFallback]);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-soft">
      <div ref={containerRef} className="h-64 w-full bg-sage/20" />
      {visibleStatus !== "ready" && (
        <div className="border-t border-white/70 p-4 text-sm text-kelp/70">
          {visibleStatus === "loading" ? "地图加载中..." : "未配置高德 Key，当前使用列表模式展示餐馆坐标。"}
        </div>
      )}
    </section>
  );
}
