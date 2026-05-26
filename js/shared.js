// URL helpers
function getParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    country: p.get("country") || null,
    docType: p.get("docType") || null,
    purpose: p.get("purpose") || null,
    location: p.get("location") || null,
    step: parseInt(p.get("step"), 10) || 1,
  };
}

function buildQuery(state) {
  const p = new URLSearchParams();
  Object.keys(state).forEach(k => {
    if (state[k] !== null && state[k] !== undefined && state[k] !== "") {
      p.set(k, state[k]);
    }
  });
  return p.toString();
}

// Header rendering — minimal variant for configurator
function renderHeader(opts) {
  opts = opts || {};
  const header = document.querySelector("[data-header]");
  if (!header) return;

  if (opts.minimal) {
    header.classList.add("site-header--minimal");
    header.innerHTML = `
      <div class="container site-header__inner">
        <a href="index.html" class="site-logo">Legalisering<span class="logo-dot">.se</span></a>
        <a href="index.html" class="cancel-link">Avbryt och gå tillbaka</a>
      </div>
    `;
    return;
  }

  header.innerHTML = `
    <div class="container site-header__inner">
      <a href="index.html" class="site-logo">Legalisering<span class="logo-dot">.se</span></a>
      <nav class="site-nav" aria-label="Huvudnavigation">
        <a href="index.html#privat">Privat</a>
        <a href="index.html#foretag">Företag</a>
        <a href="index.html#drop-in">Drop-in Stockholm</a>
        <a href="index.html#om">Om oss</a>
        <a href="index.html#kontakt">Kontakt</a>
        <a href="configurator.html" class="btn-primary">Vad behöver du legalisera?</a>
        <select class="lang-select" aria-label="Språk">
          <option>SV</option>
          <option>EN</option>
          <option>NO</option>
        </select>
      </nav>
      <button class="menu-toggle" aria-label="Öppna meny" aria-expanded="false" aria-controls="mobile-menu">
        <span class="menu-toggle__bars" aria-hidden="true"></span>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu" role="menu">
      <a href="configurator.html" class="btn-primary">Vad behöver du legalisera?</a>
      <ul>
        <li><a href="index.html#privat">Privat</a></li>
        <li><a href="index.html#foretag">Företag</a></li>
        <li><a href="index.html#drop-in">Drop-in Stockholm</a></li>
        <li><a href="index.html#om">Om oss</a></li>
        <li><a href="index.html#kontakt">Kontakt</a></li>
      </ul>
    </div>
  `;

  const toggle = header.querySelector(".menu-toggle");
  const menu = header.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
}

function renderFooter() {
  const footer = document.querySelector("[data-footer]");
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="site-footer__cols">
        <div>
          <h4>Kontakt</h4>
          <p>Kungsgatan 37, 4:e våningen<br>111 56 Stockholm</p>
          <p>+46 (0)8-5333 2080</p>
          <p>kontakt@legalisering.se</p>
          <p>Öppet: 9–16, mån–fre</p>
        </div>
        <div>
          <h4>Snabblänkar</h4>
          <ul>
            <li><a href="#">Apostille</a></li>
            <li><a href="#">Notarisering</a></li>
            <li><a href="#">Översättning</a></li>
            <li><a href="#">UD-legalisering</a></li>
            <li><a href="#">Ambassadlegalisering</a></li>
            <li><a href="index.html#drop-in">Drop-in Stockholm</a></li>
          </ul>
        </div>
        <div>
          <h4>Om oss</h4>
          <ul>
            <li><a href="#">Om Notarius Publicus</a></li>
            <li><a href="#">Företagskunder</a></li>
            <li><a href="#">Köpvillkor</a></li>
            <li><a href="#">Integritetspolicy</a></li>
          </ul>
        </div>
      </div>
      <div class="site-footer__bottom">
        <p>© 2026 Legalisering.se</p>
        <label class="annotation-toggle">
          <input type="checkbox" id="annotation-toggle">
          Visa anteckningar
        </label>
      </div>
    </div>
  `;

  const toggle = footer.querySelector("#annotation-toggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      document.body.classList.toggle("show-annotations", toggle.checked);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.querySelector("[data-header]");
  const minimal = headerEl && headerEl.hasAttribute("data-header-minimal");
  renderHeader({ minimal });
  renderFooter();
});
