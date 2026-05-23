import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function LayersPage() {
  const [canvasName, setCanvasName] = useState("Canvas");
  const [layerName, setLayerName] = useState("Layer");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_layer", params);
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Layer Manager</h1>
      <p className="text-sm text-muted-foreground">Create and manage animation layers</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h2 className="font-semibold">Create Layer</h2>
          <div className="space-y-2">
            <input type="text" value={canvasName} onChange={(e) => setCanvasName(e.target.value)}
              placeholder="Canvas name" className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
            <input type="text" value={layerName} onChange={(e) => setLayerName(e.target.value)}
              placeholder="Layer name" className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
            <button disabled={loading} onClick={() => run({ operation: "create", canvas_name: canvasName, layer_name: layerName })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
              Create Layer
            </button>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h2 className="font-semibold">List Layers</h2>
          <button disabled={loading} onClick={() => run({ operation: "list", canvas_name: canvasName })}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium disabled:opacity-50">
            List Layers on "{canvasName}"
          </button>
        </div>
      </div>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
