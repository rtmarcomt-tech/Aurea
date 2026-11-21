import Link from "next/link";
import { ContactForm } from "@/components/contact-form";

function Header(){return <header className="site-header"><Link className="wordmark" href="/">AureA<span>.</span></Link><nav aria-label="Navegação principal"><Link href="/">Início</Link><Link href="/servicos">Serviços</Link><Link href="/sobre">Sobre</Link><Link href="/contactos" aria-current="page">Contactos</Link></nav><Link className="header-cta" href="/">Voltar ao início <span>↗</span></Link></header>}
function Footer(){return <footer className="site-footer"><Link className="wordmark" href="/">AureA<span>.</span></Link><span>mMDs — MultiMedia Digital Solutions</span><nav aria-label="Navegação de rodapé"><Link href="/">Início</Link><Link href="/servicos">Serviços</Link><Link href="/sobre">Sobre</Link></nav></footer>}

export default function ContactPage(){return <main><Header/><section className="contact contact-page"><div className="contact-layout"><div className="contact-intro"><p className="eyebrow">Contactos</p><h1>Vamos dar forma<br/>à sua próxima ideia?</h1><p>Conte-nos um pouco sobre o que pretende desenvolver. Explique-nos o seu desafio e entraremos em contacto para perceber como podemos ajudar.</p><span className="contact-note">mMDs — MultiMedia Digital Solutions</span></div><ContactForm/></div></section><Footer/></main>}
