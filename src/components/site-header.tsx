import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-5 bg-brand rounded-sm" />
            <span className="font-mono text-sm font-semibold tracking-tight">VOX.GEN</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/configurator"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-sm text-foreground" }}
            >
              Configurator
            </Link>
            <Link
              to="/downloads"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-sm text-foreground" }}
            >
              Downloads
            </Link>
            <Link
              to="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-sm text-foreground" }}
            >
              Documentation
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </button>
          <Link
            to="/configurator"
            className="bg-brand text-brand-foreground text-sm font-medium py-2 pr-3 pl-2 flex items-center gap-2 ring-1 ring-brand rounded-md hover:opacity-90 transition-opacity"
          >
            <div className="size-4 bg-white/20 rounded-full shrink-0" />
            <span>Open Configurator</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
