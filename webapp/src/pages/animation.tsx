import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Animation() {
  const [canvasName, setCanvasName] = useState("Canvas");
  const [layerName, setLayerName] = useState("Layer");
  const [frame, setFrame] = useState(1);
  const [fps, setFps] = useState(24);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_animation", params);
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Animation Timeline</h1>
      <p className="text-sm text-muted-foreground">Keyframes, FPS, and timeline controls</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h2 className="font-semibold">Keyframe Controls</h2>
          <input type="text" value={canvasName} onChange={(e) => setCanvasName(e.target.value)}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <input type="text" value={layerName} onChange={(e) => setLayerName(e.target.value)}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <input type="number" value={frame} onChange={(e) => setFrame(Number(e.target.value))} min={1}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <div className="flex space-x-2">
            <button disabled={loading} onClick={() => run({ operation: "set_keyframe", canvas_name: canvasName, layer_name: layerName, frame })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
              Set Keyframe
            </button>
            <button disabled={loading} onClick={() => run({ operation: "clear_keyframe", canvas_name: canvasName, layer_name: layerName, frame })}
              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium disabled:opacity-50">
              Clear
            </button>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h2 className="font-semibold">Project Settings</h2>
          <input type="number" value={fps} onChange={(e) => setFps(Number(e.target.value))} min={1} max={120}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <button disabled={loading} onClick={() => run({ operation: "set_fps", fps })}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium disabled:opacity-50">
            Set FPS
          </button>
        </div>
      </div>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
