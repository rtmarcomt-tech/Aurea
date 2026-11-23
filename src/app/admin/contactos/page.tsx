import Link from "next/link";
import {redirect} from "next/navigation";
import {getAdminSession} from "@/lib/admin-auth";
import {ContactInbox} from "@/components/contact-inbox";
import {LogoutButton} from "@/components/admin-logout";
export const dynamic="force-dynamic";
export default async function AdminContactsPage(){const session=await getAdminSession();if(!session)redirect("/admin/login");return <main className="admin-shell"><aside className="admin-sidebar"><Link className="wordmark" href="/">AureA<span>.</span></Link><p className="admin-side-label">GESTÃO DO WEBSITE</p><nav><Link href="/admin">Visão geral</Link><Link href="/admin/conteudo">Conteúdos</Link><Link className="active" href="/admin/contactos">Contactos</Link></nav><div className="admin-sidebar-bottom"><span>{session.user.email}</span><LogoutButton/></div></aside><section className="admin-main"><header className="admin-topbar"><div><p className="eyebrow">AureA CMS / ADMINISTRAÇÃO</p><h1>Contactos</h1></div><Link className="admin-view-site" href="/">Ver website ↗</Link></header><ContactInbox/></section></main>}
