import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function SettingsPage() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_status", { operation: "status", format: "json" });
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-sm text-muted-foreground">Server configuration and diagnostics</p>

      <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <h2 className="font-semibold">Server Info</h2>
        <div className="text-sm space-y-1 text-muted-foreground">
          <p>Frontend port: 11012</p>
          <p>Backend port: 11013</p>
          <p>MCP endpoint: /mcp</p>
        </div>
        <button disabled={loading} onClick={run}
          className="px-4 py-2 bg-accent rounded-lg text-sm font-medium disabled:opacity-50">
          Check Status
        </button>
      </div>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
