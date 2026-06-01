import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { VoxelViewport } from "@/components/voxel-viewport";
import {
  type AdjacencyRule,
  type VoxelConfig,
  type VoxelType,
  exportJSON,
  generateAssemblage,
} from "@/lib/voxel-engine";

export const Route = createFileRoute("/configurator")({
  head: () => ({
    meta: [
      { title: "Configurator — VOX.GEN" },
      {
        name: "description",
        content:
          "Configure unit dimensions, voxel grid, adjacency rules and seed. Generate the assemblage and export to Grasshopper, Rhino or Revit.",
      },
      { property: "og:title", content: "VOX.GEN Configurator" },
      {
        property: "og:description",
        content: "Live rule-based voxel assemblage configurator with CAD exports.",
      },
    ],
  }),
  component: ConfiguratorPage,
});

interface SavedAssemblage {
  id: string;
  name: string;
  createdAt: string;
  voxelCount: number;
  config: VoxelConfig;
}

const DEFAULT_CONFIG: VoxelConfig = {
  unit: { x: 400, y: 400, z: 200 },
  grid: { x: 24, y: 24, z: 12 },
  rules: [
    { id: "r1", from: "A", to: "B", probability: 0.85 },
    { id: "r2", from: "B", to: "C", probability: 0.4 },
    { id: "r3", from: "C", to: "A", probability: 0.6 },
  ],
  seed: 849201,
  iterations: 1200,
};

const STORAGE_KEY = "voxgen.saved-assemblages";

function ConfiguratorPage() {
  const [config, setConfig] = useState<VoxelConfig>(DEFAULT_CONFIG);
  const [name, setName] = useState("Modular_Cluster_A");
  const [saved, setSaved] = useState<SavedAssemblage[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const voxels = useMemo(() => generateAssemblage(config), [config]);

  const updateUnit = (axis: "x" | "y" | "z", value: number) =>
    setConfig((c) => ({ ...c, unit: { ...c.unit, [axis]: value } }));
  const updateGrid = (axis: "x" | "y" | "z", value: number) =>
    setConfig((c) => ({
      ...c,
      grid: { ...c.grid, [axis]: Math.max(2, Math.min(48, value)) },
    }));

  const addRule = () =>
    setConfig((c) => ({
      ...c,
      rules: [
        ...c.rules,
        {
          id: `r${Date.now()}`,
          from: "A",
          to: "B",
          probability: 0.5,
        },
      ],
    }));
  const updateRule = (id: string, patch: Partial<AdjacencyRule>) =>
    setConfig((c) => ({
      ...c,
      rules: c.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  const removeRule = (id: string) =>
    setConfig((c) => ({ ...c, rules: c.rules.filter((r) => r.id !== id) }));

  const regenerate = () =>
    setConfig((c) => ({ ...c, seed: Math.floor(Math.random() * 1_000_000) }));

  const saveAssemblage = () => {
    const entry: SavedAssemblage = {
      id: `a${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      voxelCount: voxels.length,
      config,
    };
    const next = [entry, ...saved].slice(0, 12);
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const downloadJSON = () => {
    const data = exportJSON(config, voxels, name);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "assemblage"}.voxgen.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const byType: Record<string, number> = { A: 0, B: 0, C: 0 };
    voxels.forEach((v) => (byType[v.type] += 1));
    return { total: voxels.length, byType };
  }, [voxels]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
          <aside className="col-span-12 lg:col-span-3 bg-surface ring-1 ring-black/5 rounded-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-zinc-50/50 flex items-center justify-between">
              <h2 className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                System parameters
              </h2>
              <span className="text-[10px] font-mono text-accent">{voxels.length} voxels</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-7">
              <Section label="Assemblage name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-muted ring-1 ring-border rounded p-2 text-sm font-mono focus:outline-none focus:ring-accent"
                />
              </Section>

              <Section label="Unit dimensions (mm)">
                <div className="grid grid-cols-3 gap-2">
                  {(["x", "y", "z"] as const).map((axis) => (
                    <NumberCell
                      key={axis}
                      label={axis.toUpperCase()}
                      value={config.unit[axis]}
                      onChange={(v) => updateUnit(axis, v)}
                    />
                  ))}
                </div>
              </Section>

              <Section label="Voxel grid">
                <div className="grid grid-cols-3 gap-2">
                  {(["x", "y", "z"] as const).map((axis) => (
                    <NumberCell
                      key={axis}
                      label={axis.toUpperCase()}
                      value={config.grid[axis]}
                      onChange={(v) => updateGrid(axis, v)}
                    />
                  ))}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground mt-2">
                  {config.grid.x}×{config.grid.y}×{config.grid.z} ={" "}
                  {config.grid.x * config.grid.y * config.grid.z} cells max
                </div>
              </Section>

              <Section
                label="Adjacency rules"
                action={
                  <button
                    type="button"
                    onClick={addRule}
                    className="text-[10px] uppercase font-semibold text-accent hover:underline"
                  >
                    + Add rule
                  </button>
                }
              >
                <div className="space-y-2">
                  {config.rules.map((r) => (
                    <RuleRow
                      key={r.id}
                      rule={r}
                      onChange={(patch) => updateRule(r.id, patch)}
                      onRemove={() => removeRule(r.id)}
                    />
                  ))}
                </div>
              </Section>

              <div className="grid grid-cols-2 gap-3">
                <Section label="Seed">
                  <input
                    type="number"
                    value={config.seed}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, seed: Number(e.target.value) }))
                    }
                    className="w-full bg-muted ring-1 ring-border rounded p-2 text-sm font-mono focus:outline-none focus:ring-accent"
                  />
                </Section>
                <Section label="Iterations">
                  <input
                    type="number"
                    value={config.iterations}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, iterations: Number(e.target.value) }))
                    }
                    className="w-full bg-muted ring-1 ring-border rounded p-2 text-sm font-mono focus:outline-none focus:ring-accent"
                  />
                </Section>
              </div>
            </div>
            <div className="p-4 border-t border-border space-y-2">
              <button
                type="button"
                onClick={regenerate}
                className="w-full bg-brand text-brand-foreground py-3 rounded-md text-sm font-medium ring-1 ring-brand hover:opacity-90 transition-opacity"
              >
                Regenerate (new seed)
              </button>
              <button
                type="button"
                onClick={saveAssemblage}
                className="w-full bg-muted text-foreground py-2 rounded-md text-xs font-medium ring-1 ring-border hover:bg-zinc-200 transition-colors"
              >
                Save assemblage
              </button>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-[420px]">
            <div className="flex-1 bg-zinc-50 ring-1 ring-black/5 rounded-lg relative overflow-hidden min-h-[360px]">
              <VoxelViewport voxels={voxels} config={config} />
              <div className="absolute bottom-3 left-3 flex gap-2 pointer-events-none">
                <div className="bg-surface/90 backdrop-blur ring-1 ring-black/10 px-3 py-1.5 rounded flex gap-4 text-[10px] font-mono">
                  <span>VOXELS: {stats.total}</span>
                  <span>
                    A:{stats.byType.A} B:{stats.byType.B} C:{stats.byType.C}
                  </span>
                  <span>
                    GRID: {((config.grid.x * config.unit.x) / 1000).toFixed(1)}m ×{" "}
                    {((config.grid.y * config.unit.y) / 1000).toFixed(1)}m
                  </span>
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <Legend type="A" />
                <Legend type="B" />
                <Legend type="C" />
              </div>
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-4 min-h-[420px]">
            <div className="flex-1 bg-surface ring-1 ring-black/5 rounded-lg flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border bg-zinc-50/50">
                <h2 className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Assemblages
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {saved.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Saved assemblages will appear here. They live in your browser until accounts are
                    enabled.
                  </p>
                )}
                {saved.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setConfig(s.config);
                      setName(s.name);
                    }}
                    className="w-full text-left p-3 bg-muted ring-1 ring-border rounded-md hover:ring-accent/40 transition-shadow"
                  >
                    <p className="text-xs font-semibold">{s.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1">
                      {new Date(s.createdAt).toLocaleString()} · {s.voxelCount} voxels
                    </p>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <button
                  type="button"
                  onClick={downloadJSON}
                  className="w-full bg-muted text-foreground py-2 rounded text-xs font-medium ring-1 ring-border hover:bg-zinc-200 transition-colors"
                >
                  Export JSON manifest
                </button>
              </div>
            </div>

            <div className="bg-surface ring-1 ring-black/5 rounded-lg p-4 space-y-3">
              <h3 className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                CAD artifacts
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <ArtifactButton label="Grasshopper (.gh)" version="v1.0.0" />
                <ArtifactButton label="Rhino Plugin (.rhp)" version="v0.9.0" />
                <ArtifactButton label="Revit Add-in (.dll)" version="v0.9.0" />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                Plugins read the JSON manifest and rebuild the assemblage natively.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Section({
  label,
  action,
  children,
}: {
  label: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}

function NumberCell({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="bg-muted ring-1 ring-border rounded px-2 py-1.5 flex flex-col focus-within:ring-accent">
      <span className="text-[9px] font-mono text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-sm font-mono outline-none bg-transparent w-full"
      />
    </div>
  );
}

function RuleRow({
  rule,
  onChange,
  onRemove,
}: {
  rule: AdjacencyRule;
  onChange: (patch: Partial<AdjacencyRule>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="p-2 bg-muted ring-1 ring-border rounded flex items-center gap-2 text-[11px] font-mono">
      <span className="text-muted-foreground">IF</span>
      <TypePicker value={rule.from} onChange={(v) => onChange({ from: v })} />
      <span className="text-muted-foreground">→</span>
      <TypePicker value={rule.to} onChange={(v) => onChange({ to: v })} />
      <input
        type="number"
        step="0.05"
        min={0}
        max={1}
        value={rule.probability}
        onChange={(e) =>
          onChange({ probability: Math.max(0, Math.min(1, Number(e.target.value))) })
        }
        className="w-14 bg-surface ring-1 ring-border rounded px-1 py-0.5 text-right outline-none focus:ring-accent"
      />
      <button
        type="button"
        onClick={onRemove}
        className="ml-auto text-muted-foreground hover:text-destructive text-[10px] uppercase"
        aria-label="Remove rule"
      >
        ✕
      </button>
    </div>
  );
}

function TypePicker({
  value,
  onChange,
}: {
  value: VoxelType;
  onChange: (v: VoxelType) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as VoxelType)}
      className="bg-surface ring-1 ring-border rounded px-1 py-0.5 outline-none focus:ring-accent"
    >
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
    </select>
  );
}

const LEGEND_COLORS: Record<VoxelType, string> = {
  A: "#18181b",
  B: "#a1a1aa",
  C: "#059669",
};

function Legend({ type }: { type: VoxelType }) {
  return (
    <div className="bg-surface/90 backdrop-blur ring-1 ring-black/10 px-2 py-1 rounded flex items-center gap-1.5 text-[10px] font-mono">
      <span
        className="inline-block size-2.5 rounded-sm"
        style={{ background: LEGEND_COLORS[type] }}
      />
      {type}
    </div>
  );
}

function ArtifactButton({ label, version }: { label: string; version: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        alert(
          `${label} will be served here once the compiled plugin file is uploaded on the Downloads page.`,
        )
      }
      className="text-left px-3 py-2 bg-muted ring-1 ring-border rounded flex items-center justify-between group hover:ring-zinc-400 transition-shadow"
    >
      <span className="text-xs font-medium">{label}</span>
      <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground">
        {version}
      </span>
    </button>
  );
}
