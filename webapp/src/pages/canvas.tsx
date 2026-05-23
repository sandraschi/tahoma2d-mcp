import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Canvas() {
  const [name, setName] = useState("Canvas");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

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
      <h1 className="text-2xl font-bold">Canvas Manager</h1>
      <p className="text-sm text-muted-foreground">Create and manage Tahoma2D canvases</p>

      <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <h2 className="font-semibold">Create Canvas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Canvas name" className="px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1}
            className="px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1}
            className="px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <button disabled={loading} onClick={() => run({ operation: "create", name, width, height })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
            Create
          </button>
        </div>
      </div>

      <button disabled={loading} onClick={() => run({ operation: "list" })}
        className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium disabled:opacity-50">
        List Canvases
      </button>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
