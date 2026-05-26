const COUNTRIES = [
  { code: "SE", name: "Sverige", flag: "🇸🇪", convention: "domestic", popular: false },
  { code: "ES", name: "Spanien", flag: "🇪🇸", convention: "hague", popular: true },
  { code: "DE", name: "Tyskland", flag: "🇩🇪", convention: "hague", popular: true },
  { code: "FR", name: "Frankrike", flag: "🇫🇷", convention: "hague", popular: false },
  { code: "IT", name: "Italien", flag: "🇮🇹", convention: "hague", popular: false },
  { code: "GB", name: "Storbritannien", flag: "🇬🇧", convention: "hague", popular: true },
  { code: "US", name: "USA", flag: "🇺🇸", convention: "hague", popular: true },
  { code: "PT", name: "Portugal", flag: "🇵🇹", convention: "hague", popular: false },
  { code: "GR", name: "Grekland", flag: "🇬🇷", convention: "hague", popular: false },
  { code: "NL", name: "Nederländerna", flag: "🇳🇱", convention: "hague", popular: false },
  { code: "NO", name: "Norge", flag: "🇳🇴", convention: "hague", popular: false },
  { code: "DK", name: "Danmark", flag: "🇩🇰", convention: "hague", popular: false },
  { code: "FI", name: "Finland", flag: "🇫🇮", convention: "hague", popular: false },
  { code: "PL", name: "Polen", flag: "🇵🇱", convention: "hague", popular: false },
  { code: "AU", name: "Australien", flag: "🇦🇺", convention: "hague", popular: false },
  { code: "JP", name: "Japan", flag: "🇯🇵", convention: "hague", popular: false },
  { code: "KR", name: "Sydkorea", flag: "🇰🇷", convention: "hague", popular: false },
  { code: "IN", name: "Indien", flag: "🇮🇳", convention: "hague", popular: false },
  { code: "CN", name: "Kina", flag: "🇨🇳", convention: "hague", popular: true },
  { code: "BR", name: "Brasilien", flag: "🇧🇷", convention: "hague", popular: false },
  { code: "MX", name: "Mexiko", flag: "🇲🇽", convention: "hague", popular: false },
  { code: "SA", name: "Saudiarabien", flag: "🇸🇦", convention: "embassy", popular: true },
  { code: "AE", name: "Förenade Arabemiraten", flag: "🇦🇪", convention: "embassy", popular: true },
  { code: "QA", name: "Qatar", flag: "🇶🇦", convention: "embassy", popular: false },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", convention: "embassy", popular: false },
  { code: "EG", name: "Egypten", flag: "🇪🇬", convention: "embassy", popular: false },
  { code: "IR", name: "Iran", flag: "🇮🇷", convention: "embassy", popular: false },
  { code: "IQ", name: "Irak", flag: "🇮🇶", convention: "embassy", popular: false },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", convention: "embassy", popular: false },
  { code: "TH", name: "Thailand", flag: "🇹🇭", convention: "embassy", popular: true },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", convention: "embassy", popular: false },
];

const DOCUMENT_TYPES = [
  { id: "civil", name: "Personbevis och intyg", description: "Födelseattest, vigselbevis, hindersprövning, personbevis", category: "personal" },
  { id: "education", name: "Utbildningsdokument", description: "Examensbevis, betyg, intyg", category: "personal" },
  { id: "legal", name: "Fullmakter och juridiska dokument", description: "Fullmakt, medgivande, testamente", category: "personal" },
  { id: "company", name: "Företagsdokument", description: "Registreringsbevis, firmateckning, bolagsordning", category: "business" },
  { id: "export", name: "Exportdokument", description: "Ursprungsintyg, EUR.1, ATA-carnet", category: "business" },
  { id: "other", name: "Annat", description: "Beskriv ditt dokument", category: "any" },
];

const PURPOSES = {
  civil: [
    { id: "marriage", name: "Gifta sig utomlands" },
    { id: "move", name: "Flytta utomlands" },
    { id: "study", name: "Studera utomlands" },
    { id: "work", name: "Arbeta utomlands" },
    { id: "visa", name: "Visumansökan" },
    { id: "inheritance", name: "Arv eller dödsbo" },
    { id: "other", name: "Annat syfte" },
  ],
  education: [
    { id: "study", name: "Studera utomlands" },
    { id: "work", name: "Arbeta utomlands" },
    { id: "license", name: "Yrkeslegitimation utomlands" },
    { id: "other", name: "Annat syfte" },
  ],
  legal: [
    { id: "property", name: "Köpa eller sälja fastighet utomlands" },
    { id: "nie", name: "NIE-nummer (Spanien)" },
    { id: "represent", name: "Representera någon i juridiskt ärende" },
    { id: "inheritance", name: "Arvsärende" },
    { id: "other", name: "Annat syfte" },
  ],
  company: [
    { id: "subsidiary", name: "Etablera bolag utomlands" },
    { id: "contract", name: "Affärsavtal" },
    { id: "tender", name: "Anbud eller upphandling" },
    { id: "other", name: "Annat syfte" },
  ],
  export: [
    { id: "customs", name: "Tull och fraktdokumentation" },
    { id: "trade", name: "Internationell handel" },
    { id: "other", name: "Annat syfte" },
  ],
  other: [
    { id: "other", name: "Annat — vi kontaktar dig" },
  ],
};

const SERVICES = {
  notarisering: { name: "Notarisering", price: 499, time: "1 arbetsdag eller drop-in samma dag" },
  apostille: { name: "Apostille", price: 499, time: "Samma dag som notarisering" },
  ud: { name: "UD-legalisering", price: 955, time: "1–2 arbetsdagar" },
  embassy: { name: "Ambassadlegalisering", price: 975, time: "1–3 veckor beroende på ambassad" },
  translation: { name: "Översättning av auktoriserad översättare", price: 1200, time: "5–7 arbetsdagar" },
  shipping: { name: "Returfrakt", price: 100, time: "1 arbetsdag" },
};

const LOCATIONS = [
  { id: "stockholm", name: "Jag är i Stockholm", description: "Drop-in på Kungsgatan 37 kan vara snabbast." },
  { id: "sweden", name: "Jag är någon annanstans i Sverige", description: "Du skickar in dokumentet med posten." },
  { id: "abroad", name: "Jag bor utomlands", description: "Vi hanterar allt på distans, även internationell post." },
];

const COUNTRY_NOTES = {
  ES: [
    "Vigselbevis från Skatteverket får inte vara äldre än 6 månader när det presenteras i Spanien.",
    "Vissa kommuner i Spanien kräver också en officiell översättning till spanska. Vi kan ordna det.",
    "Vid NIE-ansökan ska fullmakten vara apostillestämplad — vi gör det i samma omgång.",
  ],
  SA: [
    "Saudiarabiens ambassad kräver översättning till arabiska som en del av legaliseringen.",
    "Ambassaden kräver ofta att den juridiska personen som representerar dig är dokumenterad.",
    "Räkna med 2–3 veckors total tid för hela kedjan.",
  ],
  AE: [
    "UAE-ambassaden tar ut en separat avgift som tillkommer på kostnaden ovan.",
    "Dokument äldre än 6 månader accepteras sällan — kontrollera datum innan du skickar.",
    "För affärsavtal kan både engelsk och arabisk översättning behövas.",
  ],
  default: [
    "Kontrollera att alla original är aktuella — dokument äldre än 6 månader kan avvisas.",
    "Om dokumentet är på annat språk än engelska kan översättning behövas. Vi kan ordna det.",
  ],
};
