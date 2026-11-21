"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string; name: string; email: string; subject: string | null;
  message: string; status: "NEW" | "READ" | "ARCHIVED"; receivedAt: string;
};

const labels = { NEW: "Nova", READ: "Lida", ARCHIVED: "Arquivada" };

export function ContactInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/messages", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Não foi possível carregar as mensagens.");
      setMessages(data.messages);
      setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Erro inesperado."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function updateStatus(id: string, status: Message["status"]) {
    const response = await fetch(`/api/v1/admin/messages/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Não foi possível atualizar a mensagem.");
      return;
    }
    setMessages((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setError("");
  }

  const visible = messages.filter((item) => filter === "ALL" || item.status === filter);
  const current = messages.find((item) => item.id === selected);

  return <div className="inbox">
    <div className="inbox-toolbar">
      <div><p className="eyebrow">CAIXA DE ENTRADA</p><h2>Mensagens recebidas</h2></div>
      <button type="button" onClick={() => void load()} className="inbox-refresh">Atualizar ↻</button>
    </div>
    <div className="inbox-filters">
      {[["ALL","Todas"],["NEW","Novas"],["READ","Lidas"],["ARCHIVED","Arquivadas"]].map(([value,label]) =>
        <button type="button" key={value} className={filter === value ? "selected" : ""} onClick={() => setFilter(value)}>{label}</button>
      )}
    </div>
    {error && <p className="inbox-error" role="alert">{error}</p>}
    {loading ? <p className="inbox-empty">A carregar mensagens…</p> : visible.length === 0 ? <p className="inbox-empty">Ainda não existem mensagens nesta categoria.</p> :
      <div className="inbox-list">{visible.map((item) =>
        <button type="button" key={item.id} className={`inbox-item ${selected === item.id ? "active" : ""}`} onClick={() => { setSelected(item.id); if (item.status === "NEW") void updateStatus(item.id, "READ"); }}>
          <span className="inbox-item-top"><strong>{item.name}</strong><small>{new Date(item.receivedAt).toLocaleString("pt-PT")}</small></span>
          <span className="inbox-item-subject">{item.subject || "Sem assunto"}</span>
          <span className={`inbox-status ${item.status.toLowerCase()}`}>{labels[item.status]}</span>
        </button>
      )}</div>
    }
    {current && <section className="inbox-detail">
      <div className="inbox-detail-head"><div><p className="eyebrow">MENSAGEM</p><h3>{current.subject || "Sem assunto"}</h3></div><button type="button" onClick={() => setSelected(null)} aria-label="Fechar mensagem">×</button></div>
      <p className="inbox-sender">{current.name} · <a href={`mailto:${current.email}`}>{current.email}</a></p>
      <p className="inbox-date">{new Date(current.receivedAt).toLocaleString("pt-PT")}</p>
      <p className="inbox-body">{current.message}</p>
      <div className="inbox-actions"><a href={`mailto:${current.email}?subject=${encodeURIComponent("Re: " + (current.subject || "Contacto AureA"))}`}>Responder por email ↗</a>
        {current.status !== "ARCHIVED" && <button type="button" onClick={() => void updateStatus(current.id, "ARCHIVED")}>Arquivar</button>}
        {current.status !== "NEW" && <button type="button" onClick={() => void updateStatus(current.id, "NEW")}>Marcar como nova</button>}
      </div>
    </section>}
  </div>;
}
