import { createRoot } from "react-dom/client";
import * as React from "react";
import App from "./App.tsx";
import "./index.css";

const RootErrorBoundary: React.ComponentType<{ children: React.ReactNode }> = class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error("App crash:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: "#fff", background: "#111", fontFamily: "system-ui, sans-serif" }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children as any;
  }
};

const rootEl = document.getElementById("root");
if (!rootEl) {
  const msg = "Root element #root not found in index.html";
  console.error(msg);
  const fallback = document.createElement("div");
  fallback.textContent = msg;
  document.body.appendChild(fallback);
} else {
  // Preload provided API key into localStorage if user shared it via prompt/session
  try {
    const providedKey = (window as any).__PROVIDED_API_KEY__ as string | undefined;
    if (providedKey && typeof providedKey === 'string') {
      window.localStorage.setItem('VITE_GOOGLE_API_KEY', providedKey);
    }
  } catch {}
  createRoot(rootEl).render(
    <React.StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </React.StrictMode>
  );
  try {
    const boot = document.getElementById('boot-status');
    if (boot) boot.remove();
  } catch {}
}
