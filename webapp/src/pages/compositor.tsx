import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Compositor() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [canvasName, setCanvasName] = useState("Canvas");

  const run = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_canvas", params);
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Compositor</h1>
      <p className="text-sm text-muted-foreground">Multi-layer compositing and camera setup</p>

      <div className="border border-border rounded-lg p-4 bg-card">
        <p className="text-muted-foreground text-sm">
          Composite multiple layers with blending modes. Use the Layers page to set up layers,
          then apply effects per layer via the Effects page.
        </p>
      </div>

      <button disabled={loading} onClick={() => run({ operation: "list" })}
        className="px-4 py-2 bg-accent rounded-lg text-sm font-medium disabled:opacity-50">
        List Canvases
      </button>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
