export function SiteFooter() {
  return (
    <footer className="py-12 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            © {new Date().getFullYear()} VOX.GEN — Algorithmic Design Tools
          </div>
          <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
            By: Maheep Mouli Shashi
          </p>
        </div>
        <div className="flex gap-8">
          <a
            href="#"
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            Security
          </a>
          <a
            href="#"
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            API Reference
          </a>
        </div>
      </div>
    </footer>
  );
}
