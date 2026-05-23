const API_BASE = "/mcp";

export async function callTool(tool: string, params: Record<string, unknown> = {}) {
  try {
    const r = await fetch(`${API_BASE}/tool`, {
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
    const r = await fetch("/api/status");
    return r.ok ? { success: true } : { success: false, error: `HTTP ${r.status}` };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Network error" };
  }
}
