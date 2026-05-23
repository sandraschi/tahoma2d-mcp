import {
  Activity,
  Clapperboard,
  Film,
  LayoutDashboard,
  Layers,
  Palette,
  Pen,
  Play,
  Settings,
  Sliders,
  Square,
  Wand2,
} from "lucide-react";
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Canvas from "./pages/canvas";
import LayersPage from "./pages/layers";
import Draw from "./pages/draw";
import Animation from "./pages/animation";
import Effects from "./pages/effects";
import Compositor from "./pages/compositor";
import Render from "./pages/render";
import Export from "./pages/export";
import Chat from "./pages/chat";
import SettingsPage from "./pages/settings";
import Help from "./pages/help";

function NavItem({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link to={to} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
    }`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
    </Link>
  );
}

function Layout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 flex items-center space-x-3 border-b border-border">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Pen className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Tahoma2D MCP</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overview</div>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/help" icon={Film} label="Help & Docs" />

          <div className="mt-6 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Create</div>
          <NavItem to="/canvas" icon={Square} label="Canvas" />
          <NavItem to="/layers" icon={Layers} label="Layers" />
          <NavItem to="/draw" icon={Wand2} label="Draw & Paint" />
          <NavItem to="/animation" icon={Play} label="Animation" />

          <div className="mt-6 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post-Production</div>
          <NavItem to="/effects" icon={Sliders} label="Effects" />
          <NavItem to="/compositor" icon={Palette} label="Compositor" />

          <div className="mt-6 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output</div>
          <NavItem to="/render" icon={Clapperboard} label="Render" />
          <NavItem to="/export" icon={Activity} label="Export" />

          <div className="mt-6 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI</div>
          <NavItem to="/chat" icon={Wand2} label="AI Assistant" />

          <div className="mt-6 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</div>
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </nav>
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Server</span>
            <span className="text-xs text-muted-foreground ml-auto">v0.1.0</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="h-16 border-b border-border flex items-center px-6 bg-card/50 backdrop-blur">
          <h2 className="text-lg font-semibold">Tahoma2D Animation Studio</h2>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/canvas" element={<Canvas />} />
            <Route path="/layers" element={<LayersPage />} />
            <Route path="/draw" element={<Draw />} />
            <Route path="/animation" element={<Animation />} />
            <Route path="/effects" element={<Effects />} />
            <Route path="/compositor" element={<Compositor />} />
            <Route path="/render" element={<Render />} />
            <Route path="/export" element={<Export />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
