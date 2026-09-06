"use client";

import { useEffect, useMemo, useState } from "react";
import { useIdleReady } from "./useIdleReady";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const MQ_SMALL = "(max-width: 767px)";
const MQ_REDUCED = "(prefers-reduced-motion: reduce)";

function makeOptions(count) {
  return {
    fpsLimit: 60,
    autoPlay: true,
    pauseOnBlur: true,
    pauseOnOutsideViewport: false,
    detectRetina: true,
    fullScreen: false,
    background: { color: "transparent" },
    particles: {
      number: { value: count, density: { enable: false } },
      color: { value: ["#C98A2C", "#D9B36A", "#8FA98A", "#A9C47A"] },
      opacity: { value: { min: 0.12, max: 0.36 } },
      size: { value: { min: 1, max: 3 } },
      move: {
        enable: true,
        direction: "top",
        speed: { min: 0.35, max: 0.9 },
        straight: false,
        drift: { min: -0.04, max: 0.04 },
        outModes: { default: "out" },
      },
      links: { enable: false },
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
        resize: { enable: true },
      },
    },
  };
}

/**
 * Слой 1 «пыльца на свету» (tsParticles, canvas 2D).
 * Fullscreen-канвас за контентом: 40–60 частиц 1–3 px на десктопе,
 * ~30 на мобильных (<768px). Инициализация — после контента
 * (requestIdleCallback), prefers-reduced-motion — статичный фон без канваса.
 */
export default function LivePollen() {
  const idleReady = useIdleReady();
  const [small, setSmall] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const smallMq = window.matchMedia(MQ_SMALL);
    const reducedMq = window.matchMedia(MQ_REDUCED);
    setSmall(smallMq.matches);
    setReduced(reducedMq.matches);
    const onSmall = (event) => setSmall(event.matches);
    const onReduced = (event) => setReduced(event.matches);
    smallMq.addEventListener("change", onSmall);
    reducedMq.addEventListener("change", onReduced);
    return () => {
      smallMq.removeEventListener("change", onSmall);
      reducedMq.removeEventListener("change", onReduced);
    };
  }, []);

  const options = useMemo(() => makeOptions(small ? 30 : 50), [small]);

  if (!idleReady) {
    return <div data-live-pollen="preload" aria-hidden="true" className="fixed inset-0 z-0" />;
  }

  if (idleReady && reduced) {
    return (
      <div
        data-live-pollen="static"
        aria-hidden="true"
        className="bg-pollen-static pointer-events-none fixed inset-0 z-[-1]"
      />
    );
  }

  return (
    <div
      data-live-pollen="canvas"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] h-screen w-screen"
    >
      <ParticlesProvider init={loadSlim}>
        <Particles id="live-pollen" options={options} className="h-full w-full" />
      </ParticlesProvider>
    </div>
  );
}