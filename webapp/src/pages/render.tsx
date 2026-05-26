import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Render() {
  const [scenePath, setScenePath] = useState("");
  const [startFrame, setStartFrame] = useState(1);
  const [endFrame, setEndFrame] = useState(100);
  const [step, setStep] = useState(1);
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
      <h1 className="text-2xl font-bold">Render Scene</h1>
      <p className="text-sm text-muted-foreground">Headlessly render .tnz scenes via tcomposer.exe</p>

      <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <h2 className="font-semibold">Render Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-3">
            <label className="text-xs text-muted-foreground">Scene File (.tnz)</label>
            <input type="text" value={scenePath} onChange={(e) => setScenePath(e.target.value)}
              placeholder="C:/Tahoma2D/projects/my_scene.tnz"
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
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Step</label>
            <input type="number" value={step} onChange={(e) => setStep(Number(e.target.value))} min={1}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
        </div>
        <button disabled={loading || !scenePath}
          onClick={() => run({ operation: "render", scene_path: scenePath, start_frame: startFrame, end_frame: endFrame, step })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? "Rendering..." : "Render"}
        </button>
      </div>

      <button disabled={loading}
        onClick={() => run({ operation: "check" })}
        className="px-4 py-2 bg-accent rounded-lg text-sm font-medium disabled:opacity-50">
        Check tcomposer
      </button>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
