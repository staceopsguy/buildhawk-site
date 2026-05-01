"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import HouseFrame from "./HouseFrame";

export default function HeroCanvas() {
  const [progress, setProgress] = useState(0);

  // Assemble-on-load: 0 → 1 over ~1.6s with eased ramp
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [9, 6, 14], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <HouseFrame progress={progress} />
      </Suspense>
    </Canvas>
  );
}
