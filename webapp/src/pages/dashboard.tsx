import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { callTool } from "../api/mcp";

export default function Dashboard() {
  const [status, setStatus] = useState("Checking...");
  const [tcomposerOk, setTcomposerOk] = useState(false);
  const [tahomaInstalled, setTahomaInstalled] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await callTool("tahoma2d_status", { operation: "status", format: "json" });
      if (r.success) {
        setStatus("Online");
        setTcomposerOk(true);
        setTahomaInstalled(true);
      } else {
        setStatus("Offline");
        setTcomposerOk(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <section>
        <h1 className="text-2xl font-bold">Tahoma2D Render Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Batch renderer for <strong>.tnz</strong> scenes — not the full animation editor.
        </p>
      </section>

      <section className="border border-border rounded-lg p-5 bg-card space-y-3">
        <h2 className="text-lg font-semibold">What is Tahoma2D?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <a href="https://tahoma2d.org" className="text-primary underline" target="_blank" rel="noreferrer">
            Tahoma2D
          </a>{" "}
          is a free <strong>2D animation program</strong> — a fork of{" "}
          <a href="https://opentoonz.github.io/" className="text-primary underline" target="_blank" rel="noreferrer">
            OpenToonz
          </a>
          . You draw levels, build an Xsheet timeline, and save{" "}
          <code className="text-xs bg-muted px-1 rounded">.tnz</code> scenes.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Heritage:</strong> OpenToonz came from <strong>Toonz</strong> (Digital Video) and the version{" "}
          <strong>Studio Ghibli</strong> used for ink &amp; paint on films like <em>Spirited Away</em> and{" "}
          <em>Princess Mononoke</em> — open-sourced in 2016. Tahoma2D continues that lineage.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>You animate in Tahoma2D.exe.</strong> This dashboard only runs{" "}
          <code className="text-xs bg-muted px-1 rounded">tcomposer.exe</code> to render scenes you already built.
        </p>
        <Link to="/help" className="text-sm text-primary underline">
          Full history &amp; install guide →
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-green-500/30 rounded-lg p-4 bg-card">
          <h3 className="font-semibold text-green-600 dark:text-green-400">Tahoma2D GUI (authoring)</h3>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
            <li>Draw, ink, paint, vector levels</li>
            <li>Timeline / Xsheet, effects, camera</li>
            <li>Save <code className="text-xs">.tnz</code> projects</li>
            <li>Use <Link to="/projects" className="text-primary underline">Projects → open</Link> from here</li>
          </ul>
        </div>
        <div className="border border-primary/30 rounded-lg p-4 bg-card">
          <h3 className="font-semibold text-primary">This MCP server (batch)</h3>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
            <li>List &amp; inspect <code className="text-xs">.tnz</code> files</li>
            <li>Render frame ranges via tcomposer</li>
            <li>Stitch frames to MP4 (ffmpeg)</li>
            <li>No scene editing or ToonzScript API</li>
          </ul>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">MCP server</p>
          <p className="text-2xl font-bold mt-1">{status}</p>
          <div className={`w-2 h-2 rounded-full mt-2 ${status === "Online" ? "bg-green-500" : "bg-yellow-500"}`} />
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">tcomposer</p>
          <p className="text-2xl font-bold mt-1">{tcomposerOk ? "Ready" : "Missing"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {tahomaInstalled ? "Tahoma2D install found" : "Set path in Settings"}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Typical workflow</p>
          <p className="text-sm font-bold mt-1">GUI → Render → Export</p>
          <p className="text-xs text-muted-foreground mt-1">Ports 11012 / 11013</p>
        </div>
      </div>

      <section className="border border-border rounded-lg p-5 bg-muted/20 space-y-2">
        <h2 className="font-semibold">Three-step pipeline</h2>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>
            Create or edit a scene in <strong>Tahoma2D</strong> and save <code className="text-xs bg-muted px-1 rounded">MyScene.tnz</code>
          </li>
          <li>
            <Link to="/render" className="text-primary underline">Render</Link> — pick the scene, frame range, output folder
          </li>
          <li>
            <Link to="/export" className="text-primary underline">Export</Link> — turn <code className="text-xs">frame_%04d.png</code> into MP4
          </li>
        </ol>
      </section>

      <section className="border border-border rounded-lg p-4 bg-card">
        <h2 className="font-semibold text-sm">New here?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Install Tahoma2D from tahoma2d.org, make a scene in the GUI, then come back to Render.
        </p>
        <Link to="/help" className="text-sm text-primary underline mt-2 inline-block">
          Help — install &amp; usage guide →
        </Link>
      </section>

      <p className="text-xs text-muted-foreground">
        More detail: <Link to="/help" className="text-primary underline">Help</Link> ·{" "}
        <a href="https://tahoma2d.org" className="text-primary underline" target="_blank" rel="noreferrer">
          tahoma2d.org
        </a>
      </p>
    </div>
  );
}
