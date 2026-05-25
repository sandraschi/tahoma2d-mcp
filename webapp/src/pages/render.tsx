import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Render() {
  const [outputPath, setOutputPath] = useState("render/output");
  const [startFrame, setStartFrame] = useState(1);
  const [endFrame, setEndFrame] = useState(100);
  const [fps, setFps] = useState(24);
  const [resolutionX, setResolutionX] = useState(1920);
  const [resolutionY, setResolutionY] = useState(1080);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_render", params);
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Render</h1>
      <p className="text-sm text-muted-foreground">Render frame sequences and animations</p>

      <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <h2 className="font-semibold">Render Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Output Path</label>
            <input type="text" value={outputPath} onChange={(e) => setOutputPath(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Start Frame</label>
            <input type="number" value={startFrame} onChange={(e) => setStartFrame(Number(e.target.value))} min={1}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">End Frame</label>
            <input type="number" value={endFrame} onChange={(e) => setEndFrame(Number(e.target.value))} min={1}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">FPS</label>
            <input type="number" value={fps} onChange={(e) => setFps(Number(e.target.value))} min={1} max={120}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Resolution X</label>
            <input type="number" value={resolutionX} onChange={(e) => setResolutionX(Number(e.target.value))} min={1}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Resolution Y</label>
            <input type="number" value={resolutionY} onChange={(e) => setResolutionY(Number(e.target.value))} min={1}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
        </div>
        <button disabled={loading} onClick={() => run({ operation: "render", output_path: outputPath, start_frame: startFrame, end_frame: endFrame, resolution_x: resolutionX, resolution_y: resolutionY, fps })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
          Render
        </button>
      </div>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
