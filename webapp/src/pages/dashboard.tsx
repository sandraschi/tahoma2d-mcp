import { useEffect, useState } from "react";
import { callTool, getHealth } from "../api/mcp";

export default function Dashboard() {
  const [status, setStatus] = useState("Checking...");
  const [tahomaOk, setTahomaOk] = useState(false);
  const [output, setOutput] = useState("");

  useEffect(() => {
    (async () => {
      const health = await getHealth();
      if (!health.success) {
        setStatus("Backend unreachable");
        return;
      }
      const r = await callTool("tahoma2d_status", { operation: "status", format: "json" });
      if (r.success) {
        const d = typeof r.data === "string" ? JSON.parse(r.data.match(/STATUS:\s*(\{.*\})/)?.[1] || "{}") : r.data;
        setStatus(`v${d.version || "?"}`);
        setTahomaOk(d.tahoma2d_available || false);
        setOutput(JSON.stringify(d, null, 2));
      } else {
        setStatus("Error");
        setOutput(r.error || "Unknown error");
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">T2D</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Tahoma2D Dashboard</h1>
          <p className="text-sm text-muted-foreground">Server status and project overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Server Status</p>
          <p className="text-2xl font-bold mt-1">{status}</p>
          <div className={`w-2 h-2 rounded-full mt-2 ${tahomaOk ? "bg-green-500" : "bg-yellow-500"}`} />
          <p className="text-xs text-muted-foreground mt-1">
            {tahomaOk ? "Tahoma2D installed" : "Tahoma2D not found"}
          </p>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Projects</p>
          <p className="text-2xl font-bold mt-1">0</p>
          <p className="text-xs text-muted-foreground mt-1">Create or open a project to get started</p>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Webapp</p>
          <p className="text-2xl font-bold mt-1">11012</p>
          <p className="text-xs text-muted-foreground mt-1">Backend on :11013</p>
        </div>
      </div>

      {output && (
        <div className="border border-border rounded-lg p-4 bg-muted/20">
          <p className="text-sm font-mono whitespace-pre-wrap text-muted-foreground">{output}</p>
        </div>
      )}
    </div>
  );
}
