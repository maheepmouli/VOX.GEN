import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — VOX.GEN plugins for Rhino, Grasshopper & Revit" },
      {
        name: "description",
        content:
          "Download the VOX.GEN Grasshopper script, Rhino plugin, and Revit add-in. All three read the same JSON manifest exported from the configurator.",
      },
      { property: "og:title", content: "VOX.GEN Downloads" },
      {
        property: "og:description",
        content: "Native CAD plugins and the universal JSON manifest schema.",
      },
    ],
  }),
  component: DownloadsPage,
});

interface Artifact {
  tag: "Stable" | "Beta" | "Planned";
  title: string;
  ext: string;
  description: string;
  install: string[];
  size: string;
  updated: string;
  href?: string;
  downloadName?: string;
}

const ARTIFACTS: Artifact[] = [
  {
    tag: "Stable",
    title: "Rhino 7 plugin installer",
    ext: ".zip · .gha / .dll",
    description:
      "Grasshopper components and Rhino bridge DLLs for Rhino 7. Includes Assemblage.gha, Assemblage.Rhino.dll, and Assemblage.Core.dll.",
    install: [
      "Download and extract the ZIP.",
      "Copy Assemblage.gha to your Grasshopper Libraries folder (Grasshopper → File → Preferences → Libraries).",
      "Keep Assemblage.Rhino.dll and Assemblage.Core.dll in the same folder as the .gha.",
      "Restart Rhino 7 and open Grasshopper.",
    ],
    size: "33 KB",
    updated: "Jun 2026",
    href: "/downloads/voxgen-rhino-7-installer.zip",
    downloadName: "voxgen-rhino-7-installer.zip",
  },
  {
    tag: "Stable",
    title: "Rhino 8 plugin installer",
    ext: ".zip · .gha / .dll",
    description:
      "Same VOX.GEN Grasshopper integration built for Rhino 8. Use this package on Rhino 8 workflows; manifests from the configurator are identical.",
    install: [
      "Download and extract the ZIP.",
      "Copy Assemblage.gha to your Grasshopper Libraries folder (Grasshopper → File → Preferences → Libraries).",
      "Keep Assemblage.Rhino.dll and Assemblage.Core.dll in the same folder as the .gha.",
      "Restart Rhino 8 and open Grasshopper.",
    ],
    size: "34 KB",
    updated: "Jun 2026",
    href: "/downloads/voxgen-rhino-8-installer.zip",
    downloadName: "voxgen-rhino-8-installer.zip",
  },
  {
    tag: "Stable",
    title: "Grasshopper example definitions",
    ext: ".zip · .gh",
    description:
      "Reference Grasshopper files: custom assemblage storage, postprocess strategies (v6 & v7), and multidimensional data visualization. Pair with a manifest from the configurator.",
    install: [
      "Download and extract the ZIP.",
      "Open Rhino 7 or 8 and launch Grasshopper.",
      "Open an example .gh file from the archive.",
      "Point the manifest input to your exported JSON from the configurator.",
    ],
    size: "1.2 MB",
    updated: "Jun 2026",
    href: "/downloads/voxgen-grasshopper-examples.zip",
    downloadName: "voxgen-grasshopper-examples.zip",
  },
  {
    tag: "Planned",
    title: "Revit add-in",
    ext: ".dll + .addin",
    description:
      "Imports a VOX.GEN manifest, places parametric families per voxel type, and tags them with assemblage metadata. Targets Revit 2022–2025.",
    install: [
      "Copy the .dll and .addin to %APPDATA%/Autodesk/Revit/Addins/<year>/.",
      "Restart Revit. The VOX.GEN tab appears on the ribbon.",
      "Click Import Manifest and select your .voxgen.json file.",
    ],
    size: "— MB",
    updated: "Awaiting upload",
  },
];

function DownloadsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
              Downloads
            </span>
            <h1 className="mt-3 text-3xl md:text-4xl font-medium tracking-tight">
              Integration plugins
            </h1>
            <p className="mt-4 text-sm text-muted-foreground text-pretty leading-relaxed max-w-[45ch]">
              Native bridges that sync VOX.GEN voxel metadata into your BIM and computational
              workflows. All three artifacts speak the same{" "}
              <span className="font-mono text-foreground">voxgen/v1</span> JSON manifest.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="bg-surface ring-1 ring-black/5 rounded-lg p-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Manifest schema
              </div>
              <pre className="font-mono text-[11px] leading-relaxed overflow-x-auto">
                {`{ "schema": "voxgen/v1",
  "config": { "unit": {x,y,z}, "grid": {x,y,z},
              "rules": [{ "from", "to", "p" }],
              "seed", "iterations" },
  "voxels": [ { "x", "y", "z", "type" } ] }`}
              </pre>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {ARTIFACTS.map((a) => (
            <ArtifactCard key={a.title} artifact={a} />
          ))}
        </div>

        <section className="mt-20 border-t border-border pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h2 className="text-xl font-medium tracking-tight">Roll your own</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The manifest is intentionally trivial to consume. If you already have a custom Rhino
              or Revit pipeline, deserialize the JSON and use the voxel list directly.
            </p>
          </div>
          <div className="lg:col-span-8 bg-surface ring-1 ring-black/5 rounded-lg p-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">
              C# snippet
            </div>
            <pre className="font-mono text-[11px] leading-relaxed overflow-x-auto">
              {`var json = File.ReadAllText(path);
var manifest = JsonSerializer.Deserialize<VoxGenManifest>(json);
foreach (var v in manifest.Voxels) {
    var origin = new XYZ(
        v.X * manifest.Config.Unit.X,
        v.Y * manifest.Config.Unit.Y,
        v.Z * manifest.Config.Unit.Z);
    PlaceFamilyByType(v.Type, origin);
}`}
            </pre>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const tagColor =
    artifact.tag === "Stable"
      ? "text-accent bg-accent/10"
      : artifact.tag === "Beta"
        ? "text-amber-700 bg-amber-100"
        : "text-muted-foreground bg-muted";
  return (
    <article className="bg-surface ring-1 ring-black/5 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${tagColor}`}
        >
          {artifact.tag}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">{artifact.ext}</span>
      </div>
      <div>
        <h3 className="font-medium tracking-tight">{artifact.title}</h3>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed text-pretty">
          {artifact.description}
        </p>
      </div>
      <ol className="text-xs text-foreground space-y-1.5 list-decimal list-inside marker:text-muted-foreground">
        {artifact.install.map((step) => (
          <li key={step} className="leading-relaxed text-muted-foreground">
            <span className="text-foreground">{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">
          {artifact.size} · {artifact.updated}
        </span>
        {artifact.href ? (
          <a
            href={artifact.href}
            download={artifact.downloadName}
            className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            Download →
          </a>
        ) : (
          <span className="text-xs font-semibold text-muted-foreground">Coming soon</span>
        )}
      </div>
    </article>
  );
}
