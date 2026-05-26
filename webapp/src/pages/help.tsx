export default function Help() {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Help & Reference</h1>
      <p className="text-sm text-muted-foreground">Tahoma2D MCP tool documentation</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Status</h2>
          <code className="text-xs text-primary">tahooma2d_status</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>status</b> — Server + tcomposer health</li>
            <li><b>help</b> — Tool reference</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Project</h2>
          <code className="text-xs text-primary">tahooma2d_project</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>list</b> — Find .tnz files</li>
            <li><b>info</b> — Scene metadata</li>
            <li><b>open</b> — Launch Tahoma2D GUI</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Render</h2>
          <code className="text-xs text-primary">tahooma2d_render</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>render</b> — Headless .tnz rendering via tcomposer</li>
            <li><b>check</b> — Verify tcomposer availability</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Export</h2>
          <code className="text-xs text-primary">tahooma2d_export</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>to_video</b> — Frame sequence to MP4 via ffmpeg</li>
            <li><b>check_ffmpeg</b> — Verify ffmpeg availability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
