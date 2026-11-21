import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { ContactInbox } from "@/components/contact-inbox";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="wordmark" href="/">AureA<span>.</span></Link>
      <p className="admin-side-label">GESTÃO DO WEBSITE</p>
      <nav><Link href="/admin">Visão geral</Link><Link className="active" href="/admin/contactos">Contactos</Link><Link href="/admin">Páginas <small>Em preparação</small></Link><Link href="/admin">Multimédia <small>Em preparação</small></Link><Link href="/admin">Definições <small>Em preparação</small></Link></nav>
      <div className="admin-sidebar-bottom"><span>{session.user.email}</span><Link href="/api/v1/admin/logout">Terminar sessão</Link></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="eyebrow">AureA CMS</p><h1>Contactos</h1></div><Link className="admin-view-site" href="/">Ver website ↗</Link></header>
      <ContactInbox />
    </section>
  </main>;
}
