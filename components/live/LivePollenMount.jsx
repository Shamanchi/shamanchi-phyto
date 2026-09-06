"use client";

import dynamic from "next/dynamic";

// Живой фон «пыльца» (tsParticles) монтируется только на клиенте: сначала
// отдаётся статичная бумага, затем после контента подключается канвас.
const LivePollen = dynamic(() => import("./LivePollen"), {
  ssr: false,
  loading: () => null,
});

export default function LivePollenMount() {
  return <LivePollen />;
}