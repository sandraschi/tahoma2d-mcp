import { useState } from "react";

const TABS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "project", label: "Project" },
  { id: "canvas", label: "Canvas" },
  { id: "layers", label: "Layers" },
  { id: "drawing", label: "Drawing" },
  { id: "animation", label: "Animation" },
  { id: "effects", label: "Effects" },
  { id: "render-export", label: "Render & Export" },
  { id: "status", label: "Status" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function TabButton({ id, label, active, onClick }: { id: TabId; label: string; active: boolean; onClick: (id: TabId) => void }) {
  return (
    <button onClick={() => onClick(id)}
      className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}>
      {label}
    </button>
  );
}

function Code({ children }: { children: string }) {
  return <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-primary font-mono">{children}</code>;
}

function Param({ name, type, desc, required }: { name: string; type: string; desc: string; required?: boolean }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="font-mono text-xs font-medium text-foreground min-w-28">{name}</span>
      <span className="text-xs text-muted-foreground min-w-20">{type}</span>
      <span className="text-xs text-muted-foreground flex-1">{desc}</span>
      {required && <span className="text-xs text-primary">required</span>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function GettingStartedTab() {
  return (
    <div className="space-y-6">
      <Section title="What is Tahoma2D?">
        <p className="text-sm text-muted-foreground">
          Tahoma2D is an active open-source fork of OpenToonz, the 2D animation software used by Studio Ghibli.
          It supports traditional frame-by-frame animation, bone rigging, effects compositing, and more.
        </p>
      </Section>

      <Section title="Download & Install">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>1. Go to <a href="https://tahoma2d.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tahoma2d.org</a></p>
          <p>2. Download the latest release for Windows (portable zip or installer)</p>
          <p>3. Extract or install to any location (e.g. <Code>C:\Program Files (x86)\Tahoma2D\</Code>)</p>
          <p>4. The server will auto-detect it, or set the path in Settings</p>
        </div>
      </Section>

      <Section title="Quick Start">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Run <Code>.\start.ps1</Code> from the repo root, then open <Code>http://localhost:11012</Code>.</p>
          <p>The dashboard shows server status and Tahoma2D availability.</p>
          <p>Use the Canvas page to create a canvas, then Layers to add layers, then Draw to paint.</p>
        </div>
      </Section>

      <Section title="MCP Tools">
        <p className="text-sm text-muted-foreground">
          All tools are exposed via MCP for AI assistants (Claude Code, etc.) and via a REST bridge
          for the web dashboard. See the other tabs for operation details.
        </p>
      </Section>
    </div>
  );
}

function ProjectTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Create, open, and save Tahoma2D projects (.tnz files).</p>
      <Section title="Operations">
        <div className="space-y-2">
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>create</Code></p>
            <Param name="name" type="string" desc="Project name" required />
            <Param name="width" type="int" desc="Canvas width (px)" required />
            <Param name="height" type="int" desc="Canvas height (px)" required />
            <Param name="fps" type="int" desc="Frame rate (default: 24)" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>open</Code></p>
            <Param name="path" type="string" desc="Path to .tnz file" required />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>save</Code></p>
            <Param name="path" type="string" desc="Output path (optional, defaults to current)" />
          </div>
        </div>
      </Section>
    </div>
  );
}

function CanvasTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Manage canvases (scenes) within a project. Each canvas has a resolution and aspect ratio.</p>
      <Section title="Operations">
        <div className="space-y-2">
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>create</Code></p>
            <Param name="name" type="string" desc="Canvas name" required />
            <Param name="width" type="int" desc="Width in px" required />
            <Param name="height" type="int" desc="Height in px" required />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>list</Code></p>
            <p className="text-xs text-muted-foreground">Returns all canvases with dimensions.</p>
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>resize</Code></p>
            <Param name="name" type="string" desc="Canvas name" required />
            <Param name="width" type="int" desc="New width" required />
            <Param name="height" type="int" desc="New height" required />
          </div>
        </div>
      </Section>
    </div>
  );
}

function LayersTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Manage layers on a canvas. Layers stack bottom-to-top for compositing.</p>
      <Section title="Operations">
        <div className="space-y-2">
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>create</Code></p>
            <Param name="canvas" type="string" desc="Parent canvas name" required />
            <Param name="name" type="string" desc="Layer name" required />
            <Param name="type" type="string" desc="Layer type (e.g. raster, vector)" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>list</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>delete</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="name" type="string" desc="Layer name" required />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>set_visibility</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="name" type="string" desc="Layer name" required />
            <Param name="visible" type="bool" desc="Show/hide layer" required />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>set_opacity</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="name" type="string" desc="Layer name" required />
            <Param name="opacity" type="float" desc="Opacity 0.0-1.0" required />
          </div>
        </div>
      </Section>
    </div>
  );
}

function DrawingTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Draw strokes, shapes, and fills on layers. Colors are RGB (0-255).</p>
      <Section title="Operations">
        <div className="space-y-2">
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>draw_stroke</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="layer" type="string" desc="Layer name" required />
            <Param name="points" type="[[x,y,z]]" desc="Array of point coordinates" required />
            <Param name="thickness" type="float" desc="Stroke thickness" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>draw_box</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="layer" type="string" desc="Layer name" required />
            <Param name="x" type="float" desc="Top-left X" required />
            <Param name="y" type="float" desc="Top-left Y" required />
            <Param name="width" type="float" desc="Box width" required />
            <Param name="height" type="float" desc="Box height" required />
            <Param name="thickness" type="float" desc="Stroke thickness" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>draw_circle</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="layer" type="string" desc="Layer name" required />
            <Param name="x" type="float" desc="Center X" required />
            <Param name="y" type="float" desc="Center Y" required />
            <Param name="radius" type="float" desc="Circle radius" required />
            <Param name="thickness" type="float" desc="Stroke thickness" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>draw_line</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="layer" type="string" desc="Layer name" required />
            <Param name="x1" type="float" desc="Start X" required />
            <Param name="y1" type="float" desc="Start Y" required />
            <Param name="x2" type="float" desc="End X" required />
            <Param name="y2" type="float" desc="End Y" required />
            <Param name="thickness" type="float" desc="Line thickness" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>fill_region</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="layer" type="string" desc="Layer name" required />
            <Param name="x" type="float" desc="Fill seed X" required />
            <Param name="y" type="float" desc="Fill seed Y" required />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>set_color</Code></p>
            <Param name="r" type="int 0-255" desc="Red" required />
            <Param name="g" type="int 0-255" desc="Green" required />
            <Param name="b" type="int 0-255" desc="Blue" required />
            <Param name="a" type="int 0-255" desc="Alpha (default: 255)" />
          </div>
        </div>
      </Section>
    </div>
  );
}

function AnimationTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Set keyframes and control the animation timeline. Keyframes can be on any layer property.</p>
      <Section title="Operations">
        <div className="space-y-2">
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>set_keyframe</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="layer" type="string" desc="Layer name" required />
            <Param name="frame" type="int" desc="Frame number" required />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>clear_keyframe</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="layer" type="string" desc="Layer name" required />
            <Param name="frame" type="int" desc="Frame number" required />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>set_fps</Code></p>
            <Param name="fps" type="int" desc="Frame rate (12, 24, 30)" required />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>set_frame_range</Code></p>
            <Param name="start" type="int" desc="Start frame" required />
            <Param name="end" type="int" desc="End frame" required />
          </div>
        </div>
      </Section>
      <p className="text-xs text-muted-foreground border-l-2 border-border pl-3 italic">
        Tip: For lip-sync animation, set keyframes on every frame where the mouth shape changes. Use 12 fps for a classic look or 24 fps for smooth motion.
      </p>
    </div>
  );
}

function EffectsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Apply visual effects to layers. Effects stack in order and are rendered from bottom to top.</p>
      <Section title="Operations">
        <div className="space-y-2">
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>apply</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="layer" type="string" desc="Layer name" required />
            <Param name="effect" type="enum" desc="blur, glow, shadow, tint, color_curve, levels, noise" required />
            <Param name="intensity" type="float 0-1" desc="Effect intensity (default: 0.5)" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>list</Code></p>
            <p className="text-xs text-muted-foreground">List all available effects and their parameters.</p>
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>remove</Code></p>
            <Param name="canvas" type="string" desc="Canvas name" required />
            <Param name="layer" type="string" desc="Layer name" required />
            <Param name="effect" type="enum" desc="Effect to remove" required />
          </div>
        </div>
      </Section>
      <Section title="Available Effects">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="border border-border rounded p-2"><span className="font-medium text-foreground">blur</span> — Gaussian blur</div>
          <div className="border border-border rounded p-2"><span className="font-medium text-foreground">glow</span> — Glow / bloom</div>
          <div className="border border-border rounded p-2"><span className="font-medium text-foreground">shadow</span> — Drop shadow</div>
          <div className="border border-border rounded p-2"><span className="font-medium text-foreground">tint</span> — Color tint</div>
          <div className="border border-border rounded p-2"><span className="font-medium text-foreground">color_curve</span> — Curves adjustment</div>
          <div className="border border-border rounded p-2"><span className="font-medium text-foreground">levels</span> — Level adjustment</div>
          <div className="border border-border rounded p-2"><span className="font-medium text-foreground">noise</span> — Film grain / noise</div>
        </div>
      </Section>
    </div>
  );
}

function RenderExportTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Render frame sequences and export to video or image formats.</p>
      <Section title="Operations">
        <div className="space-y-2">
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>render</Code></p>
            <Param name="output_path" type="string" desc="Output directory" required />
            <Param name="start_frame" type="int" desc="First frame" required />
            <Param name="end_frame" type="int" desc="Last frame" required />
            <Param name="resolution_x" type="int" desc="Output width (default: 1920)" />
            <Param name="resolution_y" type="int" desc="Output height (default: 1080)" />
            <Param name="fps" type="int" desc="Frame rate (default: 24)" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>export</Code></p>
            <Param name="output_path" type="string" desc="Output file path" required />
            <Param name="format" type="enum" desc="mp4, gif, mov, svg, png_sequence" />
            <Param name="fps" type="int" desc="Frame rate (default: 24)" />
            <Param name="resolution_x" type="int" desc="Output width (default: 1920)" />
            <Param name="resolution_y" type="int" desc="Output height (default: 1080)" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>export_svg</Code></p>
            <Param name="output_path" type="string" desc="SVG file path" required />
            <Param name="frame" type="int" desc="Frame number to export" />
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>status</Code></p>
            <p className="text-xs text-muted-foreground">Check render queue and progress.</p>
          </div>
        </div>
      </Section>
      <Section title="Supported Formats">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div className="border border-border rounded p-2">MP4 — H.264 video</div>
          <div className="border border-border rounded p-2">GIF — Animated GIF</div>
          <div className="border border-border rounded p-2">MOV — QuickTime</div>
          <div className="border border-border rounded p-2">SVG — Vector frame</div>
          <div className="border border-border rounded p-2">PNG Sequence</div>
        </div>
      </Section>
    </div>
  );
}

function StatusTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Server health and system status.</p>
      <Section title="Operations">
        <div className="space-y-2">
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-sm font-medium mb-1"><Code>tahoma2d_status</Code></p>
            <Param name="operation" type="enum" desc="status, help" />
            <Param name="format" type="enum" desc="text, json" />
          </div>
        </div>
      </Section>
      <div className="border border-border rounded-lg p-3 bg-card">
        <p className="text-xs text-muted-foreground">
          The status tool returns: server version, Tahoma2D availability, installed path, and bridge connection status.
          Use <Code>format="json"</Code> for structured output, <Code>format="text"</Code> for human-readable.
        </p>
      </div>
    </div>
  );
}

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  "getting-started": <GettingStartedTab />,
  "project": <ProjectTab />,
  "canvas": <CanvasTab />,
  "layers": <LayersTab />,
  "drawing": <DrawingTab />,
  "animation": <AnimationTab />,
  "effects": <EffectsTab />,
  "render-export": <RenderExportTab />,
  "status": <StatusTab />,
};

export default function Help() {
  const [activeTab, setActiveTab] = useState<TabId>("getting-started");

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold">Help & Reference</h1>
      <p className="text-sm text-muted-foreground">Tahoma2D MCP tool documentation, API reference, and animation guide</p>

      <div className="border-b border-border overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {TABS.map((t) => (
            <TabButton key={t.id} id={t.id} label={t.label} active={activeTab === t.id} onClick={setActiveTab} />
          ))}
        </div>
      </div>

      <div className="border border-border rounded-lg p-5 bg-card">
        {TAB_CONTENT[activeTab]}
      </div>
    </div>
  );
}
