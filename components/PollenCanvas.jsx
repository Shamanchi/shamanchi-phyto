"use client";

import { useEffect, useRef } from "react";

/**
 * Лёгкая генеративная пыльца на фоне (canvas, requestAnimationFrame, 60fps).
 */
export default function PollenCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(max-width: 640px)").matches ? 14 : 26;
    const dots = Array.from({ length: reduced }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2.2,
      vx: 0.000015 + Math.random() * 0.00004,
      vy: -0.00002 - Math.random() * 0.00005,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.55 ? "62,107,53" : "201,138,44",
    }));

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let lastFrame = 0;
    const FPS_INTERVAL = 33; // ~30 fps: дрейф пыльцы остаётся плавным, CPU вдвое ниже
    const tick = (time) => {
      if (time - lastFrame < FPS_INTERVAL) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastFrame = time;
      if (!visible) return;
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        const wave = Math.sin(time / 9000 + d.phase) * 0.12;
        if (d.y < -4) { d.y = 1; d.x = Math.random(); }
        if (d.x > 1.02) d.x = -0.02;
        ctx.beginPath();
        ctx.arc(d.x * width, d.y * height, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.hue},${0.12 + wave * 0.3})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    const startAfterLoad = () => {
      raf = requestAnimationFrame(tick);
    };
    if (document.readyState === "complete") {
      raf = requestAnimationFrame(tick);
    } else {
      window.addEventListener("load", startAfterLoad, { once: true });
      const safety = window.setTimeout(startAfterLoad, 1500);
      window.addEventListener("load", () => window.clearTimeout(safety), { once: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] h-full w-full"
    />
  );
}