import { getApiBase } from "../config";

export async function callTool(tool: string, params: Record<string, unknown> = {}) {
  try {
    const r = await fetch(`${getApiBase()}/tool`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool, params }),
    });
    if (!r.ok) return { success: false, error: `HTTP ${r.status}` };
    return await r.json();
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function getHealth() {
  try {
    const r = await fetch(`${getApiBase()}/status`);
    return r.ok ? { success: true } : { success: false, error: `HTTP ${r.status}` };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export interface AppConfig {
  tahoma2d_path: string | null;
  tahoma2d_available: boolean;
  tahoma2d_script_dir: string;
  tahoma2d_data_dir: string;
  mcp_port: number;
  mcp_host: string;
  mcp_transport: string;
  log_level: string;
}

export async function getConfig(): Promise<AppConfig> {
  const r = await fetch(`${getApiBase()}/config`);
  return r.json();
}

export async function setConfig(path: string): Promise<{ success: boolean; error?: string; tahoma2d_path?: string; tahoma2d_available?: boolean }> {
  const r = await fetch(`${getApiBase()}/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tahoma2d_path: path }),
  });
  return r.json();
}
