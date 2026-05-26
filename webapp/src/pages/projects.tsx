import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Projects() {
  const [directory, setDirectory] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_project", params);
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Projects</h1>
      <p className="text-sm text-muted-foreground">Browse and manage .tnz scene files</p>

      <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <h2 className="font-semibold">Find Scenes</h2>
        <div className="flex space-x-2">
          <input type="text" value={directory} onChange={(e) => setDirectory(e.target.value)}
            placeholder="Directory path (leave empty for default)"
            className="flex-1 px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <button disabled={loading}
            onClick={() => run({ operation: "list", directory })}
            className="px-4 py-2 bg-accent rounded-lg text-sm font-medium disabled:opacity-50">
            List
          </button>
        </div>
      </div>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
