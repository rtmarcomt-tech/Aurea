const services = [
  ["Desenvolvimento Web", "Websites, plataformas digitais e soluções personalizadas."],
  ["Branding e Identidade", "Criação e desenvolvimento de marcas, identidades visuais e posicionamento."],
  ["Imagem e Produção Multimédia", "Fotografia, vídeo e conteúdos audiovisuais."],
  ["Marketing e Publicidade", "Estratégia, comunicação e promoção digital."],
  ["Personal Branding", "Criação e gestão de imagem e presença digital."],
  ["Creator Development", "Desenvolvimento de projetos para criadores, incluindo identidade, conteúdos e visibilidade."],
  ["SEO e Visibilidade Digital", "Otimização para motores de pesquisa e crescimento orgânico."],
  ["Gestão e Suporte Digital", "Manutenção, atualização, suporte e evolução de soluções digitais."],
] as const;

export default function HomePage() {
  return <main>
    <header className="site-header">
      <a className="wordmark" href="/">AureA<span>.</span></a>
      <nav aria-label="Navegação principal"><a href="#sobre">Sobre</a><a href="#servicos">Serviços</a><a href="#contactos">Contactos</a></nav>
      <a className="header-cta" href="#contactos">Vamos conversar <span>↗</span></a>
    </header>
    <section className="hero">
      <p className="eyebrow">mMDs — MultiMedia Digital Solutions</p>
      <h1>Soluções digitais.<br/><span>Criatividade.</span><br/>Tecnologia.</h1>
      <p className="hero-copy">Concebemos, desenvolvemos e acompanhamos soluções digitais que aproximam ideias, marcas e pessoas.</p>
      <a className="primary-link" href="#servicos">Conhecer soluções <span>↗</span></a>
      <div className="hero-gradient" aria-hidden="true" />
    </section>
    <section className="intro" id="sobre">
      <p className="eyebrow">Uma abordagem integrada</p>
      <h2>Da ideia à presença digital.<br/><span>Com intenção e consistência.</span></h2>
      <p>Aliamos tecnologia, criatividade e estratégia para construir presenças digitais sólidas — desde a identidade e produção de conteúdos ao desenvolvimento e acompanhamento de plataformas.</p>
    </section>
    <section className="services" id="servicos">
      <div className="section-heading"><p className="eyebrow">O que fazemos</p><h2>Competências que<br/>trabalham em conjunto.</h2></div>
      <div className="service-grid">{services.map(([title, description], index) => <article className="service" key={title}><span className="service-index">{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    </section>
    <section className="contact" id="contactos"><p className="eyebrow">O próximo passo começa aqui</p><h2>Vamos dar forma<br/>à sua próxima ideia?</h2><p>Entre em contacto para conversar sobre o seu projeto.</p><span className="contact-note">Os contactos serão configurados no backoffice.</span></section>
    <footer><a className="wordmark" href="/">AureA<span>.</span></a><span>mMDs — MultiMedia Digital Solutions</span></footer>
  </main>;
}
