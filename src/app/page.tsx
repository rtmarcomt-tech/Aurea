const services = [
  ["01", "Desenvolvimento Web", "Websites, plataformas e experiências digitais pensadas para objetivos concretos."],
  ["02", "Marca e Identidade", "Estratégia, posicionamento e sistemas visuais consistentes."],
  ["03", "Imagem e Multimédia", "Fotografia, vídeo e conteúdos para comunicar com clareza."],
  ["04", "Marketing Digital", "Comunicação, publicidade e visibilidade nos canais digitais."],
  ["05", "Projetos para Creators", "Identidade, conteúdos e ferramentas digitais para projetos independentes."],
  ["06", "SEO e Suporte", "Otimização, manutenção e evolução contínua da presença digital."],
] as const;

function Header() {
  return <header className="site-header">
    <a className="wordmark" href="/" aria-label="AureA — Início">AureA<span>.</span></a>
    <nav aria-label="Navegação principal">
      <a href="/">Início</a><a href="/servicos">Serviços</a><a href="/sobre">Sobre</a><a href="/contactos">Contactos</a>
    </nav>
    <a className="header-cta" href="/contactos">Fale connosco <span>↗</span></a>
  </header>;
}

function Footer() {
  return <footer className="site-footer">
    <a className="wordmark" href="/">AureA<span>.</span></a>
    <span>mMDs — MultiMedia Digital Solutions</span>
    <nav aria-label="Navegação de rodapé"><a href="/servicos">Serviços</a><a href="/sobre">Sobre</a><a href="/contactos">Contactos</a></nav>
  </footer>;
}

export default function HomePage() {
  return <main>
    <Header />
    <section className="hero">
      <p className="eyebrow">mMDs — MultiMedia Digital Solutions</p>
      <h1>Ideias com<br/><span>direção digital.</span></h1>
      <p className="hero-copy">Estratégia, criatividade e tecnologia para construir marcas, experiências e soluções digitais com propósito.</p>
      <div className="hero-actions"><a className="primary-link" href="/servicos">Explorar serviços <span>↗</span></a><a className="text-link" href="/sobre">Conhecer a AureA</a></div>
      <div className="hero-gradient" aria-hidden="true" />
      <span className="hero-side-note">ESTRATÉGIA&nbsp; / &nbsp;CRIATIVIDADE&nbsp; / &nbsp;TECNOLOGIA</span>
    </section>
    <section className="intro home-intro">
      <p className="eyebrow">Uma visão integrada</p>
      <h2>O digital não é apenas presença.<br/><span>É possibilidade.</span></h2>
      <p>AureA é a identidade digital da mMDs. Reunimos diferentes competências para acompanhar cada projeto de forma coerente — da primeira ideia à sua concretização e evolução.</p>
      <a className="inline-link" href="/sobre">Saiba mais sobre nós <span>↗</span></a>
    </section>
    <section className="services home-services">
      <div className="section-heading"><p className="eyebrow">O que fazemos</p><h2>Várias disciplinas.<br/><span>Uma direção comum.</span></h2><p>Um conjunto de soluções que pode funcionar em conjunto ou responder a necessidades específicas.</p></div>
      <div className="service-grid">{services.map(([number,title,description]) => <article className="service" key={number}><span className="service-index">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      <a className="inline-link" href="/servicos">Ver todas as áreas de atuação <span>↗</span></a>
    </section>
    <section className="contact home-contact">
      <p className="eyebrow">Vamos começar?</p><h2>O próximo passo<br/>pode começar aqui.</h2>
      <p>Partilhe connosco a sua ideia, desafio ou projeto. Estamos disponíveis para conversar.</p>
      <a className="light-link" href="/contactos">Entrar em contacto <span>↗</span></a>
    </section>
    <Footer />
  </main>;
}
