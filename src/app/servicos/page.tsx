const services = [
  ["01", "Desenvolvimento Web", "Conceção e desenvolvimento de websites institucionais, páginas de campanha, lojas online e plataformas digitais ajustadas às necessidades de cada projeto."],
  ["02", "Branding e Identidade", "Definição de posicionamento, identidade visual e linguagem de marca. Sistemas consistentes para comunicar com clareza em todos os pontos de contacto."],
  ["03", "Imagem e Produção Multimédia", "Produção de fotografia, vídeo e conteúdos audiovisuais para apresentar produtos, serviços, marcas e pessoas."],
  ["04", "Marketing e Publicidade", "Planeamento de comunicação, campanhas e ações de promoção digital alinhadas com os objetivos e o público de cada projeto."],
  ["05", "Personal Branding", "Construção de uma presença profissional coerente, com identidade, conteúdos e canais digitais adequados."],
  ["06", "Creator Development", "Apoio ao desenvolvimento de projetos de criadores através de imagem, conteúdos, presença digital e ferramentas próprias."],
  ["07", "SEO e Visibilidade Digital", "Estruturação e otimização de conteúdos e páginas para melhorar a descoberta e a presença nos motores de pesquisa."],
  ["08", "Gestão e Suporte Digital", "Acompanhamento técnico, manutenção, atualização e evolução das soluções digitais ao longo do tempo."],
] as const;

function Header(){return <header className="site-header"><a className="wordmark" href="/">AureA<span>.</span></a><nav aria-label="Navegação principal"><a href="/">Início</a><a href="/servicos" aria-current="page">Serviços</a><a href="/sobre">Sobre</a><a href="/contactos">Contactos</a></nav><a className="header-cta" href="/contactos">Fale connosco <span>↗</span></a></header>}
function Footer(){return <footer className="site-footer"><a className="wordmark" href="/">AureA<span>.</span></a><span>mMDs — MultiMedia Digital Solutions</span><nav aria-label="Navegação de rodapé"><a href="/">Início</a><a href="/sobre">Sobre</a><a href="/contactos">Contactos</a></nav></footer>}

export default function ServicesPage(){return <main><Header/><section className="page-hero"><p className="eyebrow">Serviços & competências</p><h1>O que é preciso<br/><span>para avançar.</span></h1><p>Competências complementares para dar forma a ideias, fortalecer marcas e desenvolver projetos no ambiente digital.</p></section><section className="services services-page"><div className="service-grid service-grid-detailed">{services.map(([number,title,description])=><article className="service" key={number}><span className="service-index">{number}</span><h2>{title}</h2><p>{description}</p></article>)}</div></section><section className="contact compact-contact"><p className="eyebrow">Tem um projeto em mente?</p><h2>Vamos conversar.</h2><a className="light-link" href="/contactos">Fale connosco <span>↗</span></a></section><Footer/></main>}
