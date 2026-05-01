"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Variant = "cube" | "lattice" | "plinth";

function MeasuredCube() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.x = -0.35 + Math.sin(t * 0.3) * 0.04;
      ref.current.rotation.y = t * 0.18;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[2.4, 2.4, 2.4]} />
        <meshBasicMaterial color="#edeff7" />
      </mesh>
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(2.4, 2.4, 2.4)]} />
        <lineBasicMaterial color="#6e7180" />
      </lineSegments>
      {/* one accent edge */}
      <lineSegments position={[1.2, 0, 1.2]}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, -1.2, 0, 0, 1.2, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#de5123" linewidth={2} />
      </lineSegments>
    </group>
  );
}

function Lattice() {
  const ref = useRef<THREE.Group>(null);
  // 3x3x3 grid of small cubes — interlocking system feel
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) arr.push([x * 0.85, y * 0.85, z * 0.85]);
    return arr;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.x = -0.4 + Math.sin(t * 0.25) * 0.05;
      ref.current.rotation.y = t * 0.14;
    }
  });
  return (
    <group ref={ref}>
      {positions.map((p, i) => {
        const isAccent = i === 13; // center
        return (
          <group key={i} position={p}>
            <mesh>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshBasicMaterial color={isAccent ? "#de5123" : "#9da2b3"} />
            </mesh>
            <lineSegments>
              <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.3, 0.3, 0.3)]} />
              <lineBasicMaterial color={isAccent ? "#de5123" : "#6e7180"} />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
}

function Plinth() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.x = -0.3 + Math.sin(t * 0.25) * 0.04;
      ref.current.rotation.y = t * 0.15;
    }
  });
  // three stacked plates of decreasing footprint (execution stages)
  const tiers = [
    { y: -1.0, w: 2.6, h: 0.4, color: "#bcbfcc" },
    { y: -0.45, w: 2.0, h: 0.4, color: "#9da2b3" },
    { y: 0.1, w: 1.4, h: 0.4, color: "#6e7180" },
    { y: 0.55, w: 0.7, h: 0.4, color: "#de5123" },
  ];
  return (
    <group ref={ref} position={[0, -0.2, 0]}>
      {tiers.map((t, i) => (
        <group key={i} position={[0, t.y, 0]}>
          <mesh>
            <boxGeometry args={[t.w, t.h, t.w]} />
            <meshBasicMaterial color={t.color} />
          </mesh>
          <lineSegments>
            <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(t.w, t.h, t.w)]} />
            <lineBasicMaterial color="#111111" transparent opacity={0.35} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

export default function PillarPrimitive({ variant }: { variant: Variant }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [3.5, 2.4, 4.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {variant === "cube" && <MeasuredCube />}
      {variant === "lattice" && <Lattice />}
      {variant === "plinth" && <Plinth />}
    </Canvas>
  );
}
