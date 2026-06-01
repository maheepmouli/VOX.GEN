"use client";

import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

import type { Voxel, VoxelConfig } from "@/lib/voxel-engine";

const TYPE_COLOR: Record<string, string> = {
  A: "#18181b", // brand
  B: "#a1a1aa", // zinc-400
  C: "#059669", // accent emerald
};

function VoxelInstances({ voxels, unit }: { voxels: Voxel[]; unit: VoxelConfig["unit"] }) {
  const groups = useMemo(() => {
    const g: Record<string, Voxel[]> = { A: [], B: [], C: [] };
    voxels.forEach((v) => g[v.type]?.push(v));
    return g;
  }, [voxels]);

  // Normalize to a workable scene scale (largest unit dim -> 1 world unit).
  const maxUnit = Math.max(unit.x, unit.y, unit.z, 1);
  const sx = unit.x / maxUnit;
  const sy = unit.y / maxUnit;
  const sz = unit.z / maxUnit;

  return (
    <>
      {(Object.keys(groups) as Array<keyof typeof groups>).map((type) => {
        const list = groups[type];
        if (list.length === 0) return null;
        return (
          <InstancedBoxes
            key={type}
            voxels={list}
            color={TYPE_COLOR[type]}
            size={[sx, sz, sy]}
          />
        );
      })}
    </>
  );
}

function InstancedBoxes({
  voxels,
  color,
  size,
}: {
  voxels: Voxel[];
  color: string;
  size: [number, number, number];
}) {
  const meshRef = useMemo(() => {
    const mesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(size[0] * 0.98, size[1] * 0.98, size[2] * 0.98),
      new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05 }),
      voxels.length,
    );
    const dummy = new THREE.Object3D();
    voxels.forEach((v, i) => {
      dummy.position.set(v.x * size[0], v.z * size[1], v.y * size[2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, [voxels, color, size]);

  // Edges overlay for that CAD look.
  const edges = useMemo(() => {
    const eg = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(size[0] * 0.98, size[1] * 0.98, size[2] * 0.98),
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: "#18181b",
      opacity: 0.25,
      transparent: true,
    });
    const group = new THREE.Group();
    voxels.forEach((v) => {
      const line = new THREE.LineSegments(eg, lineMat);
      line.position.set(v.x * size[0], v.z * size[1], v.y * size[2]);
      group.add(line);
    });
    return group;
  }, [voxels, size]);

  return (
    <>
      <primitive object={meshRef} />
      <primitive object={edges} />
    </>
  );
}

export function VoxelViewport({
  voxels,
  config,
}: {
  voxels: Voxel[];
  config: VoxelConfig;
}) {
  const center: [number, number, number] = [config.grid.x / 2, 0, config.grid.y / 2];
  const distance = Math.max(config.grid.x, config.grid.y, config.grid.z) * 1.6 + 8;

  return (
    <Canvas dpr={[1, 2]} shadows>
      <color attach="background" args={["#fafafa"]} />
      <OrthographicCamera
        makeDefault
        position={[distance, distance, distance]}
        zoom={28}
        near={-1000}
        far={1000}
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.1} castShadow />
      <directionalLight position={[-10, 8, -5]} intensity={0.35} />
      <Grid
        position={[center[0], -0.01, center[2]]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#d4d4d8"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#a1a1aa"
        fadeDistance={60}
        fadeStrength={1}
        infiniteGrid
      />
      <VoxelInstances voxels={voxels} unit={config.unit} />
      <OrbitControls
        target={center}
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
    </Canvas>
  );
}
