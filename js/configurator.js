const state = {
  country: null,
  docType: null,
  purpose: null,
  location: null,
  step: 1,
};

const STEP_TITLES = [
  "1. Land",
  "2. Dokument",
  "3. Syfte",
  "4. Var är du?",
];

function syncStateToUrl(push) {
  const params = new URLSearchParams();
  if (state.country) params.set("country", state.country);
  if (state.docType) params.set("docType", state.docType);
  if (state.purpose) params.set("purpose", state.purpose);
  if (state.location) params.set("location", state.location);
  params.set("step", String(state.step));
  const url = "configurator.html?" + params.toString();
  if (push) {
    history.pushState({ ...state }, "", url);
  } else {
    history.replaceState({ ...state }, "", url);
  }
}

function loadStateFromUrl() {
  const p = getParams();
  state.country = p.country;
  state.docType = p.docType;
  state.purpose = p.purpose;
  state.location = p.location;
  state.step = Math.max(1, Math.min(4, p.step || 1));
  // Guard: don't advance past a step whose prerequisite is missing
  if (state.step >= 2 && !state.country) state.step = 1;
  if (state.step >= 3 && !state.docType) state.step = 2;
  if (state.step >= 4 && !state.purpose) state.step = 3;
}

function renderProgressBar() {
  const bar = document.querySelector("[data-progress]");
  if (!bar) return;
  bar.innerHTML = "";
  STEP_TITLES.forEach((label, idx) => {
    const stepNum = idx + 1;
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "progress-step";
    btn.type = "button";
    btn.textContent = label;
    if (stepNum === state.step) {
      btn.classList.add("is-active");
      btn.setAttribute("aria-current", "step");
    } else if (stepNum < state.step) {
      btn.classList.add("is-complete");
    }
    btn.disabled = stepNum >= state.step;
    btn.addEventListener("click", () => {
      if (stepNum < state.step) goToStep(stepNum);
    });
    li.appendChild(btn);
    bar.appendChild(li);
  });
}

function goToStep(n, opts) {
  opts = opts || {};
  state.step = n;
  if (opts.replace) {
    syncStateToUrl(false);
  } else {
    syncStateToUrl(true);
  }
  render();
}

function render() {
  renderProgressBar();
  const root = document.querySelector("[data-step-root]");
  if (!root) return;
  root.innerHTML = "";

  let panel;
  if (state.step === 1) panel = renderStep1();
  else if (state.step === 2) panel = renderStep2();
  else if (state.step === 3) panel = renderStep3();
  else if (state.step === 4) panel = renderStep4();

  if (panel) {
    panel.classList.add("step-panel");
    root.appendChild(panel);
    const heading = panel.querySelector("h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: false });
    }
  }
}

// Step 1: Country
function renderStep1() {
  const wrap = document.createElement("section");
  wrap.innerHTML = `
    <h2>Vart ska dokumentet användas?</h2>
    <p class="lead">Det avgör vilken typ av legalisering som krävs.</p>
    <input type="text" class="country-search" placeholder="Sök land..." aria-label="Sök land" data-search>
    <h3 class="country-list-title">Vanliga länder</h3>
    <div class="country-grid" data-popular></div>
    <h3 class="country-list-title">Alla länder</h3>
    <ul class="country-list" data-all></ul>
    <button class="help-link" type="button" data-help>Jag vet inte vart dokumentet ska</button>
    <dialog data-help-dialog>
      <button class="close-x" type="button" data-help-close aria-label="Stäng">×</button>
      <h3>Vi hjälper dig manuellt</h3>
      <p>Då hjälper vi dig via telefon. Ring oss på 08-5333 2080 eller skicka ett meddelande nedan.</p>
      <form data-help-form>
        <div class="field"><label for="hn">Namn</label><input type="text" id="hn" required></div>
        <div class="field"><label for="he">E-post</label><input type="email" id="he" required></div>
        <div class="field"><label for="hm">Meddelande</label><textarea id="hm" required></textarea></div>
        <div class="dialog-actions">
          <button type="button" class="btn-tertiary" data-help-close>Avbryt</button>
          <button type="submit" class="btn-primary">Skicka</button>
        </div>
      </form>
    </dialog>
  `;

  const popular = wrap.querySelector("[data-popular]");
  const all = wrap.querySelector("[data-all]");
  const search = wrap.querySelector("[data-search]");

  const popularCountries = COUNTRIES.filter(c => c.popular);
  popularCountries.forEach(c => popular.appendChild(makeCountryCard(c)));

  function renderAllList(query) {
    all.innerHTML = "";
    const q = (query || "").toLowerCase().trim();
    const items = COUNTRIES
      .filter(c => !q || c.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, "sv"));
    items.forEach(c => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.innerHTML = `<span class="country-flag">${c.flag}</span> ${c.name}`;
      btn.addEventListener("click", () => pickCountry(c.code));
      li.appendChild(btn);
      all.appendChild(li);
    });
    if (items.length === 0) {
      const li = document.createElement("li");
      li.style.padding = "12px 0";
      li.style.color = "var(--color-text-muted)";
      li.textContent = "Inga länder matchar sökningen.";
      all.appendChild(li);
    }
  }
  renderAllList("");

  search.addEventListener("input", e => renderAllList(e.target.value));

  // Help dialog
  const dialog = wrap.querySelector("[data-help-dialog]");
  wrap.querySelector("[data-help]").addEventListener("click", () => {
    if (typeof dialog.showModal === "function") dialog.showModal();
  });
  wrap.querySelectorAll("[data-help-close]").forEach(b => b.addEventListener("click", () => dialog.close()));
  wrap.querySelector("[data-help-form]").addEventListener("submit", (e) => {
    e.preventDefault();
    dialog.close();
    alert("Tack! Vi kontaktar dig inom 4 arbetstimmar.");
  });

  return wrap;
}

function makeCountryCard(c) {
  const btn = document.createElement("button");
  btn.className = "country-card";
  btn.type = "button";
  btn.innerHTML = `<span class="country-flag">${c.flag}</span><span>${c.name}</span>`;
  btn.addEventListener("click", () => pickCountry(c.code));
  return btn;
}

function pickCountry(code) {
  state.country = code;
  goToStep(2);
}

// Step 2: Doc type
function renderStep2() {
  const wrap = document.createElement("section");
  wrap.innerHTML = `
    <h2>Vilken typ av dokument?</h2>
    <p class="lead">Välj den kategori som passar bäst. Vi guidar dig vidare i nästa steg.</p>
    <div class="doc-type-grid" data-grid></div>
    <div class="other-input" data-other-input style="display:none">
      <div class="field">
        <label for="otherDocText">Beskriv ditt dokument</label>
        <input type="text" id="otherDocText" placeholder="T.ex. fullmakt för fastighetsköp">
      </div>
    </div>
    <div class="step-actions">
      <button type="button" class="btn-back" data-back>← Tillbaka</button>
      <button type="button" class="btn-primary" data-next disabled>Nästa</button>
    </div>
  `;

  const grid = wrap.querySelector("[data-grid]");
  const otherWrap = wrap.querySelector("[data-other-input]");
  const nextBtn = wrap.querySelector("[data-next]");

  DOCUMENT_TYPES.forEach(d => {
    const btn = document.createElement("button");
    btn.className = "doc-type-card";
    btn.type = "button";
    if (state.docType === d.id) btn.classList.add("selected");
    btn.innerHTML = `<h3>${d.name}</h3><p>${d.description}</p>`;
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".doc-type-card").forEach(c => c.classList.remove("selected"));
      btn.classList.add("selected");
      state.docType = d.id;
      otherWrap.style.display = d.id === "other" ? "block" : "none";
      nextBtn.disabled = false;
    });
    grid.appendChild(btn);
  });

  if (state.docType === "other") otherWrap.style.display = "block";
  if (state.docType) nextBtn.disabled = false;

  wrap.querySelector("[data-back]").addEventListener("click", () => goToStep(1));
  nextBtn.addEventListener("click", () => {
    if (!state.docType) return;
    // Reset purpose when docType changed and current purpose not in new list
    const validPurposes = (PURPOSES[state.docType] || []).map(p => p.id);
    if (state.purpose && !validPurposes.includes(state.purpose)) {
      state.purpose = null;
    }
    goToStep(3);
  });

  return wrap;
}

// Step 3: Purpose
function renderStep3() {
  const wrap = document.createElement("section");
  const purposeList = PURPOSES[state.docType] || PURPOSES.civil;

  wrap.innerHTML = `
    <h2>Vad ska du använda dokumentet till?</h2>
    <p class="lead">Det här hjälper oss att rekommendera rätt kedja och fånga upp vanliga fallgropar.</p>
    <div class="purpose-grid" data-grid></div>
    <div class="other-input" data-other-input style="display:none">
      <div class="field">
        <label for="otherPurposeText">Beskriv syftet</label>
        <input type="text" id="otherPurposeText" placeholder="T.ex. anställning vid utländsk myndighet">
      </div>
    </div>
    <div class="step-actions">
      <button type="button" class="btn-back" data-back>← Tillbaka</button>
      <button type="button" class="btn-primary" data-next disabled>Nästa</button>
    </div>
  `;

  const grid = wrap.querySelector("[data-grid]");
  const otherWrap = wrap.querySelector("[data-other-input]");
  const nextBtn = wrap.querySelector("[data-next]");

  purposeList.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "purpose-card";
    btn.type = "button";
    if (state.purpose === p.id) btn.classList.add("selected");
    btn.innerHTML = `<h3>${p.name}</h3>`;
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".purpose-card").forEach(c => c.classList.remove("selected"));
      btn.classList.add("selected");
      state.purpose = p.id;
      otherWrap.style.display = p.id === "other" ? "block" : "none";
      nextBtn.disabled = false;
    });
    grid.appendChild(btn);
  });

  if (state.purpose === "other") otherWrap.style.display = "block";
  if (state.purpose) nextBtn.disabled = false;

  wrap.querySelector("[data-back]").addEventListener("click", () => goToStep(2));
  nextBtn.addEventListener("click", () => {
    if (!state.purpose) return;
    goToStep(4);
  });

  return wrap;
}

// Step 4: Location
function renderStep4() {
  const wrap = document.createElement("section");
  wrap.innerHTML = `
    <h2>Var befinner du dig?</h2>
    <p class="lead">Det avgör om drop-in i Stockholm är ett alternativ för dig.</p>
    <div class="location-grid" data-grid></div>
    <div class="step-actions">
      <button type="button" class="btn-back" data-back>← Tillbaka</button>
      <button type="button" class="btn-primary" data-next disabled>Visa resultat</button>
    </div>
  `;

  const grid = wrap.querySelector("[data-grid]");
  const nextBtn = wrap.querySelector("[data-next]");

  LOCATIONS.forEach(l => {
    const btn = document.createElement("button");
    btn.className = "location-card";
    btn.type = "button";
    if (state.location === l.id) btn.classList.add("selected");
    btn.innerHTML = `<h3>${l.name}</h3><p>${l.description}</p>`;
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".location-card").forEach(c => c.classList.remove("selected"));
      btn.classList.add("selected");
      state.location = l.id;
      nextBtn.disabled = false;
    });
    grid.appendChild(btn);
  });

  if (state.location) nextBtn.disabled = false;

  wrap.querySelector("[data-back]").addEventListener("click", () => goToStep(3));
  nextBtn.addEventListener("click", () => {
    if (!state.location) return;
    const params = new URLSearchParams({
      country: state.country,
      docType: state.docType,
      purpose: state.purpose,
      location: state.location,
    });
    window.location.href = "result.html?" + params.toString();
  });

  return wrap;
}

// Boot
function bootConfigurator() {
  loadStateFromUrl();
  syncStateToUrl(false);
  render();

  window.addEventListener("popstate", () => {
    loadStateFromUrl();
    render();
  });
}

document.addEventListener("DOMContentLoaded", bootConfigurator);
