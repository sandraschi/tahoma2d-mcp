import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Effects() {
  const [canvasName, setCanvasName] = useState("Canvas");
  const [layerName, setLayerName] = useState("Layer");
  const [effectType, setEffectType] = useState("blur");
  const [intensity, setIntensity] = useState(1);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_effects", params);
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Effects</h1>
      <p className="text-sm text-muted-foreground">Apply visual effects to layers, manage FX node tree</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h2 className="font-semibold">Apply Effect</h2>
          <input type="text" value={canvasName} onChange={(e) => setCanvasName(e.target.value)}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <input type="text" value={layerName} onChange={(e) => setLayerName(e.target.value)}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <select value={effectType} onChange={(e) => setEffectType(e.target.value)}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border">
            <option value="blur">Blur</option>
            <option value="glow">Glow</option>
            <option value="shadow">Drop Shadow</option>
            <option value="tint">Tint</option>
            <option value="brightness">Brightness</option>
            <option value="edge">Edge Detection</option>
            <option value="mosaic">Mosaic</option>
          </select>
          <input type="number" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} min={0} max={10} step={0.1}
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <button disabled={loading} onClick={() => run({ operation: "apply", canvas_name: canvasName, layer_name: layerName, effect_type: effectType, intensity })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
            Apply
          </button>
        </div>
      </div>

      <button disabled={loading} onClick={() => run({ operation: "list" })}
        className="px-4 py-2 bg-accent rounded-lg text-sm font-medium disabled:opacity-50">
        List Available Effects
      </button>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
