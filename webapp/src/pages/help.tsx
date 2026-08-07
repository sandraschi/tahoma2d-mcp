import { Link } from "react-router-dom";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
        {n}
      </span>
      <div className="space-y-1 pb-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="text-sm text-muted-foreground space-y-2">{children}</div>
      </div>
    </div>
  );
}

export default function Help() {
  return (
    <div className="p-6 space-y-10 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold">Help</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Install Tahoma2D, make a scene, then batch-render with this server.
        </p>
      </header>

      {/* --- What it is --- */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What is Tahoma2D?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <a href="https://tahoma2d.org" className="text-primary underline" target="_blank" rel="noreferrer">
            Tahoma2D
          </a>{" "}
          is a free 2D animation desktop app — a maintained fork of{" "}
          <a href="https://opentoonz.github.io/" className="text-primary underline" target="_blank" rel="noreferrer">
            OpenToonz
          </a>
          . You draw levels, time them on the Xsheet, and save{" "}
          <code className="text-xs bg-muted px-1 rounded">.tnz</code> scene files.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>This MCP server</strong> only batch-renders those scenes via{" "}
          <code className="text-xs bg-muted px-1 rounded">tcomposer.exe</code> and optionally builds MP4 with ffmpeg.
          You still need Tahoma2D installed to create and edit animation.
        </p>
      </section>

      <section className="border border-border rounded-lg p-5 bg-card space-y-3">
        <h2 className="text-lg font-semibold">OpenToonz, Ghibli, and Tahoma2D</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tahoma2D is not a random drawing app — it inherits a <strong>studio animation pipeline</strong> that goes back
          to commercial <strong>Toonz</strong> (Digital Video, Italy).{" "}
          <strong>Studio Ghibli</strong> adopted Toonz in the 1990s and co-developed a customized in-house version for
          traditional ink &amp; paint: scanning art, painting cels, compositing layers, camera moves on the Xsheet.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          That Ghibli-hardened line of Toonz was used on many features, including{" "}
          <em>Princess Mononoke</em>, <em>Spirited Away</em>, <em>Howl&apos;s Moving Castle</em>, and{" "}
          <em>The Tale of the Princess Kaguya</em>. In 2014, after Dwango acquired Digital Video, Ghibli supported
          open-sourcing that codebase — released as <strong>OpenToonz</strong> in 2016.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Tahoma2D</strong> is a community fork of OpenToonz: same core ideas (levels, Xsheet, schematic,{" "}
          <code className="text-xs bg-muted px-1 rounded">.tnz</code> scenes, <code className="text-xs bg-muted px-1 rounded">tcomposer</code>
          ), independent releases and fixes. This MCP renders that format; it does not replace the editor.
        </p>
        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap">{`Toonz (commercial)
  → Ghibli production version (ink & paint pipeline)
  → OpenToonz (open source, 2016)
  → Tahoma2D (fork — install this)`}</pre>
      </section>

      {/* --- Install Tahoma2D --- */}
      <section className="border border-border rounded-lg p-5 bg-card space-y-4">
        <h2 className="text-lg font-semibold">Install Tahoma2D (required)</h2>

        <Step n={1} title="Download">
          <p>
            Go to{" "}
            <a href="https://tahoma2d.org" className="text-primary underline" target="_blank" rel="noreferrer">
              tahoma2d.org
            </a>{" "}
            and download the latest <strong>Windows</strong> build (1.6+). Use the installer or portable zip.
          </p>
        </Step>

        <Step n={2} title="Install or extract">
          <p>Typical install folder:</p>
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">C:\Program Files\Tahoma2D\</pre>
          <p>Portable example:</p>
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">C:\Tahoma2D\</pre>
        </Step>

        <Step n={3} title="Verify both executables">
          <p>Same folder must contain:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <code className="text-xs">Tahoma2D.exe</code> — animation editor
            </li>
            <li>
              <code className="text-xs">tcomposer.exe</code> — headless renderer (this MCP uses it)
            </li>
          </ul>
          <p>PowerShell:</p>
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap">{`Test-Path "C:\\Program Files\\Tahoma2D\\Tahoma2D.exe"
Test-Path "C:\\Program Files\\Tahoma2D\\tcomposer.exe"
& "C:\\Program Files\\Tahoma2D\\tcomposer.exe" -version`}</pre>
        </Step>

        <Step n={4} title="Tell this server where Tahoma2D lives">
          <p>
            Auto-detection checks Program Files, LocalAppData, and{" "}
            <code className="text-xs">C:\Tahoma2D\</code>. If yours is elsewhere, open{" "}
            <Link to="/settings" className="text-primary underline">
              Settings
            </Link>{" "}
            and set the full path to <code className="text-xs">Tahoma2D.exe</code>, or set env var{" "}
            <code className="text-xs">TAHOMA2D_EXE</code> before running <code className="text-xs">.\start.ps1</code>.
          </p>
        </Step>
      </section>

      {/* --- Use Tahoma2D GUI --- */}
      <section className="border border-border rounded-lg p-5 bg-card space-y-4">
        <h2 className="text-lg font-semibold">Use Tahoma2D (make a .tnz scene)</h2>

        <Step n={1} title="Launch and pick a project folder">
          <p>
            Run <code className="text-xs">Tahoma2D.exe</code>. First run: choose an empty project directory
            (e.g. <code className="text-xs">D:\Animation\MyFilm</code>). Tahoma2D creates{" "}
            <code className="text-xs">scenes</code>, <code className="text-xs">drawings</code>, etc. underneath.
          </p>
        </Step>

        <Step n={2} title="New scene">
          <p>
            <strong>File → New Scene</strong> — set resolution and fps (e.g. 1920×1080, 24 fps).
          </p>
        </Step>

        <Step n={3} title="Create levels and draw">
          <p>
            <strong>Level → New…</strong> → Raster or Vector level. Draw in the Viewer or import art (
            <strong>File → Import</strong>).
          </p>
        </Step>

        <Step n={4} title="Xsheet timing">
          <p>
            In the <strong>Xsheet</strong>, place level frames in cells so they play across time. Extend frame
            count in the sheet header as needed.
          </p>
        </Step>

        <Step n={5} title="Preview and save">
          <p>Playback in the Viewer to check timing. Then:</p>
          <p>
            <strong>File → Save Scene</strong> → e.g.{" "}
            <code className="text-xs">D:\Animation\MyFilm\scenes\Scene01.tnz</code>
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Keep the whole project folder — the .tnz file links to drawings by relative paths.
          </p>
        </Step>
      </section>

      {/* --- MCP stack --- */}
      <section className="border border-border rounded-lg p-5 bg-card space-y-4">
        <h2 className="text-lg font-semibold">Install this MCP server</h2>

        <Step n={1} title="Prerequisites">
          <ul className="list-disc list-inside">
            <li>Python 3.12+ and uv</li>
            <li>Node.js 20+ (webapp)</li>
            <li>Tahoma2D (above)</li>
            <li>ffmpeg on PATH (only for MP4 export)</li>
          </ul>
        </Step>

        <Step n={2} title="Start the stack">
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap">{`cd D:\\Dev\\repos\\tahoma2d-mcp
uv sync
cd webapp
npm install
cd ..
.\\start.ps1`}</pre>
          <p>
            Dashboard: <code className="text-xs">http://127.0.0.1:11012</code> · Backend:{" "}
            <code className="text-xs">http://127.0.0.1:11013</code>
          </p>
        </Step>

        <Step n={3} title="ffmpeg (optional, for video)">
          <p>
            Install ffmpeg and confirm: <code className="text-xs">ffmpeg -version</code>. Use{" "}
            <Link to="/export" className="text-primary underline">
              Export
            </Link>{" "}
            or <code className="text-xs">tahoma2d_export</code> → <code className="text-xs">check_ffmpeg</code>.
          </p>
        </Step>
      </section>

      {/* --- Render workflow --- */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Batch render workflow</h2>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>
            Save <code className="text-xs">Scene.tnz</code> in Tahoma2D (GUI steps above).
          </li>
          <li>
            <Link to="/projects" className="text-primary underline">
              Projects
            </Link>{" "}
            — browse or open the scene in the GUI.
          </li>
          <li>
            <Link to="/render" className="text-primary underline">
              Render
            </Link>{" "}
            — scene path, start/end frames, output pattern e.g.{" "}
            <code className="text-xs">...\output\frame_%04d.png</code>
          </li>
          <li>
            <Link to="/export" className="text-primary underline">
              Export
            </Link>{" "}
            — same pattern → <code className="text-xs">.mp4</code> at your fps.
          </li>
        </ol>
        <div className="border border-amber-500/40 rounded-lg p-4 bg-amber-500/5 text-sm text-muted-foreground">
          This server cannot create or edit scenes from code (no working ToonzScript in 1.6.1). Author in the GUI first.
        </div>
      </section>

      {/* --- MCP tools --- */}
      <section>
        <h2 className="text-lg font-semibold mb-3">MCP tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border border-border rounded-lg p-4 bg-card">
            <code className="text-xs text-primary">tahoma2d_status</code>
            <p className="text-muted-foreground mt-2">Server health, Tahoma2D path, tcomposer version</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <code className="text-xs text-primary">tahoma2d_project</code>
            <p className="text-muted-foreground mt-2">list / info / open .tnz files</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <code className="text-xs text-primary">tahoma2d_render</code>
            <p className="text-muted-foreground mt-2">tcomposer batch frame render</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <code className="text-xs text-primary">tahoma2d_export</code>
            <p className="text-muted-foreground mt-2">ffmpeg frames → video</p>
          </div>
        </div>
      </section>

      {/* --- Troubleshooting --- */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Troubleshooting</h2>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>
            <b>tcomposer missing</b> — Reinstall Tahoma2D; both exes in one folder; fix path in{" "}
            <Link to="/settings" className="text-primary underline">
              Settings
            </Link>
            .
          </li>
          <li>
            <b>Render fails</b> — Open the .tnz in the GUI; check frame range; ensure output folder exists and is writable.
          </li>
          <li>
            <b>Blank frames</b> — Nothing exposed on the Xsheet for those frames.
          </li>
          <li>
            <b>Broken scene after move</b> — Move the entire project directory, not just the .tnz file.
          </li>
          <li>
            <b>Export fails</b> — Install ffmpeg; verify with <code className="text-xs">ffmpeg -version</code>.
          </li>
          <li>
            <b>Backend offline</b> — Run <code className="text-xs">.\start.ps1</code>; port 11013 must be listening.
          </li>
        </ul>
      </section>

      <p className="text-xs text-muted-foreground">
        Full markdown guide: <code className="text-xs">docs/TAHOMA2D_GUIDE.md</code> in the repo.
      </p>
    </div>
  );
}
