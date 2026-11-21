import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return <main>
    <header className="site-header">
      <a className="wordmark" href="/">AureA<span>.</span></a>
      <nav aria-label="Navegação principal"><a href="/sobre">Sobre</a><a href="/servicos">Serviços</a><a href="/">Início</a></nav>
      <a className="header-cta" href="/">Voltar ao início <span>↗</span></a>
    </header>
    <section className="contact contact-page">
      <div className="contact-layout">
        <div className="contact-intro">
          <p className="eyebrow">Contactos</p>
          <h1>Vamos dar forma<br/>à sua próxima ideia?</h1>
          <p>Conte-nos um pouco sobre o que pretende desenvolver. A equipa AureA analisará o seu pedido e entrará em contacto.</p>
          <span className="contact-note">mMDs — MultiMedia Digital Solutions</span>
        </div>
        <ContactForm />
      </div>
    </section>
    <footer><a className="wordmark" href="/">AureA<span>.</span></a><span>mMDs — MultiMedia Digital Solutions</span></footer>
  </main>;
}
