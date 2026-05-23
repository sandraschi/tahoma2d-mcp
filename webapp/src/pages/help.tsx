export default function Help() {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Help & Reference</h1>
      <p className="text-sm text-muted-foreground">Tahoma2D MCP tool documentation and animation reference</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Project Operations</h2>
          <code className="text-xs text-primary">tahoma2d_project</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>create</b> — New project with resolution/FPS</li>
            <li><b>open</b> — Open existing .tnz project</li>
            <li><b>save</b> — Save current project</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Canvas</h2>
          <code className="text-xs text-primary">tahoma2d_canvas</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>create</b> — Create canvas with dimensions</li>
            <li><b>list</b> — List all canvases</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Layers</h2>
          <code className="text-xs text-primary">tahoma2d_layer</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>create</b> — New layer on canvas</li>
            <li><b>list</b> — List layers with properties</li>
            <li><b>delete</b> — Remove layer</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Drawing</h2>
          <code className="text-xs text-primary">tahoma2d_draw</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>draw_stroke</b> — Freehand/line stroke</li>
            <li><b>draw_box</b> — Rectangle shape</li>
            <li><b>draw_circle</b> — Ellipse</li>
            <li><b>fill_region</b> — Color fill</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Animation</h2>
          <code className="text-xs text-primary">tahoma2d_animation</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>set_keyframe</b> — Insert keyframe</li>
            <li><b>clear_keyframe</b> — Remove keyframe</li>
            <li><b>set_fps</b> — Project frame rate</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Effects</h2>
          <code className="text-xs text-primary">tahoma2d_effects</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>apply</b> — Apply effect (blur, glow, shadow, tint)</li>
            <li><b>list</b> — Available effects</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Render & Export</h2>
          <code className="text-xs text-primary">tahoma2d_render</code>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li><b>render</b> — Render frame sequence</li>
            <li><b>export</b> — Export to MP4/GIF/MOV/SVG</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
