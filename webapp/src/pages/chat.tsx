import { useCallback, useState } from "react";
import { callTool } from "../api/mcp";

export default function Chat() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput(`> ${input}\n`);
    try {
      const r = await callTool("tahoma2d_status", { operation: "help" });
      setOutput(prev => prev + (r.success ? String(r.data ?? r.message ?? "OK") : String(r.error ?? "Failed")));
    } finally {
      setLoading(false);
    }
  }, [input]);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">AI Assistant</h1>
      <p className="text-sm text-muted-foreground">Ask questions about animation and get help with Tahoma2D tools</p>

      <div className="flex space-x-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Tahoma2D or animation..."
          className="flex-1 px-4 py-3 bg-secondary rounded-lg text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          onKeyDown={(e) => e.key === "Enter" && send()} />
        <button disabled={loading || !input.trim()} onClick={send}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
          Send
        </button>
      </div>

      {output && <div className="border rounded-lg p-4 bg-muted/20"><pre className="text-sm font-mono whitespace-pre-wrap text-muted-foreground">{output}</pre></div>}
    </div>
  );
}
