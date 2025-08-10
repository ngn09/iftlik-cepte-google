import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";

export function useDeepLinks() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handler = ({ url }: { url: string }) => {
      try {
        const u = new URL(url);
        // Route by path (supports custom scheme or domain-based universal links)
        const path = u.pathname + u.search + u.hash;
        if (path && path !== "/") navigate(path);
      } catch (e) {
        console.warn("Deep link parse error", e);
      }
    };

    const sub = CapApp.addListener("appUrlOpen", handler);
    return () => {
      sub.then((l) => l.remove());
    };
  }, [navigate]);
}
