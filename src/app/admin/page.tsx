import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/admin-logout";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [newMessages, totalMessages, pageCount, mediaCount] = await Promise.all([
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.page.count(),
    prisma.mediaAsset.count(),
  ]);

  const metrics = [
    ["Novas mensagens", newMessages, "Pedidos por responder"],
    ["Mensagens recebidas", totalMessages, "Histórico de contactos"],
    ["Páginas", pageCount, "Conteúdo estruturado"],
    ["Ficheiros", mediaCount, "Biblioteca multimédia"],
  ] as const;

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="wordmark" href="/">AureA<span>.</span></Link>
      <p className="admin-side-label">GESTÃO DO WEBSITE</p>
      <nav><Link className="active" href="/admin">Visão geral</Link><Link href="/admin">Páginas <small>Em preparação</small></Link><Link href="/admin/contactos">Contactos</Link><Link href="/admin">Multimédia <small>Em preparação</small></Link><Link href="/admin">Definições <small>Em preparação</small></Link></nav>
      <div className="admin-sidebar-bottom"><span>{session.user.email}</span><LogoutButton /></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="eyebrow">AureA CMS</p><h1>Visão geral</h1></div><Link className="admin-view-site" href="/">Ver website ↗</Link></header>
      <div className="admin-welcome"><p className="eyebrow">PAINEL DE CONTROLO</p><h2>Bom trabalho começa com clareza.</h2><p>Esta é a área de gestão do seu website. As ferramentas serão disponibilizadas progressivamente.</p></div>
      <div className="admin-metrics">{metrics.map(([label,value,description])=><article key={label}><span>{label}</span><strong>{value}</strong><small>{description}</small></article>)}</div>
      <section className="admin-next"><p className="eyebrow">PRÓXIMAS FERRAMENTAS</p><h2>Gestão centralizada.</h2><p>O acesso administrativo está protegido por sessão individual. A edição de páginas, gestão de ficheiros e caixa de entrada serão ativadas após os respetivos fluxos e testes.</p></section>
    </section>
  </main>;
}
