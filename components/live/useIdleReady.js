"use client";

import { useEffect, useState } from "react";

/**
 * Откладывает переключение флага ready до «после контента»:
 * ждём window.load (или 4s-страховку), затем requestIdleCallback
 * (фолбэк — setTimeout). Так канвасы tsParticles не конкурируют
 * с первым экраном за CPU/сеть (perf-политика как в волне 2).
 */
export function useIdleReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId = null;
    let safetyId = null;

    const startIdle = () => {
      if (cancelled) return;
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(
          () => {
            if (!cancelled) setReady(true);
          },
          { timeout: 900 }
        );
      } else {
        idleId = window.setTimeout(() => {
          if (!cancelled) setReady(true);
        }, 250);
      }
    };

    const start = () => {
      if (cancelled) return;
      if (document.readyState === "complete") {
        startIdle();
      } else {
        window.addEventListener("load", startIdle, { once: true });
        safetyId = window.setTimeout(startIdle, 4000);
        window.addEventListener(
          "load",
          () => window.clearTimeout(safetyId),
          { once: true }
        );
      }
    };
    start();

    return () => {
      cancelled = true;
      if (idleId !== null && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (idleId !== null && typeof idleId === "number" && !("cancelIdleCallback" in window)) window.clearTimeout(idleId);
      if (safetyId !== null) window.clearTimeout(safetyId);
      window.removeEventListener("load", startIdle);
    };
  }, []);

  return ready;
}