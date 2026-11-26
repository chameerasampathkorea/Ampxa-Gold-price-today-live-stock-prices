"use client";

import { useEffect, useRef, useState } from "react";

/** Displays a pre-formatted value and briefly flashes green/red when the raw value changes. */
export function FlashValue({ value, text, className = "" }: { value: number; text: string; className?: string }) {
  const prev = useRef(value);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (value !== prev.current) {
      setFlash(value > prev.current ? "flash-up" : "flash-down");
      prev.current = value;
      const id = window.setTimeout(() => setFlash(""), 1200);
      return () => window.clearTimeout(id);
    }
  }, [value]);

  return <span className={`tabular rounded ${flash} ${className}`}>{text}</span>;
}
