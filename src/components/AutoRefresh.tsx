"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Re-renders the server components on an interval while the tab is visible,
 * so cached prices (revalidated every minute) appear without a full reload.
 */
export function AutoRefresh({ seconds = 60 }: { seconds?: number }) {
  const router = useRouter();
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (!on) return;
    const tick = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const id = window.setInterval(tick, seconds * 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [on, router, seconds]);

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-surface px-3 text-xs font-medium text-muted hover:text-ink"
      aria-pressed={on}
    >
      <span className={`h-2 w-2 rounded-full ${on ? "animate-pulse bg-up" : "bg-muted"}`} aria-hidden="true" />
      {on ? `Live · auto-refresh ${seconds}s` : "Auto-refresh paused"}
    </button>
  );
}
