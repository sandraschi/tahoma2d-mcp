import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Export() {
  const [outputPath, setOutputPath] = useState("export/animation.mp4");
  const [format, setFormat] = useState("mp4");
  const [fps, setFps] = useState(24);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_render", params);
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Export</h1>
      <p className="text-sm text-muted-foreground">Export project to video, GIF, or image sequence</p>

      <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <h2 className="font-semibold">Export Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" value={outputPath} onChange={(e) => setOutputPath(e.target.value)}
            className="px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <select value={format} onChange={(e) => setFormat(e.target.value)}
            className="px-3 py-2 bg-secondary rounded-lg text-sm border border-border">
            <option value="mp4">MP4</option>
            <option value="gif">GIF</option>
            <option value="mov">MOV</option>
            <option value="png">PNG Sequence</option>
            <option value="svg">SVG</option>
          </select>
          <input type="number" value={fps} onChange={(e) => setFps(Number(e.target.value))} min={1} max={120}
            className="px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
        </div>
        <button disabled={loading} onClick={() => run({ operation: "export", output_path: outputPath, format, fps })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
          Export
        </button>
      </div>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
