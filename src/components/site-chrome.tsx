import Link from "next/link";

export function SiteHeader({active}:{active?:string}) {
  return <header className="site-header">
    <Link className="wordmark" href="/" aria-label="AureA — início">AureA<span>.</span><small>mMDs</small></Link>
    <nav aria-label="Navegação principal">
      <Link href="/">Início</Link>
      <Link href="/servicos">Serviços</Link>
      <Link href="/servicos/b2b" aria-current={active==="b2b"?"page":undefined}>B2B</Link>
      <Link href="/servicos/creators" aria-current={active==="creators"?"page":undefined}>Creators Economy</Link>
      <Link href="/contactos" aria-current={active==="contactos"?"page":undefined}>Contactos</Link>
    </nav>
    <Link className="header-cta" href="/contactos">Fale connosco <span>↗</span></Link>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div><Link className="wordmark" href="/">AureA<span>.</span></Link><p>mMDs — MultiMedia Digital Solutions</p></div>
    <nav aria-label="Navegação de rodapé">
      <Link href="/servicos/b2b">Serviços B2B</Link>
      <Link href="/servicos/creators">Creators Economy</Link>
      <Link href="/contactos">Contactos</Link>
      <Link href="/admin/login">Administração</Link>
    </nav>
    <small>© {new Date().getFullYear()} AureA. Todos os direitos reservados.</small>
  </footer>;
}
