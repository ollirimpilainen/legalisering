document.addEventListener("DOMContentLoaded", () => {
  const countrySelect = document.getElementById("qs-country");
  const docTypeSelect = document.getElementById("qs-doctype");
  const form = document.getElementById("quickstart-form");
  if (!countrySelect || !docTypeSelect || !form) return;

  // Populate top 8 popular countries + "Annat land..." fallback
  const popular = COUNTRIES.filter(c => c.popular);
  popular.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.code;
    opt.textContent = `${c.flag} ${c.name}`;
    countrySelect.appendChild(opt);
  });
  const otherOpt = document.createElement("option");
  otherOpt.value = "__other";
  otherOpt.textContent = "Annat land…";
  countrySelect.appendChild(otherOpt);

  DOCUMENT_TYPES.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.name;
    docTypeSelect.appendChild(opt);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const country = countrySelect.value;
    const docType = docTypeSelect.value;

    if (!country || !docType) {
      // Native required would normally fire, but we used novalidate; flag inline.
      if (!country) countrySelect.focus();
      else docTypeSelect.focus();
      return;
    }

    if (country === "__other") {
      // No country chosen — open configurator at step 1, but pre-set docType
      window.location.href = `configurator.html?docType=${encodeURIComponent(docType)}&step=1`;
      return;
    }

    window.location.href = `configurator.html?country=${encodeURIComponent(country)}&docType=${encodeURIComponent(docType)}&step=3`;
  });
});
