"use client";

import { FormEvent, useRef, useState } from "react";

type FormState = { status: "idle" | "sending" | "success" | "error"; message: string };

export function ContactForm() {
  const startedAt = useRef(Date.now());
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setState({ status: "sending", message: "" });

    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          email: values.get("email"),
          subject: values.get("subject"),
          message: values.get("message"),
          website: values.get("website"),
          formStartedAt: startedAt.current,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setState({ status: "error", message: result.error ?? "Não foi possível enviar a mensagem." });
        return;
      }
      form.reset();
      setState({ status: "success", message: "Mensagem enviada. Obrigado pelo seu contacto." });
      startedAt.current = Date.now();
    } catch {
      setState({ status: "error", message: "Falha de ligação. Tente novamente." });
    }
  }

  return <form className="contact-form" onSubmit={handleSubmit}>
    <div className="form-row">
      <label>Nome<input name="name" autoComplete="name" required minLength={2} maxLength={120} /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    </div>
    <label>Assunto <span className="optional">(opcional)</span><input name="subject" maxLength={160} /></label>
    <label>Mensagem<textarea name="message" rows={5} required minLength={10} maxLength={5000} /></label>
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button className="form-submit" type="submit" disabled={state.status === "sending"}>{state.status === "sending" ? "A enviar…" : "Enviar mensagem"} <span aria-hidden="true">↗</span></button>
    <p className={`form-feedback ${state.status}`} role="status" aria-live="polite">{state.message}</p>
    <p className="form-privacy">Os dados introduzidos serão utilizados para dar resposta ao seu pedido.</p>
  </form>;
}
