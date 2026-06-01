import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VOX.GEN — Voxel assemblage automation for Rhino, Grasshopper & Revit" },
      {
        name: "description",
        content:
          "Configure rule-based voxel assemblages in the browser, preview in 3D, and download native artifacts for Grasshopper, Rhino, and Revit.",
      },
      { property: "og:title", content: "VOX.GEN — Voxel assemblage automation" },
      {
        property: "og:description",
        content:
          "Rule-based voxel growth, live 3D preview, and one-click export to .gh, .rhp/.gha, and Revit .dll.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <SiteHeader />

      <section className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              <div className="size-1.5 bg-accent rounded-full" />
              Parametric engine · v1.0
            </div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-balance leading-[1.05] max-w-[20ch]">
              Automate architectural voxel assemblages with precise adjacency logic.
            </h1>
            <p className="text-base text-muted-foreground text-pretty max-w-[60ch] leading-relaxed">
              Construct complex modular systems using rule-based growth algorithms. Configure units
              and voxels in the browser, watch the assemblage grow in real time, and export native
              geometry for Rhino, Revit, and Grasshopper with full metadata preserved.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/configurator"
                className="bg-brand text-brand-foreground text-sm font-medium py-3 px-5 rounded-md ring-1 ring-brand hover:opacity-90 transition-opacity"
              >
                Open configurator
              </Link>
              <Link
                to="/downloads"
                className="text-sm font-medium py-3 px-5 rounded-md ring-1 ring-border bg-surface hover:bg-muted transition-colors"
              >
                Download plugins
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <HeroSpec />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          tag="01"
          title="Rule-based growth"
          body="Define adjacency rules between voxel types, set probabilities, seeds and iterations. Deterministic output you can re-run identically."
        />
        <FeatureCard
          tag="02"
          title="Live 3D preview"
          body="Watch the assemblage compute and render in real time with orthographic CAD-style controls and proper grid."
        />
        <FeatureCard
          tag="03"
          title="Native CAD exports"
          body="Download a Grasshopper template, Rhino plugin, Revit add-in, and the JSON manifest all three speak."
        />
      </section>

      <SiteFooter />
    </div>
  );
}

function FeatureCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div className="bg-surface ring-1 ring-black/5 rounded-lg p-6 flex flex-col gap-3">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">{tag}</span>
      <h3 className="text-base font-medium tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{body}</p>
    </div>
  );
}

function HeroSpec() {
  return (
    <div className="bg-surface ring-1 ring-black/5 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-zinc-50/50 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Manifest preview
        </span>
        <span className="text-[10px] font-mono text-accent">voxgen/v1</span>
      </div>
      <pre className="font-mono text-[11px] leading-relaxed p-5 text-foreground overflow-x-auto">
        {`{
  "schema": "voxgen/v1",
  "name": "Modular_Cluster_A",
  "config": {
    "unit":   { "x": 400, "y": 400, "z": 200 },
    "grid":   { "x": 24,  "y": 24,  "z": 12 },
    "rules": [
      { "from": "A", "to": "B", "p": 0.85 },
      { "from": "B", "to": "C", "p": 0.40 }
    ],
    "seed": 849201,
    "iterations": 1200
  },
  "stats": { "total": 768, "byType": { "A": 312, "B": 298, "C": 158 } }
}`}
      </pre>
    </div>
  );
}
