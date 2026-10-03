/* =========================================================
   MASF Refeições — CONFIGURAÇÃO
   Edite aqui os dados de contato: o site inteiro é atualizado.
   ========================================================= */
const CONFIG = {
  // Números de WhatsApp/telefone. O visitante escolhe com qual quer falar.
  // number: DDI + DDD + número, só dígitos. label: nome que aparece na caixinha.
  contacts: [
    { label: "Comercial", number: "5592991360733", display: "(92) 99136-0733" },
    { label: "Atendimento", number: "5592991360793", display: "(92) 99136-0793" }
  ],
  // E-mail que recebe as propostas do formulário (envio direto, via FormSubmit)
  formEmail: "comercial@masfrefeicoes.com.br",
  email: "comercial@masfrefeicoes.com.br",
  address: "Rua Candelária, 200 – Armando Mendes, Manaus-AM",
  instagram: "https://www.instagram.com/masfrefeicoesam/",
  instagramHandle: "@masfrefeicoesam",
  cnpj: "", // ex.: "CNPJ 00.000.000/0001-00" (vazio = oculto)
  whatsappGreeting: "Olá! Vim pelo site da MASF Refeições e gostaria de solicitar uma proposta."
};

(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Dados de contato ---------- */
  const main = CONFIG.contacts[0];
  const waUrl = (text, number = main.number) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  $$("[data-whatsapp-link]").forEach((a) => (a.href = waUrl(CONFIG.whatsappGreeting)));
  $$("[data-phone-link]").forEach((a) => (a.href = `tel:+${main.number}`));
  $$("[data-phone-label]").forEach((el) => (el.textContent = main.display));
  // lista com todos os números (página de contato e rodapé)
  $$("[data-phone-list]").forEach((el) => {
    el.innerHTML = CONFIG.contacts
      .map((c) => `<a href="tel:+${c.number}"><small>${c.label}</small> ${c.display}</a>`)
      .join("");
  });

  /* ---------- Escolha de WhatsApp ----------
     Botão flutuante: passar o mouse (ou tocar) abre a caixinha com os números.
     Os outros botões "WhatsApp" do site abrem a mesma caixinha. */
  const waIcon = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1116 26.7zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.8 8.8 0 01-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.2 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5l-.6-.3z"/></svg>`;
  const chooser = document.createElement("div");
  chooser.className = "wa-chooser";
  chooser.id = "wa-chooser";
  chooser.setAttribute("role", "dialog");
  chooser.setAttribute("aria-label", "Escolha um WhatsApp da MASF");
  chooser.innerHTML = `
    <div class="wa-chooser__head">
      <span class="wa-chooser__badge">${waIcon}</span>
      <div><strong data-chooser-title>Fale com a MASF</strong><small data-chooser-sub>Escolha com quem deseja falar</small></div>
      <button type="button" class="wa-chooser__close" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="wa-chooser__list">
      ${CONFIG.contacts.map((c, i) => `
      <a class="wa-chooser__opt" data-opt="${i}" target="_blank" rel="noopener" href="${waUrl(CONFIG.whatsappGreeting, c.number)}">
        <span class="wa-chooser__ico">${waIcon}</span>
        <span class="wa-chooser__txt"><strong>${c.label}</strong><small>${c.display}</small></span>
        <svg class="wa-chooser__go" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>`).join("")}
    </div>`;
  document.body.appendChild(chooser);

  const waFloatBtn = $(".wa-float");
  let closeTimer = null;
  const setChooser = (text) => {
    $$(".wa-chooser__opt", chooser).forEach((a, i) => (a.href = waUrl(text, CONFIG.contacts[i].number)));
  };
  const openChooser = (text = CONFIG.whatsappGreeting, title, sub) => {
    clearTimeout(closeTimer);
    setChooser(text);
    $("[data-chooser-title]", chooser).textContent = title || "Fale com a MASF";
    $("[data-chooser-sub]", chooser).textContent = sub || "Escolha com quem deseja falar";
    chooser.classList.add("is-open");
    if (waFloatBtn) {
      waFloatBtn.classList.add("is-visible", "is-active");
      waFloatBtn.setAttribute("aria-expanded", "true");
    }
  };
  const closeChooser = () => {
    chooser.classList.remove("is-open");
    if (waFloatBtn) {
      waFloatBtn.classList.remove("is-active");
      waFloatBtn.setAttribute("aria-expanded", "false");
    }
    window.dispatchEvent(new Event("scroll")); // reavalia se o botão flutuante deve aparecer
  };
  const closeSoon = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeChooser, 350);
  };

  // todos os botões de WhatsApp abrem a caixinha (em vez de ir direto para um número)
  $$("[data-whatsapp-link]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (chooser.classList.contains("is-open") && a === waFloatBtn) closeChooser();
      else openChooser();
    })
  );
  if (waFloatBtn) {
    waFloatBtn.setAttribute("aria-haspopup", "dialog");
    waFloatBtn.setAttribute("aria-controls", "wa-chooser");
    if (window.matchMedia("(hover: hover)").matches) {
      waFloatBtn.addEventListener("mouseenter", () => openChooser());
      waFloatBtn.addEventListener("mouseleave", closeSoon);
      chooser.addEventListener("mouseenter", () => clearTimeout(closeTimer));
      chooser.addEventListener("mouseleave", closeSoon);
    }
  }
  $(".wa-chooser__close", chooser).addEventListener("click", closeChooser);
  $$(".wa-chooser__opt", chooser).forEach((a) => a.addEventListener("click", () => setTimeout(closeChooser, 200)));
  document.addEventListener("click", (e) => {
    if (!chooser.classList.contains("is-open")) return;
    if (chooser.contains(e.target) || e.target.closest("[data-whatsapp-link], [data-send]")) return;
    closeChooser();
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeChooser());
  $$("[data-email-link]").forEach((a) => (a.href = `mailto:${CONFIG.email}`));
  $$("[data-email-label]").forEach((el) => (el.textContent = CONFIG.email));
  $$("[data-address-label]").forEach((el) => (el.textContent = CONFIG.address));
  $$("[data-instagram-link]").forEach((a) => (a.href = CONFIG.instagram));
  $$("[data-cnpj-label]").forEach((el) => (el.textContent = CONFIG.cnpj));
  $$("[data-instagram-handle]").forEach((el) => (el.textContent = CONFIG.instagramHandle));
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Vídeos ----------
     Clique abre o vídeo grande, com som. No computador, passar o mouse
     mostra uma prévia sem som. */
  const vcards = $$("[data-video]");
  if (vcards.length) {
    const modal = document.createElement("div");
    modal.className = "vmodal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Vídeo MASF");
    modal.innerHTML = `<div class="vmodal__box">
        <button type="button" class="vmodal__close" aria-label="Fechar vídeo"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        <video controls playsinline preload="none"></video>
      </div>`;
    document.body.appendChild(modal);
    const player = $("video", modal);
    const closeBtn = $(".vmodal__close", modal);
    let lastTrigger = null;

    const openVideo = (card) => {
      lastTrigger = card;
      $$("video", document).forEach((v) => v !== player && v.pause());
      player.src = card.dataset.video;
      player.poster = $("video", card).getAttribute("poster");
      modal.setAttribute("aria-label", card.dataset.videoTitle || "Vídeo MASF");
      modal.classList.add("is-open");
      document.body.classList.add("is-locked");
      player.currentTime = 0;
      player.play().catch(() => {});
      closeBtn.focus();
    };
    const closeVideo = () => {
      if (!modal.classList.contains("is-open")) return;
      player.pause();
      modal.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      if (lastTrigger) lastTrigger.focus();
    };

    vcards.forEach((card) => {
      card.addEventListener("click", () => openVideo(card));
      const preview = $("video", card);
      const canHover = window.matchMedia("(hover: hover)").matches;
      if (canHover && preview) {
        card.addEventListener("mouseenter", () => {
          if (!preview.src) preview.src = preview.dataset.src;
          preview.play().catch(() => {});
        });
        card.addEventListener("mouseleave", () => preview.pause());
      }
    });
    closeBtn.addEventListener("click", closeVideo);
    modal.addEventListener("click", (e) => e.target === modal && closeVideo());
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeVideo());
  }

  /* ---------- Preloader ----------
     Aparece só na primeira página visitada na sessão. */
  const preloader = $("#preloader");
  if (preloader && !document.documentElement.classList.contains("no-intro")) {
    const MIN_TIME = 3500; // tempo mínimo na tela (ms) — aumente para deixar mais tempo
    const start = performance.now();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      preloader.classList.add("is-done");
      document.documentElement.classList.add("intro-done");
      try { sessionStorage.setItem("masf-intro", "1"); } catch (e) {}
      setTimeout(() => preloader.remove(), 900);
    };
    const whenReady = () => setTimeout(finish, Math.max(0, MIN_TIME - (performance.now() - start)));
    if (document.readyState === "complete") whenReady();
    else window.addEventListener("load", whenReady);
    setTimeout(finish, 8000); // segurança se alguma imagem demorar
  } else if (preloader) {
    preloader.remove();
  }

  /* ---------- Header + WhatsApp flutuante ---------- */
  const header = $("#header");
  const waFloat = $(".wa-float");
  const toTop = $("#to-top");
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 50);
    if (waFloat) waFloat.classList.toggle("is-visible", y > 480 || waFloat.classList.contains("is-active"));
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const burger = $("#burger");
  const nav = $("#nav");
  const setMenu = (open) => {
    document.documentElement.style.setProperty("--nav-top", `${header.getBoundingClientRect().bottom}px`);
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("is-locked", open);
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  window.addEventListener("resize", () => window.innerWidth > 980 && setMenu(false));

  /* ---------- Carrossel de clientes ----------
     Movimento contínuo; para com o mouse em cima (ou dedo no celular)
     e volta a andar quando sai. Também dá para arrastar. */
  $$("[data-carousel]").forEach((carousel) => {
    const track = $("[data-carousel-track]", carousel);
    const original = [...track.children];
    // duplica os logos até preencher 2x a largura da tela (loop infinito sem emenda)
    const fill = () => {
      while (track.scrollWidth < carousel.offsetWidth * 2 + 400) original.forEach((n) => {
        const clone = n.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
    };
    fill();

    const SPEED = 40; // pixels por segundo
    const DIR = Number(carousel.dataset.direction) > 0 ? 1 : -1; // -1 = para a esquerda, 1 = para a direita
    let offset = 0;
    let paused = false;
    let dragging = false;
    let dragX = 0;
    let last = performance.now();
    const loopWidth = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return original.reduce((w, n) => w + n.offsetWidth + gap, 0);
    };
    let width = loopWidth();

    const frame = (now) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      if (!paused && !dragging) offset += DIR * SPEED * dt;
      if (offset <= -width) offset += width;
      if (offset > 0) offset -= width;
      track.style.transform = `translate3d(${offset}px,0,0)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    carousel.addEventListener("mouseenter", () => (paused = true));
    carousel.addEventListener("mouseleave", () => (paused = false));

    carousel.addEventListener("pointerdown", (e) => {
      dragging = true;
      dragX = e.clientX;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture(e.pointerId);
    });
    carousel.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      offset += e.clientX - dragX;
      dragX = e.clientX;
    });
    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      carousel.classList.remove("is-dragging");
      if (e.pointerType !== "mouse") paused = false;
    };
    carousel.addEventListener("pointerup", endDrag);
    carousel.addEventListener("pointercancel", endDrag);

    window.addEventListener("resize", () => {
      fill();
      width = loopWidth();
    });
    window.addEventListener("load", () => (width = loopWidth()));
  });

  /* ---------- Animações de entrada ---------- */
  const reveals = $$(".reveal");
  const groups = new Map();
  reveals.forEach((el) => {
    const i = groups.get(el.parentElement) || 0;
    el.style.setProperty("--d", `${Math.min(i * 0.08, 0.4)}s`);
    groups.set(el.parentElement, i + 1);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Contadores ---------- */
  if (!reduceMotion) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const start = target > 1000 ? target - 30 : 0;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1600, 1);
        el.textContent = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        }),
      { threshold: 0.6 }
    );
    $$("[data-count]").forEach((el) => co.observe(el));
  }

  /* ---------- FAQ: um aberto por vez ---------- */
  const details = $$(".accordion details");
  details.forEach((d) =>
    d.addEventListener("toggle", () => {
      if (d.open) details.forEach((o) => o !== d && (o.open = false));
    })
  );

  /* ---------- Formulário de proposta ---------- */
  const form = $("#lead-form");
  if (form) {
    const errorBox = $("#form-error");
    const phoneInput = form.elements.telefone;

    // Máscara (92) 99999-9999
    phoneInput.addEventListener("input", () => {
      const d = phoneInput.value.replace(/\D/g, "").slice(0, 11);
      let out = d;
      if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
      phoneInput.value = out;
    });

    // serviço vindo da página de Serviços (contato.html?servico=...)
    const pre = new URLSearchParams(location.search).get("servico");
    if (pre && [...form.elements.servico.options].some((o) => o.value === pre)) form.elements.servico.value = pre;

    let channel = "whatsapp";
    $$("[data-send]", form).forEach((b) => b.addEventListener("click", () => (channel = b.dataset.send)));

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let valid = true;
      $$("[required]", form).forEach((field) => {
        const ok = field.value.trim() !== "" && (field.name !== "telefone" || field.value.replace(/\D/g, "").length >= 10);
        field.closest(".field").classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });
      errorBox.hidden = valid;
      if (!valid) {
        errorBox.textContent = "Preencha os campos obrigatórios.";
        const first = $(".is-invalid input, .is-invalid select", form);
        if (first) first.focus();
        return;
      }

      const f = form.elements;
      const turnos = $$('input[name="turnos"]:checked', form).map((c) => c.value).join(", ") || "Não informado";
      const lines = [
        "*Solicitação de proposta — site MASF*",
        "",
        `*Nome:* ${f.nome.value.trim()}`,
        `*Empresa:* ${f.empresa.value.trim()}`,
        `*Telefone:* ${f.telefone.value.trim()}`,
        f.email.value.trim() ? `*E-mail:* ${f.email.value.trim()}` : null,
        `*Colaboradores:* ${f.colaboradores.value}`,
        `*Serviço:* ${f.servico.value}`,
        `*Refeições:* ${turnos}`,
        f.mensagem.value.trim() ? `*Mensagem:* ${f.mensagem.value.trim()}` : null
      ].filter((l) => l !== null);

      if (channel === "whatsapp") {
        openChooser(lines.join("\n"), "Enviar proposta pelo WhatsApp", "Escolha para qual número enviar");
        return;
      }

      // Envio direto para o e-mail da MASF (FormSubmit)
      if (f._honey && f._honey.value) return; // robô preencheu o campo invisível
      const sendBtn = $('[data-send="email"]', form);
      const label = $("[data-send-label]", form);
      sendBtn.disabled = true;
      sendBtn.classList.add("is-loading");
      label.textContent = "Enviando...";
      fetch(`https://formsubmit.co/ajax/${CONFIG.formEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Nova proposta pelo site — ${f.empresa.value.trim()}`,
          _template: "table",
          _captcha: "false",
          Nome: f.nome.value.trim(),
          Empresa: f.empresa.value.trim(),
          Telefone: f.telefone.value.trim(),
          "E-mail": f.email.value.trim() || "Não informado",
          Colaboradores: f.colaboradores.value,
          "Serviço de interesse": f.servico.value,
          "Refeições necessárias": turnos,
          Mensagem: f.mensagem.value.trim() || "—",
          _replyto: f.email.value.trim() || undefined
        })
      })
        .then((r) => r.json().catch(() => ({})).then((data) => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
          if (!ok || String(data.success) !== "true") throw new Error(data.message || "Falha no envio");
          form.classList.add("is-sent");
          form.innerHTML = `
            <div class="form__done" role="status">
              <span class="form__done-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></span>
              <h3>Proposta enviada!</h3>
              <p>Obrigado, ${f.nome.value.trim().split(" ")[0]}. Recebemos os dados da <strong>${f.empresa.value.trim()}</strong> e nossa equipe comercial entrará em contato em breve.</p>
              <a href="index.html" class="btn btn--outline">Voltar ao início</a>
            </div>`;
          form.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch(() => {
          sendBtn.disabled = false;
          sendBtn.classList.remove("is-loading");
          label.textContent = "Enviar proposta";
          errorBox.hidden = false;
          errorBox.innerHTML = 'Não conseguimos enviar agora. Tente novamente ou <button type="button" class="form__fallback">envie pelo WhatsApp</button>.';
          $(".form__fallback", errorBox).addEventListener("click", () =>
            openChooser(lines.join("\n"), "Enviar proposta pelo WhatsApp", "Escolha para qual número enviar")
          );
        });
    });

    $$("input, select", form).forEach((el) =>
      el.addEventListener("input", () => {
        const field = el.closest(".field");
        if (field) field.classList.remove("is-invalid");
      })
    );
  }
})();
