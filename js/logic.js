function recommend(state) {
  const country = state.country;
  const docType = state.docType;
  const location = state.location;

  const countryData = COUNTRIES.find(c => c.code === country);
  if (!countryData) return null;

  const chain = [];

  chain.push("notarisering");

  const needsTranslation = countryData.convention === "embassy";
  if (needsTranslation) {
    chain.push("translation");
  }

  if (countryData.convention === "hague") {
    chain.push("apostille");
  } else if (countryData.convention === "embassy") {
    chain.push("ud");
    chain.push("embassy");
  } else if (countryData.convention === "domestic") {
    chain.push("apostille");
  }

  if (location !== "stockholm") {
    chain.push("shipping");
  }

  const totalPrice = chain.reduce((sum, svc) => sum + SERVICES[svc].price, 0);
  const totalTime = calculateTotalTime(chain, location);

  return {
    chain: chain.map(svc => ({ id: svc, ...SERVICES[svc] })),
    totalPrice,
    totalTime,
    countryData,
    docType,
    isOtherDocType: docType === "other",
  };
}

function calculateTotalTime(chain, location) {
  if (chain.includes("embassy")) return "Ca 2–3 veckor";
  if (chain.includes("translation")) return "Ca 7–10 arbetsdagar";
  if (location === "stockholm") return "Samma dag (drop-in) eller 1 arbetsdag";
  return "Ca 2–3 arbetsdagar";
}

function getCountryNotes(countryCode) {
  return COUNTRY_NOTES[countryCode] || COUNTRY_NOTES.default;
}

function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " kr";
}

function getPurposeName(docTypeId, purposeId) {
  const list = PURPOSES[docTypeId];
  if (!list) return purposeId || "";
  const item = list.find(p => p.id === purposeId);
  return item ? item.name : (purposeId || "");
}

function getDocTypeName(docTypeId) {
  const item = DOCUMENT_TYPES.find(d => d.id === docTypeId);
  return item ? item.name : (docTypeId || "");
}

function getLocationName(locationId) {
  const item = LOCATIONS.find(l => l.id === locationId);
  return item ? item.name : (locationId || "");
}

function getLocationShort(locationId) {
  if (locationId === "stockholm") return "Stockholm";
  if (locationId === "sweden") return "Sverige";
  if (locationId === "abroad") return "utomlands";
  return locationId || "";
}
