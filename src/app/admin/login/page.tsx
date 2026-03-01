"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin/site";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-[var(--ink)] mb-6">Admin</h1>
        <label className="block text-sm font-medium text-[var(--ink-muted)] mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-[var(--border)] px-3 py-2 text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          autoFocus
          required
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-[var(--accent)] py-2 text-white font-medium hover:bg-[var(--accent-strong)] disabled:opacity-50"
        >
          {loading ? "…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
