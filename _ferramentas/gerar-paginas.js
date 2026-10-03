// Gera as páginas do site MASF (menu e rodapé iguais em todas).
// ATENÇÃO: rodar "node _ferramentas/gerar-paginas.js" SOBRESCREVE os arquivos .html da raiz.
const fs = require("fs");
const OUT = require("path").join(__dirname, "..") + "/";

/* ---------------- Ícones ---------------- */
const I = {
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  phone: '<path d="M4 5c0-1 1-2 2-2h2l2 5-2.5 1.5a11 11 0 006 6L15 13l5 2v2c0 1-1 2-2 2A16 16 0 014 5z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  wa: '<path d="M20 12a8 8 0 01-11.8 7L4 20l1.1-4A8 8 0 1120 12z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
  cloche: '<path d="M3 17h18M5 17a7 7 0 0114 0M12 7V5M10 5h4M2 20h20"/>',
  truck: '<path d="M2 7h12v10H2zM14 10h4l3 3v4h-7M6 20a2 2 0 100-.1M17 20a2 2 0 100-.1"/>',
  board: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 13h4M8 16h8"/>',
  chef: '<path d="M6 13c0-3.5 2.7-6 6-6s6 2.5 6 6M4 13h16M12 7V5"/><path d="M7 17h10l-1 3H8z"/>',
  cup: '<path d="M5 10h12v4a5 5 0 01-5 5H10a5 5 0 01-5-5v-4zM17 11h1.5a2.5 2.5 0 010 5H17M9 3c0 1.5 1.5 1.5 1.5 3M13 3c0 1.5 1.5 1.5 1.5 3"/>',
  party: '<path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6"/>',
  heart: '<path d="M12 21s-7-4.4-9.3-9A5.3 5.3 0 0112 6a5.3 5.3 0 019.3 6c-2.3 4.6-9.3 9-9.3 9z"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7"/>',
  apple: '<path d="M12 7c-1-2-3-3-5-2-3 1-4 5-2 9s4 6 7 5c3 1 5-1 7-5s1-8-2-9c-2-1-4 0-5 2zM12 7c0-2 1-3 3-4"/>',
  thermo: '<path d="M10 14V5a2 2 0 014 0v9a4 4 0 11-4 0zM12 9v7"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5M16 4.5a3.5 3.5 0 010 7M18 13.7c2.4.6 4 2.9 4 6.3"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  eye: '<circle cx="12" cy="12" r="3"/><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  handshake: '<path d="M3 11l4-4 5 3 5-3 4 4-9 8z"/><path d="M8 13l3 3M11 11l3 3"/>',
  scale: '<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0zM8 21h8"/>',
  recycle: '<path d="M7 19H4l3-5M17 19h3l-3-5M9 5l3-3 3 3M12 2v6M7 14l-3 5h6M17 14l3 5h-6M8.5 9.5L12 4l3.5 5.5"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 11h6M9 15h4"/>',
  box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  factory: '<path d="M3 21V10l6 4V10l6 4V6l6 3v12zM7 17h2M12 17h2M17 17h2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  quote: '<path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
};
const ic = (n, cls = "") => `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ""}>${I[n]}</svg>`;

const WA_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1116 26.7zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.8 8.8 0 01-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.2 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5l-.6-.3z"/></svg>';

/* ---------------- Dados ---------------- */
// Seção "Liderança" (foto e nome da CEO) em Quem somos. Mude para true quando tiver nome e foto.
const SHOW_LEADER = true;

const NAV = [
  ["index.html", "Início"],
  ["sobre.html", "Quem somos"],
  ["servicos.html", "Serviços"],
  ["qualidade.html", "Qualidade"],
  ["clientes.html", "Clientes"],
  ["responsabilidade.html", "Responsabilidade"],
  ["contato.html", "Contato"],
];

const CLIENTS = [
  ["tectoy", "Tectoy"], ["transire", "Transire"], ["positron", "Positron Stoneridge"], ["inventus", "Inventus Power"],
  ["armor", "Armor IIMAK"], ["fermazon", "Fermazon"], ["livoltek", "Livoltek"], ["tema", "Tema"], ["elcoa", "Elcoa"],
  ["eternal", "Eternal"], ["mm", "MM da Amazônia"], ["callidus", "Callidus"], ["alya", "Alya"],
];

const SERVICES = [
  ["cloche", "Refeições no local", "Operamos a cozinha e o refeitório dentro da sua empresa, com equipe MASF e preparo no dia.",
    ["Equipe própria e uniformizada", "Preparo diário com insumos frescos", "Distribuição no padrão da sua empresa"]],
  ["truck", "Refeições transportadas", "Produção em cozinha própria e entrega no horário de cada turno, com controle de temperatura.",
    ["Ideal para quem não tem cozinha", "Transporte em equipamentos térmicos", "Pontualidade em todos os turnos"]],
  ["board", "Gestão de refeitórios", "Administração completa: compras, estoque, equipe, higienização, controles e relatórios.",
    ["Gestão de compras e estoque", "Controles e registros sanitários", "Relatórios periódicos ao cliente"]],
  ["chef", "Prato do Chef", "Refeição diferenciada, com preparações especiais para valorizar o momento da equipe.",
    ["Preparações especiais", "Ideal para lideranças e visitas", "Apresentação diferenciada"]],
  ["cup", "Café, lanches e ceia", "Desjejum, lanches e ceia para quem trabalha em turnos, do primeiro ao último horário.",
    ["Café da manhã completo", "Lanches intermediários", "Ceia para o turno da noite"]],
  ["party", "Eventos corporativos", "Coffee breaks, confraternizações, SIPAT e treinamentos — onde a MASF começou.",
    ["Coffee break e brunch", "Confraternizações e datas especiais", "SIPAT, treinamentos e convenções"]],
];

const CAMPAIGNS = [
  ["recycle", "Desperdício de alimentos", "Trabalhamos pela redução do desperdício gerado no refeitório, com conscientização inteligente que gera avanços no dia a dia do cliente.",
    ["Medição de sobras e resto-ingestão", "Comunicação visual no refeitório", "Ajuste contínuo de cardápio e porcionamento"]],
  ["heart", "Dia Mundial da Saúde", "Nossas nutricionistas realizam ações educativas de prevenção aos problemas causados por uma alimentação inadequada.",
    ["Ações com metodologia ilustrativa", "Orientação sobre alimentação equilibrada", "Prevenção de doenças crônicas"]],
  ["leaf", "Meio ambiente", "Campanha sobre o impacto dos resíduos no meio ambiente e as atitudes que geram mais controle e menos descarte.",
    ["Separação e destinação de resíduos", "Redução de descartáveis", "Engajamento dos colaboradores"]],
];

const FAQ = [
  ["Quais tipos de empresa a MASF atende?", "Atendemos principalmente indústrias do Distrito Industrial de Manaus e empresas de diversos segmentos na cidade, com operações de pequeno a grande porte."],
  ["Vocês atendem todos os turnos?", "Sim. Oferecemos café da manhã, almoço, jantar e ceia, acompanhando a jornada de trabalho de cada empresa."],
  ["Minha empresa não tem cozinha. É possível contratar?", "Sim. Nesse caso indicamos as refeições transportadas, produzidas em nossa cozinha e entregues no horário de cada turno."],
  ["Quem elabora o cardápio?", "Nossas nutricionistas elaboram cardápios balanceados e variados, de acordo com o perfil dos colaboradores, e o cardápio é alinhado com o cliente."],
  ["Atendem dietas especiais?", "Sim. Mediante planejamento com a nossa equipe de nutrição, oferecemos opções para restrições alimentares."],
  ["Como solicito uma proposta?", "Preencha o formulário da página de contato ou fale pelo WhatsApp. Nossa equipe agenda uma visita técnica para entender a sua necessidade."],
];

/* ---------------- Blocos comuns ---------------- */
const head = (title, desc, page) => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="theme-color" content="#782F2F">
  <link rel="canonical" href="https://masfrefeicoes.com.br/${page === "index.html" ? "" : page}">
  <link rel="icon" type="image/png" href="assets/img/favicon.png">
  <link rel="apple-touch-icon" href="assets/img/favicon.png">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:site_name" content="MASF Refeições">
  <meta property="og:url" content="https://masfrefeicoes.com.br/${page === "index.html" ? "" : page}">
  <meta property="og:image" content="https://masfrefeicoes.com.br/assets/img/og-masf.jpg">
  <meta property="og:image:secure_url" content="https://masfrefeicoes.com.br/assets/img/og-masf.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="MASF Refeições — Nutrição com qualidade. Alimentação corporativa para a indústria de Manaus.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://masfrefeicoes.com.br/assets/img/og-masf.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css?v=${VERSION}">
  <link rel="preload" as="image" href="assets/img/preloader-masf.webp">
${page === "index.html" ? "" : `  <script>try{if(sessionStorage.getItem("masf-intro"))document.documentElement.classList.add("no-intro")}catch(e){}</script>
`}
</head>
<body data-page="${page}">
  <div class="preloader" id="preloader" aria-hidden="true">
    <div class="preloader__stage">
      <img src="assets/img/preloader-masf.webp" alt="" width="1536" height="1024">
      <svg class="preloader__steam" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="preloader__steam-fade" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".18" stop-color="#fff" stop-opacity="1"/><stop offset=".7" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="preloader__steam-mask"><rect width="100" height="160" fill="url(#preloader__steam-fade)"/></mask></defs><g mask="url(#preloader__steam-mask)"><path d="M30 160 C 12 130, 48 112, 28 84 S 14 40, 34 6"/><path d="M52 160 C 70 132, 34 108, 54 80 S 70 36, 50 0"/><path d="M74 160 C 58 128, 92 110, 74 82 S 62 42, 80 10"/></g></svg>
    </div>
    <div class="preloader__bar"><span></span></div>
    <p class="preloader__text">Servir bem, para servir sempre.</p>
  </div>
`;

const brand = (extra = "") => `<a href="index.html" class="brand${extra}" aria-label="MASF Refeições — página inicial">
        <svg class="brand__steam" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="brand__steam-fade" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".18" stop-color="#fff" stop-opacity="1"/><stop offset=".7" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="brand__steam-mask"><rect width="100" height="160" fill="url(#brand__steam-fade)"/></mask></defs><g mask="url(#brand__steam-mask)"><path d="M30 160 C 12 130, 48 112, 28 84 S 14 40, 34 6"/><path d="M52 160 C 70 132, 34 108, 54 80 S 70 36, 50 0"/><path d="M74 160 C 58 128, 92 110, 74 82 S 62 42, 80 10"/></g></svg>
        <img src="assets/img/logo-masf.png" alt="MASF — Nutrição com qualidade" width="1600" height="470">
      </a>`;

const header = (page) => `  <div class="topbar">
    <div class="container topbar__inner">
      <span class="topbar__item">${ic("pin")} Atendemos o Distrito Industrial e empresas de Manaus-AM</span>
      <div class="topbar__links">
        <a href="#" data-phone-link class="topbar__item">${ic("phone")}<span data-phone-label>(92) 99136-0733</span></a>
        <a href="#" data-email-link class="topbar__item">${ic("mail")}<span data-email-label>comercial@masfrefeicoes.com.br</span></a>
        <a href="#" data-instagram-link target="_blank" rel="noopener" class="topbar__item topbar__insta" aria-label="Instagram da MASF">${ic("insta")}<span data-instagram-handle>@masfrefeicoesam</span></a>
      </div>
    </div>
  </div>

  <header class="header" id="header">
    <div class="container header__inner">
      ${brand()}
      <nav class="nav" id="nav" aria-label="Menu principal">
${NAV.slice(1).map(([href, label]) => `        <a href="${href}"${href === page ? ' class="is-active" aria-current="page"' : ""}>${label}</a>`).join("\n")}
        <a href="contato.html" class="btn btn--primary nav__cta">Solicitar proposta</a>
      </nav>
      <button class="burger" id="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
`;

const pageHero = (crumb, kicker, title, lead, img) => `
    <section class="page-hero">
      <img src="assets/img/${img}" alt="" class="page-hero__img">
      <div class="page-hero__veil"></div>
      <div class="container page-hero__inner">
        <nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a><span>/</span><span aria-current="page">${crumb}</span></nav>
        <span class="kicker kicker--light">${kicker}</span>
        <h1>${title}</h1>
        <p>${lead}</p>
      </div>
    </section>
`;

const clientRow = (list, dir) => `
      <div class="carousel${dir > 0 ? " carousel--rev" : ""}" data-carousel data-direction="${dir}">
        <div class="carousel__track" data-carousel-track>
${list.map(([f, n]) => `          <div class="carousel__item"><img src="assets/img/clientes/${f}.png" alt="${n}" loading="lazy"></div>`).join("\n")}
        </div>
      </div>`;

const clientsCarousel = (title = "Empresas que confiam na MASF", showLink = true) => `
    <section class="clients" aria-labelledby="clients-title">
      <div class="container clients__head">
        <div class="clients__intro">
          <span class="kicker reveal">Nossos clientes</span>
          <h2 class="title reveal" id="clients-title">${title}</h2>
          <p class="reveal">Indústrias do Polo Industrial e empresas de Manaus que confiam à MASF a alimentação das suas equipes, todos os dias.</p>
        </div>
        <div class="clients__stat reveal">
          <strong>+<span data-count="13">13</span></strong>
          <span>empresas parceiras<br>em Manaus-AM</span>
          ${showLink ? `<a href="clientes.html" class="link">Ver todos os clientes</a>` : ""}
        </div>
      </div>
      <div class="clients__rows">${clientRow(CLIENTS.slice(0, 7), -1)}${clientRow(CLIENTS.slice(7), 1)}
      </div>
    </section>
`;

const cta = (title = "Sua empresa merece uma alimentação de confiança.", text = "Agende uma visita técnica sem compromisso com a nossa equipe comercial.") => `
    <section class="cta">
      <div class="container cta__inner reveal">
        <div>
          <h2>${title}</h2>
          <p>${text}</p>
        </div>
        <div class="cta__actions">
          <a href="contato.html" class="btn btn--white btn--lg">Solicitar proposta</a>
          <a href="#" data-whatsapp-link target="_blank" rel="noopener" class="btn btn--ghost btn--lg">${ic("wa")} Falar no WhatsApp</a>
        </div>
      </div>
    </section>
`;

const footer = () => `  </main>

  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <a href="index.html" class="footer__brandlink" aria-label="MASF Refeições — página inicial">
          <svg class="footer__steam" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="footer__steam-fade" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".18" stop-color="#fff" stop-opacity="1"/><stop offset=".7" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="footer__steam-mask"><rect width="100" height="160" fill="url(#footer__steam-fade)"/></mask></defs><g mask="url(#footer__steam-mask)"><path d="M30 160 C 12 130, 48 112, 28 84 S 14 40, 34 6"/><path d="M52 160 C 70 132, 34 108, 54 80 S 70 36, 50 0"/><path d="M74 160 C 58 128, 92 110, 74 82 S 62 42, 80 10"/></g></svg>
          <img src="assets/img/logo-masf.png" alt="MASF — Nutrição com qualidade" class="footer__logo" loading="lazy">
        </a>
        <p>Alimentação corporativa para o Distrito Industrial e empresas de Manaus-AM desde 2004.</p>
        <div class="footer__social">
          <a href="#" data-instagram-link target="_blank" rel="noopener" aria-label="Instagram">${ic("insta")}</a>
          <a href="#" data-whatsapp-link target="_blank" rel="noopener" aria-label="WhatsApp">${ic("wa")}</a>
        </div>
      </div>
      <div>
        <h4>Institucional</h4>
        <ul>
          <li><a href="sobre.html">Quem somos</a></li>
          <li><a href="qualidade.html">Qualidade</a></li>
          <li><a href="clientes.html">Clientes</a></li>
          <li><a href="responsabilidade.html">Responsabilidade</a></li>
        </ul>
      </div>
      <div>
        <h4>Serviços</h4>
        <ul>
          <li><a href="servicos.html#refeicoes-no-local">Refeições no local</a></li>
          <li><a href="servicos.html#refeicoes-transportadas">Refeições transportadas</a></li>
          <li><a href="servicos.html#gestao-de-refeitorios">Gestão de refeitórios</a></li>
          <li><a href="servicos.html#eventos-corporativos">Eventos corporativos</a></li>
        </ul>
      </div>
      <div>
        <h4>Contato</h4>
        <ul>
          <li><span class="phone-list" data-phone-list>(92) 99136-0733</span></li>
          <li><a href="#" data-email-link><span data-email-label>comercial@masfrefeicoes.com.br</span></a></li>
          <li><span data-address-label>Rua Candelária, 200 – Armando Mendes, Manaus-AM</span></li>
        </ul>
      </div>
    </div>
    <div class="container footer__bottom">
      <span>© <span data-year>2026</span> MASF Refeições · Nutrição com qualidade. Todos os direitos reservados.</span>
      <span class="footer__credit"><span data-cnpj-label></span><span>Desenvolvido por <a href="https://www.pense.info" target="_blank" rel="noopener">www.pense.info</a></span></span>
    </div>
  </footer>

  <button type="button" class="to-top" id="to-top" aria-label="Voltar ao topo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
  <a href="#" class="wa-float" data-whatsapp-link target="_blank" rel="noopener" aria-label="Falar pelo WhatsApp">${WA_SVG}</a>

  <script src="assets/js/main.js?v=${VERSION}"></script>
</body>
</html>
`;

const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const serviceCards = (link = true) => SERVICES.map(([icon, t, d]) => `
          <${link ? `a href="servicos.html#${slug(t)}"` : "article"} class="service reveal">
            <div class="service__icon">${ic(icon)}</div>
            <h3>${t}</h3>
            <p>${d}</p>${link ? `\n            <span class="service__more">Saiba mais ${ic("arrow")}</span>` : ""}
          </${link ? "a" : "article"}>`).join("");

const faqBlock = () => `
        <div class="accordion">
${FAQ.map(([q, a], i) => `          <details class="reveal"${i === 0 ? " open" : ""}>
            <summary>${q}</summary>
            <p>${a}</p>
          </details>`).join("\n")}
        </div>`;

const steps = () => `
        <ol class="steps">
          <li class="step reveal"><span class="step__num">01</span><h3>Visita técnica</h3><p>Conhecemos a sua empresa, os turnos, o número de refeições e a estrutura disponível.</p></li>
          <li class="step reveal"><span class="step__num">02</span><h3>Proposta</h3><p>Apresentamos cardápio, modelo de serviço e investimento adequados à sua realidade.</p></li>
          <li class="step reveal"><span class="step__num">03</span><h3>Implantação</h3><p>Equipe, equipamentos e processos prontos, com transição planejada e sem interrupções.</p></li>
          <li class="step reveal"><span class="step__num">04</span><h3>Acompanhamento</h3><p>Pesquisas de satisfação, indicadores e melhoria contínua do serviço.</p></li>
        </ol>`;

/* ---------------- Vídeos ---------------- */
const VIDEOS = {
  institucional: { src: "masf-institucional", title: "Servir bem também faz parte do cardápio", tag: "Vídeo institucional", time: "0:29" },
  supervisora: { src: "masf-nutricionista", title: "Quem pensa o seu cardápio", tag: "Nossa equipe", time: "0:30" },
};
const vcard = (key, extra = "") => {
  const v = VIDEOS[key];
  return `<button type="button" class="vcard${extra}" data-video="assets/video/${v.src}.mp4" data-video-title="${v.title}" aria-label="Assistir: ${v.title}">
            <video muted loop playsinline preload="none" poster="assets/video/${v.src}.jpg" data-src="assets/video/${v.src}.mp4"></video>
            <span class="vcard__shade"></span>
            <span class="vcard__tag">${v.tag}</span>
            <span class="vcard__play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></span>
            <span class="vcard__meta"><strong>${v.title}</strong><small><svg viewBox="0 0 24 24" aria-hidden="true">${I.clock}</svg>${v.time} · clique para assistir</small></span>
          </button>`;
};

const VERSION = Date.now().toString(36);
const write = (file, html) => { fs.writeFileSync(OUT + file, html); console.log("ok", file, html.length); };

/* =====================================================================
   INÍCIO
   ===================================================================== */
write("index.html", head("MASF Refeições | Alimentação Corporativa em Manaus desde 2004",
  "MASF Refeições: alimentação corporativa para indústrias do Distrito Industrial e empresas de Manaus-AM desde 2004. Certificação ISO 9001:2015, cardápios planejados por nutricionistas e equipe própria.", "index.html") + header("index.html") + `
  <main>
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__text">
          <span class="badge reveal"><span class="badge__dot"></span>Desde 2004 alimentando a indústria de Manaus</span>
          <h1 class="hero__title reveal">Alimentação corporativa com a <span class="hl">qualidade</span> que a sua empresa exige.</h1>
          <p class="hero__lead reveal">Produzimos e servimos refeições para indústrias do Distrito Industrial e empresas de Manaus-AM, com cardápio planejado por nutricionistas, equipe própria e processos certificados ISO 9001:2015.</p>
          <div class="hero__actions reveal">
            <a href="contato.html" class="btn btn--primary btn--lg">Solicitar proposta ${ic("arrow")}</a>
            <a href="#" data-whatsapp-link target="_blank" rel="noopener" class="btn btn--outline btn--lg">${ic("wa")} Falar no WhatsApp</a>
          </div>
          <ul class="hero__checks reveal">
            <li>Café da manhã, almoço, jantar e ceia</li>
            <li>Operação em todos os turnos</li>
          </ul>
        </div>
        <div class="hero__media reveal">
          <figure class="hero__photo">
            <img src="assets/img/refeitorio-masf.jpg" alt="Linha de buffet da MASF em refeitório corporativo, com colaboradora servindo" width="2000" height="1333" fetchpriority="high">
          </figure>
          <div class="hero__card hero__card--iso">
            <span class="hero__card-icon">${ic("shield")}</span>
            <div><strong>ISO 9001:2015</strong><span>Gestão da qualidade certificada</span></div>
          </div>
          <div class="hero__card hero__card--years"><strong>+<span data-count="20">20</span></strong><span>anos de<br>mercado</span></div>
        </div>
      </div>
    </section>

    <section class="numbers" aria-label="A MASF em números">
      <div class="container numbers__grid">
        <div class="numbers__item reveal"><strong><span data-count="2004">2004</span></strong><span>Ano de fundação, em Manaus</span></div>
        <div class="numbers__item reveal"><strong>+<span data-count="20">20</span> anos</strong><span>De experiência em alimentação coletiva</span></div>
        <div class="numbers__item reveal"><strong>ISO 9001</strong><span>Sistema de gestão da qualidade certificado</span></div>
        <div class="numbers__item reveal"><strong>Solução completa</strong><span>Refeições no local, transportadas, gestão de refeitórios e eventos</span></div>
      </div>
    </section>
${clientsCarousel()}
    <section class="section videos" id="videos">
      <div class="container videos__grid">
        <div class="videos__text">
          <span class="kicker reveal">A MASF por dentro</span>
          <h2 class="title title--light reveal">Servir bem, para servir sempre.</h2>
          <p class="reveal">Veja de perto como trabalhamos: do cuidado no preparo ao atendimento, e as pessoas que pensam cada refeição servida às equipes dos nossos clientes.</p>
          <ul class="videos__list reveal">
            <li>${ic("star")}<span><strong>Qualidade</strong> em cada refeição</span></li>
            <li>${ic("heart")}<span><strong>Cuidado</strong> em cada preparo</span></li>
            <li>${ic("users")}<span><strong>Atenção</strong> em cada atendimento</span></li>
            <li>${ic("handshake")}<span><strong>Confiança</strong> em cada entrega</span></li>
          </ul>
          <a href="#" data-instagram-link target="_blank" rel="noopener" class="btn btn--ghost reveal">${ic("insta")} Siga <span data-instagram-handle>@masfrefeicoesam</span></a>
        </div>
        <div class="videos__cards">
          <div class="reveal">${vcard("institucional")}</div>
          <div class="reveal videos__offset">${vcard("supervisora")}</div>
        </div>
      </div>
    </section>

    <section class="section about">
      <div class="container about__grid">
        <div class="about__media reveal">
          <img src="assets/img/buffet-pratos.jpg" alt="Cubas do buffet MASF com frango assado, filé empanado e acompanhamentos" loading="lazy">
          <div class="about__stamp"><span>Fundada em</span><strong>21.12.2004</strong></div>
        </div>
        <div class="about__text">
          <span class="kicker reveal">Quem somos</span>
          <h2 class="title reveal">Uma empresa amazonense que cresceu servindo bem.</h2>
          <p class="reveal">A MASF Refeições nasceu em Manaus, em 2004, atendendo pequenos eventos. A forma de cuidar de cada cliente, a qualidade dos alimentos e o sabor de comida feita com dedicação abriram espaço para atender grandes empresas do Distrito Industrial.</p>
          <p class="reveal">Hoje unimos estrutura, equipe técnica e processos certificados para servir em grande escala — sem perder o sabor caseiro que é a nossa marca.</p>
          <ul class="ticks reveal">
            <li>Empresa familiar, de gestão próxima e presente</li>
            <li>Nutricionistas responsáveis por todos os cardápios</li>
            <li>Sistema de gestão da qualidade ISO 9001:2015</li>
          </ul>
          <a href="sobre.html" class="btn btn--outline reveal">Conheça nossa história ${ic("arrow")}</a>
        </div>
      </div>
    </section>

    <section class="section services">
      <div class="container">
        <div class="head">
          <div>
            <span class="kicker reveal">O que fazemos</span>
            <h2 class="title reveal">Serviço integrado de alimentação para a sua empresa.</h2>
          </div>
          <p class="head__lead reveal">Montamos a operação de acordo com o número de colaboradores, os turnos de trabalho e a estrutura disponível na sua empresa.</p>
        </div>
        <div class="services__grid">${serviceCards(true)}
        </div>
      </div>
    </section>

    <section class="section quality">
      <div class="container quality__grid">
        <div class="quality__text">
          <span class="kicker reveal">Qualidade certificada</span>
          <h2 class="title title--light reveal">Processos que garantem segurança em cada refeição.</h2>
          <p class="reveal">A MASF possui sistema de gestão da qualidade certificado pela norma ISO 9001:2015. Da compra dos insumos até a distribuição no refeitório, cada etapa é controlada e documentada.</p>
          <ul class="quality__list reveal">
            <li><strong>Nutricionistas responsáveis</strong><span>Cardápios balanceados, com rotação de pratos e acompanhamento técnico.</span></li>
            <li><strong>Boas práticas de manipulação</strong><span>Procedimentos conforme a legislação sanitária vigente (RDC 216/ANVISA).</span></li>
            <li><strong>Controle de temperatura</strong><span>Monitoramento do preparo à distribuição, garantindo segurança do alimento.</span></li>
          </ul>
          <a href="qualidade.html" class="btn btn--white reveal">Ver nosso padrão de qualidade ${ic("arrow")}</a>
        </div>
        <div class="quality__media reveal">
          <img src="assets/img/buffet-linha.jpg" alt="Linha de buffet com arroz decorado, feijão, macarrão e pratos quentes" loading="lazy">
          <div class="quality__seal">${ic("shield")}<div><strong>ISO 9001:2015</strong><span>Certificação RINA · IQNet</span></div></div>
        </div>
      </div>
    </section>

    <section class="section process">
      <div class="container">
        <div class="head head--center">
          <span class="kicker reveal">Como funciona</span>
          <h2 class="title reveal">Do primeiro contato à operação funcionando.</h2>
        </div>${steps()}
      </div>
    </section>

    <section class="section social">
      <div class="container">
        <div class="head">
          <div>
            <span class="kicker reveal">Responsabilidade</span>
            <h2 class="title reveal">Campanhas que levamos para dentro dos refeitórios.</h2>
          </div>
          <p class="head__lead reveal">Além de alimentar, promovemos ações de conscientização junto aos colaboradores dos nossos clientes. <a href="responsabilidade.html" class="link">Conheça as campanhas</a></p>
        </div>
        <div class="social__grid">
${CAMPAIGNS.map(([icon, t, d], i) => `          <article class="campaign reveal">
            <span class="campaign__icon">${ic(icon)}</span>
            <h3>${t}</h3>
            <p>${d}</p>
          </article>`).join("\n")}
        </div>
      </div>
    </section>

    <section class="gallery" aria-label="Fotos da operação MASF">
      <div class="container gallery__grid">
        <figure class="gallery__item gallery__item--wide reveal"><img src="assets/img/refeitorio-masf.jpg" alt="Refeitório atendido pela MASF" loading="lazy"></figure>
        <figure class="gallery__item reveal"><img src="assets/img/temperos.jpg" alt="Bandeja de temperos e molhos no buffet" loading="lazy"></figure>
        <figure class="gallery__item reveal"><img src="assets/img/buffet-pratos.jpg" alt="Pratos quentes servidos no buffet" loading="lazy"></figure>
        <figure class="gallery__item gallery__item--wide reveal"><img src="assets/img/buffet-linha.jpg" alt="Linha de buffet completa" loading="lazy"></figure>
      </div>
    </section>

    <section class="section faq">
      <div class="container faq__grid">
        <div>
          <span class="kicker reveal">Dúvidas frequentes</span>
          <h2 class="title reveal">Perguntas que recebemos com frequência.</h2>
          <p class="reveal">Se a sua dúvida não estiver aqui, fale com a nossa equipe comercial.</p>
          <a href="contato.html" class="btn btn--primary reveal">Falar com a equipe ${ic("arrow")}</a>
        </div>${faqBlock()}
      </div>
    </section>
${cta()}` + footer());

/* =====================================================================
   QUEM SOMOS
   ===================================================================== */
write("sobre.html", head("Quem somos | MASF Refeições", "Conheça a história da MASF Refeições, fundada em Manaus em 2004: liderança, missão, visão e valores.", "sobre.html") + header("sobre.html") + `
  <main>${pageHero("Quem somos", "Quem somos", "Mais de 20 anos alimentando quem move Manaus.", "Uma empresa amazonense, familiar e certificada, que cresceu cuidando de cada refeição como se fosse servida em casa.", "buffet-pratos.jpg")}
    <section class="section about">
      <div class="container about__grid">
        <div class="about__text">
          <span class="kicker reveal">Nossa história</span>
          <h2 class="title reveal">Começamos pequenos. Crescemos pela confiança dos nossos clientes.</h2>
          <p class="reveal">Fundada no dia 21 de dezembro de 2004, a MASF Refeições iniciou suas atividades na área de pequenos eventos ainda naquele ano. Foi se destacando pela maneira de atender seus clientes, pela boa qualidade dos alimentos e pelo gostinho único do que é feito com muito amor.</p>
          <p class="reveal">Desde então, a MASF ganhou espaço no mercado e hoje atende grandes empresas do Distrito Industrial e de Manaus, com estrutura, equipe técnica e um sistema de gestão da qualidade certificado pela norma ISO 9001:2015.</p>
          <p class="reveal">Nosso preparo é artesanal: qualidade e afeto são os principais ingredientes. Nossos profissionais garantem eficiência em produções de grande escala, sem abrir mão do sabor.</p>
        </div>
        <div class="about__media reveal">
          <img src="assets/img/refeitorio-masf.jpg" alt="Refeitório corporativo atendido pela MASF" loading="lazy">
          <div class="about__stamp"><span>Fundada em</span><strong>21.12.2004</strong></div>
        </div>
      </div>
    </section>

    <section class="section timeline-sec">
      <div class="container">
        <div class="head head--center">
          <span class="kicker reveal">Trajetória</span>
          <h2 class="title reveal">Os marcos da nossa caminhada.</h2>
        </div>
        <ol class="timeline">
          <li class="timeline__item reveal"><span class="timeline__year">2004</span><h3>Fundação</h3><p>Em 21 de dezembro nasce a MASF Refeições, em Manaus, atendendo pequenos eventos.</p></li>
          <li class="timeline__item reveal"><span class="timeline__year">Crescimento</span><h3>Chegada à indústria</h3><p>A qualidade do serviço abre as portas das empresas do Distrito Industrial de Manaus.</p></li>
          <li class="timeline__item reveal"><span class="timeline__year">Estrutura</span><h3>Operação em escala</h3><p>Equipe técnica, nutricionistas e logística própria para atender todos os turnos.</p></li>
          <li class="timeline__item reveal"><span class="timeline__year">ISO 9001</span><h3>Qualidade certificada</h3><p>Sistema de gestão da qualidade certificado pela norma ISO 9001:2015.</p></li>
          <li class="timeline__item reveal"><span class="timeline__year">Hoje</span><h3>Referência em Manaus</h3><p>Mais de 20 anos servindo grandes empresas com o sabor caseiro que é a nossa marca.</p></li>
        </ol>
      </div>
    </section>

${SHOW_LEADER ? `    <section class="section leader">
      <div class="container leader__grid">
        <figure class="leader__photo reveal">
          <img src="assets/img/ceo.webp" alt="Maristelma Silva, CEO da MASF Refeições" width="1086" height="1448" loading="lazy">
        </figure>
        <div class="leader__text">
          <span class="kicker kicker--light reveal">Liderança</span>
          <blockquote class="reveal">${ic("quote", "leader__quote")}
            <p>Cada refeição que servimos carrega o compromisso de cuidar das pessoas. É assim desde o primeiro dia — e é assim que vamos continuar crescendo junto com os nossos clientes.</p>
          </blockquote>
          <div class="leader__sign reveal">
            <strong>Maristelma Silva</strong>
            <span>CEO · MASF Refeições</span>
          </div>
        </div>
      </div>
    </section>

` : ""}    <section class="section mvv-sec">
      <div class="container">
        <div class="head head--center">
          <span class="kicker reveal">Propósito</span>
          <h2 class="title reveal">O que nos move todos os dias.</h2>
        </div>
        <div class="purpose">
          <article class="purpose__card reveal">
            <span class="purpose__icon">${ic("target")}</span>
            <h3>Missão</h3>
            <p>Oferecer alimentação segura, nutritiva e saborosa, contribuindo para a saúde, o bem-estar e a produtividade das equipes dos nossos clientes.</p>
          </article>
          <article class="purpose__card purpose__card--main reveal">
            <span class="purpose__icon">${ic("eye")}</span>
            <h3>Visão</h3>
            <p>Ser referência em alimentação corporativa no Amazonas, reconhecida pela qualidade, pela confiança e pelo cuidado com as pessoas.</p>
          </article>
          <article class="purpose__card reveal">
            <span class="purpose__icon">${ic("star")}</span>
            <h3>Compromisso</h3>
            <p>Entregar todos os dias o mesmo padrão: refeição no horário, preparada com higiene, equilíbrio nutricional e sabor caseiro.</p>
          </article>
        </div>

        <h3 class="values__title reveal">Nossos valores</h3>
        <ul class="values">
          <li class="reveal">${ic("star")}<strong>Qualidade</strong><span>Em cada insumo, processo e prato servido.</span></li>
          <li class="reveal">${ic("scale")}<strong>Ética</strong><span>Relações honestas com clientes, equipe e fornecedores.</span></li>
          <li class="reveal">${ic("eye")}<strong>Transparência</strong><span>Informação clara, controles documentados e prestação de contas.</span></li>
          <li class="reveal">${ic("users")}<strong>Respeito às pessoas</strong><span>Valorizamos quem prepara e quem é servido.</span></li>
          <li class="reveal">${ic("leaf")}<strong>Responsabilidade ambiental</strong><span>Combate ao desperdício e controle de resíduos.</span></li>
          <li class="reveal">${ic("handshake")}<strong>Comprometimento</strong><span>Parceria de longo prazo com cada cliente.</span></li>
        </ul>
      </div>
    </section>

    <section class="numbers" aria-label="A MASF em números">
      <div class="container numbers__grid">
        <div class="numbers__item reveal"><strong><span data-count="2004">2004</span></strong><span>Ano de fundação, em Manaus</span></div>
        <div class="numbers__item reveal"><strong>+<span data-count="20">20</span> anos</strong><span>De experiência em alimentação coletiva</span></div>
        <div class="numbers__item reveal"><strong>ISO 9001</strong><span>Sistema de gestão da qualidade certificado</span></div>
        <div class="numbers__item reveal"><strong>+<span data-count="13">13</span></strong><span>Empresas parceiras em Manaus</span></div>
      </div>
    </section>
${clientsCarousel()}
    <section class="gallery gallery--plain" aria-label="Fotos da operação MASF">
      <div class="container gallery__grid">
        <figure class="gallery__item gallery__item--wide reveal"><img src="assets/img/buffet-linha.jpg" alt="Linha de buffet completa" loading="lazy"></figure>
        <figure class="gallery__item reveal"><img src="assets/img/temperos.jpg" alt="Temperos e molhos no buffet" loading="lazy"></figure>
      </div>
    </section>
${cta("Venha conhecer a MASF de perto.", "Agende uma visita técnica e veja como podemos cuidar da alimentação da sua equipe.")}` + footer());

/* =====================================================================
   SERVIÇOS
   ===================================================================== */
write("servicos.html", head("Serviços | MASF Refeições", "Refeições no local, transportadas, gestão de refeitórios, Prato do Chef, café, lanches, ceia e eventos corporativos em Manaus.", "servicos.html") + header("servicos.html") + `
  <main>${pageHero("Serviços", "O que fazemos", "Soluções completas de alimentação corporativa.", "Da refeição servida na sua empresa ao evento de fim de ano: montamos a operação ideal para a sua realidade.", "buffet-linha.jpg")}
    <section class="section services">
      <div class="container">
        <div class="services__grid">${serviceCards(true)}
        </div>
      </div>
    </section>

    <section class="section video-feature">
      <div class="container video-feature__grid">
        <div class="video-feature__media reveal">${vcard("institucional", " vcard--lg")}</div>
        <div>
          <span class="kicker reveal">Veja como servimos</span>
          <h2 class="title reveal">A resposta vai muito além do que chega ao prato.</h2>
          <p class="reveal">Em 30 segundos, acompanhe um dia de operação MASF: a montagem do buffet, o cuidado no preparo, o atendimento e as refeições prontas para entrega.</p>
          <ul class="ticks reveal">
            <li>Montagem do buffet e porcionamento</li>
            <li>Preparo com boas práticas de manipulação</li>
            <li>Equipe de atendimento dedicada</li>
            <li>Refeições embaladas para entrega</li>
          </ul>
          <a href="contato.html" class="btn btn--primary reveal">Quero esse padrão na minha empresa ${ic("arrow")}</a>
        </div>
      </div>
    </section>

    <section class="section detail">
      <div class="container">
${SERVICES.map(([icon, t, d, items], i) => `        <article class="detail__row${i % 2 ? " detail__row--rev" : ""}" id="${slug(t)}">
          <figure class="detail__media reveal"><img src="assets/img/${["refeitorio-masf.jpg", "buffet-linha.jpg", "buffet-pratos.jpg", "temperos.jpg", "refeitorio-masf.jpg", "buffet-pratos.jpg"][i]}" alt="${t}" loading="lazy"><span class="detail__num">0${i + 1}</span></figure>
          <div class="detail__text">
            <span class="service__icon reveal">${ic(icon)}</span>
            <h2 class="title reveal">${t}</h2>
            <p class="reveal">${d}</p>
            <ul class="ticks reveal">
${items.map((it) => `              <li>${it}</li>`).join("\n")}
            </ul>
            <a href="contato.html?servico=${encodeURIComponent(t)}" class="btn btn--primary reveal">Solicitar proposta ${ic("arrow")}</a>
          </div>
        </article>`).join("\n")}
      </div>
    </section>

    <section class="section process">
      <div class="container">
        <div class="head head--center">
          <span class="kicker reveal">Como funciona</span>
          <h2 class="title reveal">Do primeiro contato à operação funcionando.</h2>
        </div>${steps()}
      </div>
    </section>

    <section class="section faq">
      <div class="container faq__grid">
        <div>
          <span class="kicker reveal">Dúvidas frequentes</span>
          <h2 class="title reveal">Perguntas sobre os nossos serviços.</h2>
          <p class="reveal">Se a sua dúvida não estiver aqui, fale com a nossa equipe comercial.</p>
        </div>${faqBlock()}
      </div>
    </section>
${cta("Qual serviço é ideal para a sua empresa?", "Nossa equipe faz uma visita técnica e indica o melhor modelo, sem compromisso.")}` + footer());

/* =====================================================================
   QUALIDADE
   ===================================================================== */
write("qualidade.html", head("Qualidade | MASF Refeições", "Gestão da qualidade certificada ISO 9001:2015, nutricionistas responsáveis e segurança alimentar em todas as etapas.", "qualidade.html") + header("qualidade.html") + `
  <main>${pageHero("Qualidade", "Qualidade certificada", "Segurança alimentar não é diferencial. É pré-requisito.", "Sistema de gestão da qualidade ISO 9001:2015 e controles em cada etapa, do fornecedor ao prato.", "refeitorio-masf.jpg")}
    <section class="section">
      <div class="container iso">
        <div class="iso__seal reveal">
          ${ic("shield")}
          <strong>ISO 9001:2015</strong>
          <span>Sistema de gestão da qualidade</span>
          <small>Certificação RINA · IQNet</small>
        </div>
        <div class="iso__text">
          <span class="kicker reveal">Certificação</span>
          <h2 class="title reveal">Qualidade comprovada por auditoria independente.</h2>
          <p class="reveal">A ISO 9001 é a norma internacional de gestão da qualidade. Ser certificada significa que a MASF trabalha com processos padronizados, documentados e auditados, com foco na satisfação do cliente e na melhoria contínua.</p>
          <ul class="ticks reveal">
            <li>Processos padronizados e documentados</li>
            <li>Indicadores de desempenho e satisfação</li>
            <li>Auditorias internas e externas periódicas</li>
            <li>Tratamento de não conformidades e melhoria contínua</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section chain-sec">
      <div class="container">
        <div class="head head--center">
          <span class="kicker reveal">Do fornecedor ao prato</span>
          <h2 class="title reveal">Cada etapa é controlada.</h2>
        </div>
        <ol class="chain">
          <li class="reveal"><span>${ic("handshake")}</span><h3>Fornecedores</h3><p>Seleção e avaliação de fornecedores qualificados.</p></li>
          <li class="reveal"><span>${ic("box")}</span><h3>Recebimento</h3><p>Conferência de temperatura, validade e integridade.</p></li>
          <li class="reveal"><span>${ic("clipboard")}</span><h3>Armazenamento</h3><p>Estoque organizado, identificado e com controle PVPS.</p></li>
          <li class="reveal"><span>${ic("chef")}</span><h3>Preparo</h3><p>Boas práticas de manipulação e fichas técnicas.</p></li>
          <li class="reveal"><span>${ic("thermo")}</span><h3>Distribuição</h3><p>Controle de temperatura e amostras de cada refeição.</p></li>
        </ol>
      </div>
    </section>

    <section class="section quality">
      <div class="container quality__grid">
        <div class="quality__text">
          <span class="kicker reveal">Nosso padrão</span>
          <h2 class="title title--light reveal">Pessoas e processos trabalhando juntos.</h2>
          <ul class="quality__list reveal">
            <li><strong>Nutricionistas responsáveis</strong><span>Cardápios balanceados, com rotação de pratos e acompanhamento técnico diário.</span></li>
            <li><strong>Boas práticas de manipulação</strong><span>Procedimentos conforme a legislação sanitária vigente (RDC 216/ANVISA).</span></li>
            <li><strong>Controle de temperatura</strong><span>Monitoramento do preparo à distribuição, garantindo segurança do alimento.</span></li>
            <li><strong>Equipe treinada e uniformizada</strong><span>Capacitação contínua para produção em grande escala com padrão.</span></li>
            <li><strong>Higienização documentada</strong><span>Procedimentos operacionais padronizados para ambientes, equipamentos e utensílios.</span></li>
          </ul>
        </div>
        <div class="quality__media reveal">
          <img src="assets/img/buffet-linha.jpg" alt="Linha de buffet MASF" loading="lazy">
          <div class="quality__seal">${ic("shield")}<div><strong>ISO 9001:2015</strong><span>Certificação RINA · IQNet</span></div></div>
        </div>
      </div>
    </section>

    <section class="section video-feature video-feature--rev">
      <div class="container video-feature__grid">
        <div class="video-feature__media reveal">${vcard("supervisora", " vcard--lg")}</div>
        <div>
          <span class="kicker reveal">Quem pensa o seu cardápio</span>
          <h2 class="title reveal">“Nutrição é presença. É respeito por quem consome.”</h2>
          <p class="reveal">O dia na indústria é rápido e puxado. Por isso, para a nossa equipe, a hora do almoço precisa ser mais que uma pausa: precisa ser um refúgio. Cada cardápio é pensado com empatia, para que o colaborador se sinta bem, acolhido e com energia para voltar para casa.</p>
          <p class="video-feature__sign reveal"><strong>Equipe MASF</strong> · Supervisão de cardápio e qualidade</p>
        </div>
      </div>
    </section>

    <section class="section nutri">
      <div class="container nutri__grid">
        <div>
          <span class="kicker reveal">Nutrição</span>
          <h2 class="title reveal">Cardápio pensado para quem trabalha.</h2>
          <p class="reveal">Nossas nutricionistas planejam cardápios equilibrados para a rotina de cada empresa, respeitando o paladar regional e a necessidade energética de cada turno.</p>
        </div>
        <div class="nutri__cards">
          <div class="nutri__card reveal">${ic("apple")}<h3>Equilíbrio</h3><p>Proteínas, carboidratos, legumes e saladas em todas as refeições.</p></div>
          <div class="nutri__card reveal">${ic("clock")}<h3>Rotação</h3><p>Variedade de pratos para que o cardápio nunca fique repetitivo.</p></div>
          <div class="nutri__card reveal">${ic("heart")}<h3>Dietas especiais</h3><p>Opções para restrições alimentares, mediante planejamento.</p></div>
          <div class="nutri__card reveal">${ic("chart")}<h3>Acompanhamento</h3><p>Pesquisas de satisfação e ajustes contínuos com o cliente.</p></div>
        </div>
      </div>
    </section>
${cta("Quer conhecer o nosso padrão de perto?", "Agende uma visita técnica com a nossa equipe.")}` + footer());

/* =====================================================================
   CLIENTES
   ===================================================================== */
write("clientes.html", head("Clientes | MASF Refeições", "Empresas do Distrito Industrial e de Manaus que confiam na MASF Refeições.", "clientes.html") + header("clientes.html") + `
  <main>${pageHero("Clientes", "Clientes", "Empresas que confiam na MASF todos os dias.", "Indústrias e empresas de Manaus que escolheram a MASF para cuidar da alimentação das suas equipes.", "refeitorio-masf.jpg")}
${clientsCarousel("Parceiros que fazem parte da nossa história", false)}
    <section class="section">
      <div class="container">
        <div class="head head--center">
          <span class="kicker reveal">Nossos clientes</span>
          <h2 class="title reveal">Presentes nas principais indústrias de Manaus.</h2>
        </div>
        <ul class="logo-grid">
${CLIENTS.map(([f, n]) => `          <li class="reveal"><img src="assets/img/clientes/${f}.png" alt="${n}" loading="lazy"></li>`).join("\n")}
          <li class="reveal logo-grid__cta"><a href="contato.html"><strong>Sua empresa aqui</strong><span>Solicitar proposta ${ic("arrow")}</span></a></li>
        </ul>
      </div>
    </section>

    <section class="section segments">
      <div class="container">
        <div class="head">
          <div>
            <span class="kicker reveal">Segmentos</span>
            <h2 class="title reveal">Experiência em diferentes tipos de operação.</h2>
          </div>
          <p class="head__lead reveal">Cada segmento tem a sua rotina. Adaptamos cardápio, horários e modelo de serviço a cada uma delas.</p>
        </div>
        <div class="segments__grid">
          <div class="segment reveal">${ic("factory")}<h3>Indústria eletroeletrônica</h3><p>Operações com grande volume e vários turnos no Polo Industrial.</p></div>
          <div class="segment reveal">${ic("box")}<h3>Indústria de transformação</h3><p>Plásticos, embalagens, metalurgia e componentes.</p></div>
          <div class="segment reveal">${ic("board")}<h3>Empresas e escritórios</h3><p>Refeições transportadas e serviço de refeitório para equipes administrativas.</p></div>
          <div class="segment reveal">${ic("party")}<h3>Eventos corporativos</h3><p>Coffee breaks, confraternizações, SIPAT e treinamentos.</p></div>
        </div>
      </div>
    </section>

    <section class="section why">
      <div class="container why__grid">
        <div>
          <span class="kicker kicker--light reveal">Por que a MASF</span>
          <h2 class="title title--light reveal">O que os nossos clientes encontram aqui.</h2>
        </div>
        <ul class="why__list">
          <li class="reveal">${ic("clock")}<div><strong>Pontualidade</strong><span>Refeição no horário de cada turno, todos os dias.</span></div></li>
          <li class="reveal">${ic("shield")}<div><strong>Segurança</strong><span>Processos certificados ISO 9001:2015.</span></div></li>
          <li class="reveal">${ic("heart")}<div><strong>Sabor caseiro</strong><span>Comida feita com cuidado, que a equipe aprova.</span></div></li>
          <li class="reveal">${ic("handshake")}<div><strong>Parceria</strong><span>Gestão próxima e canal direto com a direção.</span></div></li>
        </ul>
      </div>
    </section>
${cta("Sua empresa pode ser a próxima.", "Fale com a nossa equipe e receba uma proposta personalizada.")}` + footer());

/* =====================================================================
   RESPONSABILIDADE
   ===================================================================== */
write("responsabilidade.html", head("Responsabilidade | MASF Refeições", "Campanhas de combate ao desperdício, saúde e meio ambiente realizadas pela MASF Refeições nos refeitórios dos clientes.", "responsabilidade.html") + header("responsabilidade.html") + `
  <main>${pageHero("Responsabilidade", "Responsabilidade", "Alimentar bem também é cuidar das pessoas e do planeta.", "Levamos para dentro dos refeitórios campanhas de conscientização sobre desperdício, saúde e meio ambiente.", "temperos.jpg")}
    <section class="section">
      <div class="container">
${CAMPAIGNS.map(([icon, t, d, items], i) => `        <article class="campaign-row${i % 2 ? " campaign-row--rev" : ""} reveal">
          <div class="campaign-row__badge"><span>${ic(icon)}</span><strong>0${i + 1}</strong></div>
          <div>
            <h2 class="title">${t}</h2>
            <p>${d}</p>
            <ul class="ticks">
${items.map((it) => `              <li>${it}</li>`).join("\n")}
            </ul>
          </div>
        </article>`).join("\n")}
      </div>
    </section>

    <section class="section pillars-sec">
      <div class="container">
        <div class="head head--center">
          <span class="kicker reveal">Nossos compromissos</span>
          <h2 class="title reveal">Responsabilidade no dia a dia.</h2>
        </div>
        <div class="nutri__cards nutri__cards--4">
          <div class="nutri__card reveal">${ic("recycle")}<h3>Menos desperdício</h3><p>Porcionamento correto e acompanhamento das sobras.</p></div>
          <div class="nutri__card reveal">${ic("leaf")}<h3>Resíduos</h3><p>Separação e destinação adequada dos resíduos gerados.</p></div>
          <div class="nutri__card reveal">${ic("heart")}<h3>Saúde</h3><p>Educação alimentar com a equipe de nutrição.</p></div>
          <div class="nutri__card reveal">${ic("users")}<h3>Pessoas</h3><p>Treinamento e valorização dos nossos colaboradores.</p></div>
        </div>
      </div>
    </section>
${cta("Vamos levar essas campanhas para a sua empresa?", "Fale com a nossa equipe e conheça as ações que podemos realizar no seu refeitório.")}` + footer());

/* =====================================================================
   CONTATO
   ===================================================================== */
write("contato.html", head("Contato | MASF Refeições", "Solicite uma proposta de alimentação corporativa para a sua empresa em Manaus. Telefone, WhatsApp, e-mail e endereço da MASF Refeições.", "contato.html") + header("contato.html") + `
  <main>${pageHero("Contato", "Contato", "Solicite uma proposta para a sua empresa.", "Preencha o formulário ou fale direto com a nossa equipe comercial. Respondemos o mais breve possível.", "buffet-pratos.jpg")}
    <section class="section contact">
      <div class="container contact__grid">
        <div class="contact__info">
          <span class="kicker reveal">Fale conosco</span>
          <h2 class="title reveal">Estamos prontos para atender a sua empresa.</h2>
          <ul class="contact__list reveal">
            <li><span class="contact__icon">${ic("phone")}</span><div><small>Telefone / WhatsApp</small><span class="phone-list" data-phone-list>(92) 99136-0733</span></div></li>
            <li><span class="contact__icon">${ic("mail")}</span><div><small>E-mail</small><a href="#" data-email-link><span data-email-label>comercial@masfrefeicoes.com.br</span></a></div></li>
            <li><span class="contact__icon">${ic("pin")}</span><div><small>Sede operacional</small><span data-address-label>Rua Candelária, 200 – Armando Mendes, Manaus-AM</span></div></li>
            <li><span class="contact__icon">${ic("clock")}</span><div><small>Atendimento comercial</small><span>Segunda a sexta, em horário comercial</span></div></li>
          </ul>
          <a href="#" data-whatsapp-link target="_blank" rel="noopener" class="btn btn--primary btn--lg btn--block reveal">${ic("wa")} Chamar no WhatsApp</a>
        </div>

        <form class="form reveal" id="lead-form" novalidate>
          <h3>Proposta personalizada</h3>
          <p class="form__sub">Campos com * são obrigatórios.</p>
          <div class="form__row">
            <label class="field"><span>Nome *</span><input type="text" name="nome" autocomplete="name" required></label>
            <label class="field"><span>Empresa *</span><input type="text" name="empresa" autocomplete="organization" required></label>
          </div>
          <div class="form__row">
            <label class="field"><span>Telefone / WhatsApp *</span><input type="tel" name="telefone" autocomplete="tel" inputmode="tel" placeholder="(92) 90000-0000" required></label>
            <label class="field"><span>E-mail</span><input type="email" name="email" autocomplete="email"></label>
          </div>
          <div class="form__row">
            <label class="field"><span>Nº de colaboradores *</span>
              <select name="colaboradores" required>
                <option value="">Selecione</option><option>Até 50</option><option>51 a 150</option><option>151 a 500</option><option>501 a 1.000</option><option>Acima de 1.000</option>
              </select>
            </label>
            <label class="field"><span>Serviço de interesse *</span>
              <select name="servico" required>
                <option value="">Selecione</option>
${SERVICES.map(([, t]) => `                <option>${t}</option>`).join("\n")}
                <option>Preciso de orientação</option>
              </select>
            </label>
          </div>
          <fieldset class="field field--chips">
            <legend>Refeições necessárias</legend>
            <label><input type="checkbox" name="turnos" value="Café da manhã"><span>Café da manhã</span></label>
            <label><input type="checkbox" name="turnos" value="Almoço"><span>Almoço</span></label>
            <label><input type="checkbox" name="turnos" value="Jantar"><span>Jantar</span></label>
            <label><input type="checkbox" name="turnos" value="Ceia"><span>Ceia</span></label>
          </fieldset>
          <label class="field"><span>Mensagem</span><textarea name="mensagem" rows="3" placeholder="Conte um pouco sobre a sua operação (opcional)"></textarea></label>
          <input type="text" name="_honey" class="form__honey" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p class="form__error" id="form-error" role="alert" hidden>Preencha os campos obrigatórios.</p>
          <div class="form__actions">
            <button type="submit" class="btn btn--primary btn--lg btn--block" data-send="email"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg> <span data-send-label>Enviar proposta</span></button>
            <button type="submit" class="btn btn--outline btn--block" data-send="whatsapp">${ic("wa")} Prefiro enviar pelo WhatsApp</button>
          </div>
        </form>
      </div>
    </section>

    <section class="map-sec">
      <div class="container">
        <div class="map reveal">
          <iframe title="Mapa da sede da MASF Refeições" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Rua+Candel%C3%A1ria,+200+-+Armando+Mendes,+Manaus+-+AM&output=embed"></iframe>
        </div>
      </div>
    </section>

    <section class="section faq">
      <div class="container faq__grid">
        <div>
          <span class="kicker reveal">Dúvidas frequentes</span>
          <h2 class="title reveal">Antes de entrar em contato.</h2>
        </div>${faqBlock()}
      </div>
    </section>
` + footer());
