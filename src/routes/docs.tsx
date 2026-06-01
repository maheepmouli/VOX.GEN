import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — VOX.GEN" },
      {
        name: "description",
        content:
          "How VOX.GEN's rule-based voxel growth, manifest schema, and CAD plugins fit together.",
      },
      { property: "og:title", content: "VOX.GEN Documentation" },
      {
        property: "og:description",
        content: "Rules, manifest schema, and CAD integration reference.",
      },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 prose-zinc">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
          Documentation
        </span>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">How VOX.GEN works</h1>

        <Section title="01 · Concepts">
          <p>
            A <strong>voxel</strong> is a single unit cell in the grid with one of three{" "}
            <strong>types</strong> (A, B, C). An <strong>assemblage</strong> is the full set of
            placed voxels resulting from running the growth solver against your configuration.
          </p>
        </Section>

        <Section title="02 · Rule-based growth">
          <p>
            The solver starts at the center of the grid floor with a type-A voxel. On each
            iteration it picks a frontier voxel at random, finds an applicable{" "}
            <em>adjacency rule</em>, rolls against the rule&apos;s probability, and — if it succeeds
            — places a new voxel of the rule&apos;s target type in a free neighbor cell. The random
            sequence is fully determined by the <code>seed</code>: same config, same output.
          </p>
        </Section>

        <Section title="03 · Manifest schema (voxgen/v1)">
          <pre className="bg-surface ring-1 ring-black/5 rounded p-4 text-[11px] font-mono overflow-x-auto">
            {`{
  "schema": "voxgen/v1",
  "name": "Modular_Cluster_A",
  "generatedAt": "2026-06-01T10:00:00Z",
  "config": {
    "unit":   { "x": 400, "y": 400, "z": 200 },
    "grid":   { "x": 24,  "y": 24,  "z": 12 },
    "rules":  [{ "id", "from", "to", "probability" }],
    "seed":   849201,
    "iterations": 1200
  },
  "voxels": [ { "x", "y", "z", "type" } ],
  "stats":  { "total", "byType": { "A", "B", "C" } }
}`}
          </pre>
          <p>
            Units are millimetres. Grid coordinates are integer cell indices; multiply by{" "}
            <code>config.unit</code> to get world-space positions in mm.
          </p>
        </Section>

        <Section title="04 · CAD integration">
          <p>
            All three downloadable artifacts (Grasshopper, Rhino, Revit) consume the same manifest.
            The Grasshopper script bakes geometry directly; the Rhino plugin exposes a{" "}
            <code>VoxGen</code> command; the Revit add-in places parametric families per voxel
            type. See the Downloads page for installation steps.
          </p>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12 space-y-3 text-sm leading-relaxed text-muted-foreground">
      <h2 className="text-base font-medium tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}
