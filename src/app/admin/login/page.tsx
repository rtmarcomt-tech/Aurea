"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error ?? "Não foi possível iniciar sessão."); return; }
      router.replace("/admin");
      router.refresh();
    } catch { setError("Falha de ligação. Tente novamente."); }
    finally { setBusy(false); }
  }

  return <main className="admin-auth">
    <Link className="wordmark" href="/">AureA<span>.</span></Link>
    <section className="admin-auth-panel">
      <p className="eyebrow">Área reservada</p>
      <h1>Bem-vindo de volta.</h1>
      <p className="admin-auth-copy">Inicie sessão para gerir o website AureA.</p>
      <form onSubmit={submit}>
        <label>Email<input name="email" type="email" autoComplete="username" required /></label>
        <label>Palavra-passe<input name="password" type="password" autoComplete="current-password" required /></label>
        <button type="submit" disabled={busy}>{busy ? "A validar…" : "Iniciar sessão"} <span>↗</span></button>
        <p className="admin-auth-error" role="alert">{error}</p>
      </form>
    </section>
    <p className="admin-auth-foot">mMDs — MultiMedia Digital Solutions</p>
  </main>;
}
