import { useEffect, useState } from "react";
import { callTool } from "../api/mcp";

export default function Dashboard() {
  const [status, setStatus] = useState("Checking...");
  const [tcomposerOk, setTcomposerOk] = useState(false);
  const [tcomposerVer, setTcomposerVer] = useState("");

  useEffect(() => {
    (async () => {
      const r = await callTool("tahoma2d_status", { operation: "status", format: "json" });
      if (r.success) {
        const d = typeof r.data === "string" ? {} : r.data;
        setStatus("Online");
        setTcomposerOk(true);
        setTcomposerVer("v1.6.1");
      } else {
        setStatus("Offline");
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Tahoma2D Render Dashboard</h1>
      <p className="text-sm text-muted-foreground">Headless .tnz scene rendering via tcomposer.exe</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Server</p>
          <p className="text-2xl font-bold mt-1">{status}</p>
          <div className={`w-2 h-2 rounded-full mt-2 ${tcomposerOk ? "bg-green-500" : "bg-yellow-500"}`} />
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">tcomposer</p>
          <p className="text-2xl font-bold mt-1">{tcomposerVer || "N/A"}</p>
          <p className="text-xs text-muted-foreground mt-1">Headless renderer</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Workflow</p>
          <p className="text-sm font-bold mt-1">Edit → Render → Export</p>
          <p className="text-xs text-muted-foreground mt-1">Create .tnz in GUI, render here</p>
        </div>
      </div>
    </div>
  );
}
