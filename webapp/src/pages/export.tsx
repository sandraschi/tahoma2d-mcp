import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Export() {
  const [inputPattern, setInputPattern] = useState("");
  const [outputPath, setOutputPath] = useState("output.mp4");
  const [fps, setFps] = useState(24);
  const [codec, setCodec] = useState("h264");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_export", params);
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Export Video</h1>
      <p className="text-sm text-muted-foreground">Convert rendered frame sequences to video via ffmpeg</p>

      <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <h2 className="font-semibold">FFmpeg Export</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Input Pattern</label>
            <input type="text" value={inputPattern} onChange={(e) => setInputPattern(e.target.value)}
              placeholder="C:/renders/frame_%04d.png"
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Output Path</label>
            <input type="text" value={outputPath} onChange={(e) => setOutputPath(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">FPS</label>
            <input type="number" value={fps} onChange={(e) => setFps(Number(e.target.value))} min={1} max={120}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Codec</label>
            <select value={codec} onChange={(e) => setCodec(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border">
              <option value="h264">H.264</option>
              <option value="h265">H.265 / HEVC</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <button disabled={loading || !inputPattern}
            onClick={() => run({ operation: "to_video", input_pattern: inputPattern, output_path: outputPath, fps, codec })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
            Export
          </button>
          <button disabled={loading}
            onClick={() => run({ operation: "check_ffmpeg" })}
            className="px-4 py-2 bg-accent rounded-lg text-sm font-medium disabled:opacity-50">
            Check ffmpeg
          </button>
        </div>
      </div>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
