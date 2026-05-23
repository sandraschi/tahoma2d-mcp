import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Draw() {
  const [canvasName, setCanvasName] = useState("Canvas");
  const [layerName, setLayerName] = useState("Layer");
  const [strokeType, setStrokeType] = useState("draw_stroke");
  const [thickness, setThickness] = useState(2);
  const [colorR, setColorR] = useState(0);
  const [colorG, setColorG] = useState(0);
  const [colorB, setColorB] = useState(0);
  const [radius, setRadius] = useState(50);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    try {
      const r = await callTool("tahoma2d_draw", params);
      setOutput(r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Draw & Paint</h1>
      <p className="text-sm text-muted-foreground">Draw strokes, shapes, and fill regions on Tahoma2D canvases</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h2 className="font-semibold">Drawing Tools</h2>
          <div className="space-y-2">
            <input type="text" value={canvasName} onChange={(e) => setCanvasName(e.target.value)}
              placeholder="Canvas" className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
            <input type="text" value={layerName} onChange={(e) => setLayerName(e.target.value)}
              placeholder="Layer" className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
            <select value={strokeType} onChange={(e) => setStrokeType(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border">
              <option value="draw_stroke">Freehand / Line</option>
              <option value="draw_box">Box</option>
              <option value="draw_circle">Circle</option>
            </select>
            <input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} min={0.1} step={0.5}
              placeholder="Thickness" className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h2 className="font-semibold">Color</h2>
          <div className="flex space-x-2">
            <input type="number" value={colorR} onChange={(e) => setColorR(Number(e.target.value))} min={0} max={255}
              className="w-16 px-2 py-2 bg-secondary rounded-lg text-sm border border-border text-center" placeholder="R" />
            <input type="number" value={colorG} onChange={(e) => setColorG(Number(e.target.value))} min={0} max={255}
              className="w-16 px-2 py-2 bg-secondary rounded-lg text-sm border border-border text-center" placeholder="G" />
            <input type="number" value={colorB} onChange={(e) => setColorB(Number(e.target.value))} min={0} max={255}
              className="w-16 px-2 py-2 bg-secondary rounded-lg text-sm border border-border text-center" placeholder="B" />
            <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: `rgb(${colorR},${colorG},${colorB})` }} />
          </div>
          <div className="text-xs text-muted-foreground">Shapes:</div>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1}
            placeholder="Width" className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1}
            placeholder="Height" className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
          <input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} min={1}
            placeholder="Radius" className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border border-border" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button disabled={loading} onClick={() => run({ operation: strokeType, canvas_name: canvasName, layer_name: layerName, thickness, color_r: colorR, color_g: colorG, color_b: colorB, width, height, radius })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
          Draw
        </button>
      </div>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
