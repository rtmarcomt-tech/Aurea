"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/v1/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally { setBusy(false); }
  }
  return <button className="admin-logout" type="button" onClick={logout} disabled={busy}>{busy ? "A sair…" : "Terminar sessão"}</button>;
}
