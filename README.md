# Legalisering.se — Wireframe prototype (Phase 1)

Static HTML/CSS/JS wireframe for the redesigned Legalisering.se. Three pages:

- `index.html` — Homepage
- `configurator.html` — Multi-step intent-based configurator
- `result.html` — Configurator result + service recommendation

## Running

Open `index.html` in a browser. No build step, no dependencies.

Or serve with any static file server:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Status

Mid-fidelity wireframe. Grayscale + single accent color. Content in Swedish.

This is a structural prototype to validate the information architecture and the configurator flow. Visual design comes after structural review.

## File structure

```
/
├── index.html
├── configurator.html
├── result.html
├── css/styles.css
├── js/
│   ├── data.js         — Mock countries, document types, purposes, services
│   ├── logic.js        — Configurator recommendation logic
│   ├── configurator.js — Configurator UI flow
│   ├── home.js         — Homepage quickstart form
│   ├── result.js       — Result page renderer
│   └── shared.js       — Header/footer init, annotation toggle
└── README.md
```

## Annotations

Toggle "Visa anteckningar" in the footer to overlay design intent labels on each section.
