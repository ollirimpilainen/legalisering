function renderResult() {
  const params = getParams();
  const root = document.querySelector("[data-result-root]");
  if (!root) return;

  const rec = recommend(params);

  if (!rec) {
    root.innerHTML = `
      <div class="container">
        <div class="error-state">
          <h2>Vi hittade inte landet</h2>
          <p>Kontakta oss så hjälper vi dig manuellt på 08-5333 2080 eller kontakt@legalisering.se.</p>
          <a href="configurator.html" class="btn-primary">Börja om</a>
        </div>
      </div>
    `;
    return;
  }

  const c = rec.countryData;
  const docTypeName = getDocTypeName(params.docType);
  const purposeName = getPurposeName(params.docType, params.purpose);
  const locationShort = getLocationShort(params.location);

  const editUrl = "configurator.html?" + new URLSearchParams({
    country: params.country || "",
    docType: params.docType || "",
    purpose: params.purpose || "",
    location: params.location || "",
    step: "1",
  }).toString();

  // Summary sentence
  let summary;
  if (docTypeName && purposeName && c.name && locationShort) {
    summary = `${docTypeName} till ${c.name} för ${purposeName.toLowerCase()}, du befinner dig i ${locationShort}.`;
  } else {
    summary = `Dokument till ${c.name}.`;
  }

  // Intro for chain section
  let intro;
  if (c.convention === "hague") {
    intro = `${c.name} är medlem i Haagkonventionen, så apostille är tillräckligt. Här är stegen vi rekommenderar i den ordning vi gör dem.`;
  } else if (c.convention === "embassy") {
    intro = `${c.name} är inte med i Haagkonventionen, så vi behöver gå via UD och ambassaden. Här är stegen vi rekommenderar i den ordning vi gör dem.`;
  } else {
    intro = `Här är stegen vi rekommenderar för ditt ärende, i den ordning vi gör dem.`;
  }

  // Chain step descriptions — context aware
  const stepDescriptions = {
    notarisering: `Vår Notarius Publicus bestyrker att ditt dokument är en äkta kopia av originalet. Detta krävs innan nästa steg kan utfärdas.`,
    apostille: `Apostille bekräftar att Notarius Publicus underskrift är äkta enligt Haagkonventionen. Apostille godkänns direkt av myndigheterna i ${c.name} — ingen ambassad behövs.`,
    ud: `Utrikesdepartementet bekräftar Notarius Publicus underskrift. Detta krävs innan dokumentet kan tas vidare till ${c.name}s ambassad.`,
    embassy: `${c.name}s ambassad bekräftar slutligen att dokumentet är giltigt för användning i ${c.name}. Det är det här steget som tar längst tid i kedjan.`,
    translation: `En auktoriserad översättare översätter dokumentet till ett språk som accepteras av mottagarmyndigheten i ${c.name}. Översättningen legaliseras tillsammans med originalet.`,
    shipping: `Vi skickar tillbaka originalet och alla legaliserade dokument till din adress med spårbar post.`,
  };

  const chainHtml = rec.chain.map((step, idx) => `
    <li class="chain-step">
      <div class="chain-step__number" aria-hidden="true">${idx + 1}</div>
      <div class="chain-step__header">
        <h3>${step.name}</h3>
        <div class="chain-step__price">${formatPrice(step.price)}</div>
      </div>
      <div class="chain-step__time">Tid: ${step.time}</div>
      <p class="chain-step__desc">${stepDescriptions[step.id] || ""}</p>
    </li>
  `).join("");

  const breakdownHtml = rec.chain.map(s => `
    <li><span>${s.name}</span><span>${formatPrice(s.price)}</span></li>
  `).join("");

  // Time phases (simple textual breakdown)
  const phases = [];
  if (rec.chain.find(s => s.id === "notarisering")) phases.push("Notarisering: samma dag (drop-in) eller 1 arbetsdag");
  if (rec.chain.find(s => s.id === "translation")) phases.push("Översättning: 5–7 arbetsdagar");
  if (rec.chain.find(s => s.id === "apostille")) phases.push("Apostille: samma dag som notariseringen");
  if (rec.chain.find(s => s.id === "ud")) phases.push("UD-legalisering: 1–2 arbetsdagar");
  if (rec.chain.find(s => s.id === "embassy")) phases.push("Ambassadlegalisering: 1–3 veckor");
  if (rec.chain.find(s => s.id === "shipping")) phases.push("Returfrakt: 1 arbetsdag");

  const phaseHtml = phases.map(p => `<li><span>${p}</span></li>`).join("");

  const notes = getCountryNotes(c.code);
  const notesHtml = notes.map(n => `<li>${n}</li>`).join("");

  const otherDocTypeNote = rec.isOtherDocType
    ? `<p class="text-muted" style="margin-top: 1rem;">Du har valt en dokumenttyp som inte finns i listan. Vi kommer att kontakta dig för att bekräfta exakt vad som behövs.</p>`
    : "";

  root.innerHTML = `
    <section class="result-summary" data-annotation="Sammanfattning — bekräfta att vi förstod situationen rätt">
      <div class="container">
        <div class="result-summary__row">
          <div>
            <span class="result-summary__label">Din situation</span>
            <h2>${summary}</h2>
            ${otherDocTypeNote}
          </div>
          <a href="${editUrl}" class="btn-tertiary">← Ändra svar</a>
        </div>
      </div>
    </section>

    <section class="page-section" data-annotation="Rekommendation — service chain i ordning">
      <div class="container chain-container">
        <h2>Det här behöver göras</h2>
        <p class="lead">${intro}</p>
        <ol class="chain-list">${chainHtml}</ol>

        <div class="totals">
          <div class="totals__col">
            <h3>Totalt pris</h3>
            <div class="totals__value">${formatPrice(rec.totalPrice)}</div>
            <ul class="totals__breakdown">${breakdownHtml}</ul>
            <p class="totals__note">Priserna är inklusive moms. Returfrakt ingår.</p>
          </div>
          <div class="totals__col">
            <h3>Total tid</h3>
            <div class="totals__value">${rec.totalTime}</div>
            <ul class="totals__breakdown">${phaseHtml}</ul>
            <p class="totals__note">${params.location === "stockholm" ? "Snabbaste vägen: drop-in i Stockholm samma dag." : "Snabbaste vägen: drop-in i Stockholm samma dag."}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="page-section page-section--alt" data-annotation="Vad vi behöver — minska osäkerhet kring nästa steg">
      <div class="container chain-container">
        <h2>Det här behöver vi från dig</h2>
        <ul class="checklist">
          <li>Originaldokumentet (eller en bestyrkt kopia)</li>
          <li>Kopia av din ID-handling</li>
          <li>Returadress (om vi ska skicka tillbaka)</li>
          <li>Betalning — kort, Swish eller faktura (för företag)</li>
        </ul>
        <div class="send-to-block">
          <strong>Skicka till oss:</strong>
          <p>Legalisering.se<br>Kungsgatan 37, 4:e våningen<br>111 56 Stockholm</p>
        </div>
      </div>
    </section>

    <section class="page-section" data-annotation="Land-specifika fallgropar — bygg förtroende genom kunskap">
      <div class="container chain-container">
        <h2>Vanliga frågetecken för ${c.name}</h2>
        <p>Det här är saker som ofta missas och som vi ser ofta i ${c.name}.</p>
        <ul class="country-notes">${notesHtml}</ul>
      </div>
    </section>

    <section class="page-section page-section--accent cta-strip" data-annotation="Primär CTA — konvertering till beställning">
      <div class="container">
        <div class="cta-strip__inner">
          <div>
            <span class="eyebrow">Nästa steg</span>
            <h2>Klar att gå vidare?</h2>
            <p>Du betalar när vi har bekräftat ditt ärende. Vi hör av oss inom 4 arbetstimmar.</p>
          </div>
          <div class="btn-row">
            <a href="#" class="btn-primary btn-inverted">Beställ nu</a>
            <a href="tel:+4685333208" class="btn-secondary btn-outline-light">Ring oss — 08-5333 2080</a>
          </div>
        </div>
      </div>
    </section>

    <section class="page-section" data-annotation="Trust block — slutbekräftelse">
      <div class="container chain-container">
        <h2>Varför Legalisering.se</h2>
        <div class="trust-grid">
          <div class="trust-item">
            <h3>Notarius Publicus</h3>
            <p>Utsedda av Länsstyrelsen. De enda i Sverige som får utfärda apostille.</p>
          </div>
          <div class="trust-item">
            <h3>Över 2000 recensioner</h3>
            <p>4,9 av 5 på Google. Tusentals ärenden hanterade.</p>
          </div>
          <div class="trust-item">
            <h3>Personlig service</h3>
            <p>Du har en namngiven kontaktperson genom hela processen.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="secondary-actions" data-annotation="Sekundära åtgärder — spara/dela utan att förbinda sig">
      <div class="container">
        <div class="secondary-actions__row">
          <button type="button" data-action="email">📧 Skicka detta till min e-post</button>
          <button type="button" data-action="print">🖨️ Skriv ut sammanfattning</button>
          <button type="button" data-action="chat">💬 Chatta med oss</button>
        </div>
      </div>
    </section>

    <dialog data-email-dialog>
      <button class="close-x" type="button" data-email-close aria-label="Stäng">×</button>
      <h3>Skicka sammanfattning till e-post</h3>
      <p class="text-muted" style="font-size: 14px;">Vi skickar en kopia av rekommendationen till adressen nedan.</p>
      <form data-email-form>
        <div class="field">
          <label for="emailField">E-postadress</label>
          <input type="email" id="emailField" required>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn-tertiary" data-email-close>Avbryt</button>
          <button type="submit" class="btn-primary">Skicka</button>
        </div>
      </form>
    </dialog>

    <dialog data-chat-dialog>
      <button class="close-x" type="button" data-chat-close aria-label="Stäng">×</button>
      <h3>Chatten är offline</h3>
      <p>Just nu är chatten obemannad. Ring oss på <strong>08-5333 2080</strong> eller skicka ett mail till kontakt@legalisering.se.</p>
      <div class="dialog-actions">
        <button type="button" class="btn-primary" data-chat-close>Stäng</button>
      </div>
    </dialog>
  `;

  // Bind secondary action buttons
  const emailDlg = root.querySelector("[data-email-dialog]");
  const chatDlg = root.querySelector("[data-chat-dialog]");

  root.querySelector('[data-action="email"]').addEventListener("click", () => {
    if (typeof emailDlg.showModal === "function") emailDlg.showModal();
  });
  root.querySelector('[data-action="print"]').addEventListener("click", () => window.print());
  root.querySelector('[data-action="chat"]').addEventListener("click", () => {
    if (typeof chatDlg.showModal === "function") chatDlg.showModal();
  });

  root.querySelectorAll("[data-email-close]").forEach(b => b.addEventListener("click", () => emailDlg.close()));
  root.querySelectorAll("[data-chat-close]").forEach(b => b.addEventListener("click", () => chatDlg.close()));
  root.querySelector("[data-email-form]").addEventListener("submit", (e) => {
    e.preventDefault();
    emailDlg.close();
    alert("Tack! Sammanfattningen skickas inom kort.");
  });
}

document.addEventListener("DOMContentLoaded", renderResult);
