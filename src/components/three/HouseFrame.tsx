"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A wireframe residential frame: foundation, studs, top plate, ridge.
 * Slow assemble-on-load + a single orange edge that traces the silhouette.
 */
export default function HouseFrame({ progress = 1 }: { progress?: number }) {
  const group = useRef<THREE.Group>(null);
  const traceRef = useRef<THREE.Line>(null);

  // Geometry: 12 x 6 x 4 building (W x H x D), flat foundation, stud spacing 2.
  const W = 12;
  const D = 7;
  const wallH = 4;
  const ridgeH = 6.5;
  const studSpacing = 2;
  const baseColor = "#6e7180";          // graphite
  const subtleColor = "#bcbfcc";        // steel
  const accentColor = "#de5123";        // orange

  // Build all line segments once.
  const { framePoints, accentPoints } = useMemo(() => {
    const fp: number[] = [];
    const push = (a: [number, number, number], b: [number, number, number]) => {
      fp.push(...a, ...b);
    };

    const halfW = W / 2;
    const halfD = D / 2;

    // Foundation (rectangle on ground)
    push([-halfW, 0, -halfD], [halfW, 0, -halfD]);
    push([halfW, 0, -halfD], [halfW, 0, halfD]);
    push([halfW, 0, halfD], [-halfW, 0, halfD]);
    push([-halfW, 0, halfD], [-halfW, 0, -halfD]);

    // Top plates at wallH
    push([-halfW, wallH, -halfD], [halfW, wallH, -halfD]);
    push([halfW, wallH, -halfD], [halfW, wallH, halfD]);
    push([halfW, wallH, halfD], [-halfW, wallH, halfD]);
    push([-halfW, wallH, halfD], [-halfW, wallH, -halfD]);

    // Vertical studs along front and back walls
    for (let x = -halfW; x <= halfW + 0.001; x += studSpacing) {
      push([x, 0, -halfD], [x, wallH, -halfD]);
      push([x, 0, halfD], [x, wallH, halfD]);
    }
    // Vertical studs along side walls (excluding corners already drawn)
    for (let z = -halfD + studSpacing; z <= halfD - studSpacing + 0.001; z += studSpacing) {
      push([-halfW, 0, z], [-halfW, wallH, z]);
      push([halfW, 0, z], [halfW, wallH, z]);
    }

    // Ridge beam
    push([-halfW, ridgeH, 0], [halfW, ridgeH, 0]);
    // Roof rafters: from ridge down to top plate edges, evenly spaced
    for (let x = -halfW; x <= halfW + 0.001; x += studSpacing) {
      push([x, ridgeH, 0], [x, wallH, -halfD]);
      push([x, ridgeH, 0], [x, wallH, halfD]);
    }
    // Gable ends
    push([-halfW, wallH, -halfD], [-halfW, ridgeH, 0]);
    push([-halfW, wallH, halfD], [-halfW, ridgeH, 0]);
    push([halfW, wallH, -halfD], [halfW, ridgeH, 0]);
    push([halfW, wallH, halfD], [halfW, ridgeH, 0]);

    // Accent: trace the right-hand silhouette (foundation -> wall corner -> ridge -> wall corner -> foundation)
    const ap: number[] = [];
    ap.push(-halfW, 0, halfD);
    ap.push(halfW, 0, halfD);
    ap.push(halfW, wallH, halfD);
    ap.push(halfW, ridgeH, 0);
    ap.push(halfW, wallH, -halfD);
    ap.push(-halfW, wallH, -halfD);
    ap.push(-halfW, ridgeH, 0);
    ap.push(-halfW, wallH, halfD);
    ap.push(-halfW, 0, halfD);

    return {
      framePoints: new Float32Array(fp),
      accentPoints: new Float32Array(ap),
    };
  }, []);

  const frameGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(framePoints, 3));
    return g;
  }, [framePoints]);

  const accentGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(accentPoints, 3));
    return g;
  }, [accentPoints]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      // House barely breathes; the camera rig drives parallax instead.
      group.current.rotation.y = -0.18 + Math.sin(t * 0.06) * 0.025;
      group.current.rotation.x = -0.05 + Math.sin(t * 0.04) * 0.012;
    }
    if (traceRef.current) {
      const mat = traceRef.current.material as THREE.LineDashedMaterial & {
        dashOffset?: number;
      };
      mat.dashOffset = -t * 1.2;
    }
  });

  return (
    <group ref={group} position={[0, -2.4, 0]}>
      {/* base wireframe (white-ish) */}
      <lineSegments geometry={frameGeo}>
        <lineBasicMaterial color={baseColor} transparent opacity={0.55 * progress} />
      </lineSegments>

      {/* halo: thicker subtle line (offset slightly behind) */}
      <lineSegments geometry={frameGeo} position={[0, 0, -0.005]}>
        <lineBasicMaterial color={subtleColor} transparent opacity={0.25 * progress} />
      </lineSegments>

      {/* orange traced silhouette */}
      <line
        // @ts-expect-error - r3f line element typing
        ref={traceRef}
        geometry={accentGeo}
      >
        <lineDashedMaterial
          color={accentColor}
          dashSize={0.6}
          gapSize={0.35}
          transparent
          opacity={0.95 * progress}
          linewidth={1}
        />
      </line>

      {/* ground shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[14, 64]} />
        <meshBasicMaterial color="#edeff7" transparent opacity={0.6 * progress} />
      </mesh>
    </group>
  );
}
