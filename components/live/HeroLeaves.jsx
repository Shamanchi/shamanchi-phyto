"use client";

import { useEffect, useState } from "react";
import { useIdleReady } from "./useIdleReady";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const MQ_SMALL = "(max-width: 767px)";
const MQ_REDUCED = "(prefers-reduced-motion: reduce)";

const LEAF_OPTIONS = {
  fpsLimit: 60,
  autoPlay: true,
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  detectRetina: true,
  fullScreen: false,
  background: { color: "transparent" },
  particles: {
    number: { value: 10, density: { enable: false } },
    color: { value: ["#3E6B35", "#5E7A43", "#7D9B6A", "#6E8B4E"] },
    opacity: { value: { min: 0.5, max: 0.7 } },
    size: { value: { min: 13, max: 24 } },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: { min: 20, max: 70 }, sync: false },
    },
    move: {
      enable: true,
      direction: "bottom-left",
      speed: { min: 0.7, max: 1.5 },
      straight: false,
      outModes: { default: "out" },
    },
    shape: {
      type: "image",
      options: {
        image: {
          name: "leaf-demo",
          src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path d='M6 52C3 33 17 13 54 6c4 27-8 49-34 52-5 1-10-1-14-6Z' fill='%23ffffff'/></svg>"
          ),
          width: 64,
          height: 64,
          replaceColor: true,
        },
      },
    },
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

/**
 * Слой 2 «листья в hero» (tsParticles, canvas 2D): 8–12 частиц-листьев,
 * диагональное падение с вращением. Только первый экран (hero),
 * только десктоп (>=768px), вне вьюпорта канвас ставится на паузу.
 */
export default function HeroLeaves() {
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

  if (!idleReady || small || reduced) return null;

  return (
    <div
      data-live-leaves="canvas"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <ParticlesProvider init={loadSlim}>
        <Particles id="live-leaves" options={LEAF_OPTIONS} className="h-full w-full" />
      </ParticlesProvider>
    </div>
  );
}