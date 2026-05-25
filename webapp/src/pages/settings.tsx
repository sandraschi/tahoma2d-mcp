import { useCallback, useEffect, useState } from "react";
import { getConfig, setConfig, type AppConfig } from "../api/mcp";

export default function SettingsPage() {
  const [config, setConfigState] = useState<AppConfig | null>(null);
  const [customPath, setCustomPath] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const c = await getConfig();
        setConfigState(c);
        setCustomPath(c.tahoma2d_path ?? "");
      } catch { setConfigState(null) }
    })();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setMsg("");
    try {
      const r = await setConfig(customPath);
      if (r.success) {
        setMsg(`Saved. Tahoma2D ${r.tahoma2d_available ? "found" : "not found"} at ${r.tahoma2d_path || "(none)"}`);
        const c = await getConfig();
        setConfigState(c);
      } else {
        setMsg(`Error: ${r.error}`);
      }
    } catch (e) {
      setMsg(`Error: ${e instanceof Error ? e.message : "Request failed"}`);
    } finally {
      setSaving(false);
    }
  }, [customPath]);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-sm text-muted-foreground">Server configuration and diagnostics</p>

      <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <h2 className="font-semibold">Tahoma2D Executable</h2>
        {config && (
          <div className="flex items-center space-x-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${config.tahoma2d_available ? "bg-green-500" : "bg-yellow-500"}`} />
            <span className="text-sm text-muted-foreground">
              {config.tahoma2d_available ? "Found" : "Not found"}
            </span>
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Path to Tahoma2D.exe</label>
          <input type="text" value={customPath} onChange={(e) => setCustomPath(e.target.value)}
            placeholder="C:\Program Files (x86)\Tahoma2D\Tahoma2D.exe"
            className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border font-mono" />
        </div>
        <div className="flex items-center space-x-3">
          <button disabled={saving} onClick={handleSave}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
            {saving ? "Saving..." : "Save Path"}
          </button>
          <a href="https://tahoma2d.org" target="_blank" rel="noopener noreferrer"
            className="text-xs text-primary hover:underline">
            Download Tahoma2D →
          </a>
        </div>
        {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
      </div>

      <div className="border border-border rounded-lg p-4 space-y-3 bg-card">
        <h2 className="font-semibold">Server Info</h2>
        {config ? (
          <div className="text-sm space-y-1 text-muted-foreground font-mono">
            <p>Frontend port: 11012</p>
            <p>Backend port: {config.mcp_port}</p>
            <p>MCP endpoint: /mcp ({config.mcp_transport})</p>
            <p>Log level: {config.log_level}</p>
            <p>Data dir: {config.tahoma2d_data_dir}</p>
            <p>Script dir: {config.tahoma2d_script_dir}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
      </div>
    </div>
  );
}
