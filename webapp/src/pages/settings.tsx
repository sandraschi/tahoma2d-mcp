import { useCallback, useEffect, useState } from "react";
import { callTool, getConfig, setConfig } from "../api/mcp";

export default function SettingsPage() {
  const [tahomaPath, setTahomaPath] = useState("");
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const loadConfig = useCallback(async () => {
    try {
      const c = await getConfig();
      const p = c.tahoma2d_path ?? "";
      setTahomaPath(p);
      setSavedPath(p || null);
      setAvailable(c.tahoma2d_available);
    } catch {
      setSaveMsg("Could not load config — is the backend running?");
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const savePath = useCallback(async () => {
    setSaveMsg("");
    setLoading(true);
    try {
      const r = await setConfig(tahomaPath.trim());
      if (r.success) {
        setSavedPath(r.tahoma2d_path ?? null);
        setAvailable(r.tahoma2d_available ?? false);
        setSaveMsg(r.tahoma2d_available ? "Tahoma2D found." : "Path saved but Tahoma2D.exe not found at that location.");
      } else {
        setSaveMsg(r.error ?? "Save failed");
      }
    } finally {
      setLoading(false);
    }
  }, [tahomaPath]);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_status", { operation: "status", format: "json" });
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  const tcomposerHint = savedPath
    ? savedPath.replace(/Tahoma2D\.exe$/i, "tcomposer.exe")
    : null;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-sm text-muted-foreground">
        Point this server at your Tahoma2D install. See <a href="/help" className="text-primary underline">Help</a> for install steps.
      </p>

      <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <h2 className="font-semibold">Tahoma2D path</h2>
        <p className="text-sm text-muted-foreground">
          Full path to <code className="text-xs bg-muted px-1 rounded">Tahoma2D.exe</code>.{" "}
          <code className="text-xs bg-muted px-1 rounded">tcomposer.exe</code> must sit in the same folder.
        </p>
        <input
          type="text"
          value={tahomaPath}
          onChange={(e) => setTahomaPath(e.target.value)}
          placeholder="C:\Program Files\Tahoma2D\Tahoma2D.exe"
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background font-mono"
        />
        <div className="flex flex-wrap gap-2">
          <button
            disabled={loading}
            onClick={savePath}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Save path
          </button>
          <button
            disabled={loading}
            onClick={checkStatus}
            className="px-4 py-2 bg-accent rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Check status
          </button>
        </div>
        {saveMsg && <p className="text-sm text-muted-foreground">{saveMsg}</p>}
        <div className="text-sm space-y-1">
          <p>
            Detected:{" "}
            <span className={available ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
              {available ? "Yes" : "No"}
            </span>
          </p>
          {savedPath && (
            <p className="text-xs text-muted-foreground font-mono break-all">Tahoma2D: {savedPath}</p>
          )}
          {tcomposerHint && (
            <p className="text-xs text-muted-foreground font-mono break-all">tcomposer: {tcomposerHint}</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Or set env <code className="bg-muted px-1 rounded">TAHOMA2D_EXE</code> before starting the server.
          Auto-search also checks Program Files and <code className="bg-muted px-1 rounded">C:\Tahoma2D\</code>.
        </p>
      </div>

      <div className="border border-border rounded-lg p-4 space-y-2 bg-card">
        <h2 className="font-semibold">Server</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Frontend: port 11012</p>
          <p>Backend: port 11013</p>
          <p>MCP endpoint: /mcp</p>
        </div>
      </div>

      {output && (
        <div className="border rounded-lg p-4 bg-muted/20">
          <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
