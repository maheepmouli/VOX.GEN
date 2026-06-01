// Rule-based voxel growth engine.
// Deterministic given (config, seed). Produces a list of {x,y,z,type}.

export type VoxelType = "A" | "B" | "C";

export interface AdjacencyRule {
  id: string;
  from: VoxelType;
  to: VoxelType;
  probability: number; // 0..1
}

export interface VoxelConfig {
  unit: { x: number; y: number; z: number }; // mm
  grid: { x: number; y: number; z: number }; // voxel counts
  rules: AdjacencyRule[];
  seed: number;
  iterations: number;
}

export interface Voxel {
  x: number;
  y: number;
  z: number;
  type: VoxelType;
}

// Mulberry32 — small deterministic PRNG.
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NEIGHBORS: Array<[number, number, number]> = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export function generateAssemblage(config: VoxelConfig): Voxel[] {
  const rand = mulberry32(config.seed);
  const { grid, rules, iterations } = config;
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  const occupied = new Map<string, VoxelType>();

  // Seed point: center of grid floor.
  const start: Voxel = {
    x: Math.floor(grid.x / 2),
    y: Math.floor(grid.y / 2),
    z: 0,
    type: "A",
  };
  occupied.set(key(start.x, start.y, start.z), start.type);
  const frontier: Voxel[] = [start];

  let step = 0;
  while (step < iterations && frontier.length > 0) {
    const idx = Math.floor(rand() * frontier.length);
    const current = frontier[idx];
    const applicable = rules.filter((r) => r.from === current.type);
    if (applicable.length === 0) {
      frontier.splice(idx, 1);
      step++;
      continue;
    }
    const rule = applicable[Math.floor(rand() * applicable.length)];
    if (rand() > rule.probability) {
      step++;
      continue;
    }
    // Pick a free neighbor cell.
    const dirs = [...NEIGHBORS].sort(() => rand() - 0.5);
    let placed = false;
    for (const [dx, dy, dz] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const nz = current.z + dz;
      if (
        nx < 0 ||
        ny < 0 ||
        nz < 0 ||
        nx >= grid.x ||
        ny >= grid.y ||
        nz >= grid.z
      )
        continue;
      const k = key(nx, ny, nz);
      if (occupied.has(k)) continue;
      occupied.set(k, rule.to);
      frontier.push({ x: nx, y: ny, z: nz, type: rule.to });
      placed = true;
      break;
    }
    if (!placed) frontier.splice(idx, 1);
    step++;
  }

  return Array.from(occupied.entries()).map(([k, type]) => {
    const [x, y, z] = k.split(",").map(Number);
    return { x, y, z, type };
  });
}

export function exportJSON(config: VoxelConfig, voxels: Voxel[], name: string) {
  return {
    schema: "voxgen/v1",
    name,
    generatedAt: new Date().toISOString(),
    config,
    voxels,
    stats: {
      total: voxels.length,
      byType: voxels.reduce<Record<string, number>>((acc, v) => {
        acc[v.type] = (acc[v.type] ?? 0) + 1;
        return acc;
      }, {}),
    },
  };
}
