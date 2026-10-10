# LU1 Frontend 2.1

Frontend voor een leesplatform dat studenten helpt bij het invullen van een leesprofiel, het bekijken van persoonlijk leesadvies en het beheren van een leeslijst. De applicatie is opgebouwd met Next.js, React en TypeScript.

## Overzicht

Deze frontend werkt samen met een backend API op `http://localhost:8080` en biedt de volgende functionaliteiten:

- Inloggen en registreren
- Invullen en beheren van een leesprofiel
- Ontvangen van leesadvies op basis van het profiel
- Bladeren door de catalogus van boeken
- Beheer van een persoonlijke leeslijst
- Dashboard voor docent/teacher-functionaliteit

## Tech Stack

- Next.js
- React
- TypeScript
- CSS modules / custom styles in `styles/`

## Vereisten

Zorg ervoor dat je het volgende hebt geïnstalleerd:

- Node.js (v18 of hoger wordt aanbevolen)
- npm
- Een werkende backend API op `http://localhost:8080`

## Installatie

1. Open een terminal in de projectmap.
2. Installeer de dependencies:

```bash
npm install
```

## Development

Start de applicatie in development mode:

```bash
npm run dev
```

Open daarna je browser op:

```text
http://localhost:3000
```

## Productie build

Maak een production build:

```bash
npm run build
```

Start de productieversie:

```bash
npm start
```

## Scripts

In `package.json` staan de volgende scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
npm run generate:api
```

### `generate:api`

Dit script genereert TypeScript-types vanuit de OpenAPI-specificatie van de backend. De opdracht verwacht een naastgelegen projectmap:

```text
../LU1 Backend 2.1/openapi.yaml
```

Als deze map of het bestand niet bestaat, werkt de type-generatie niet.

## Projectstructuur

```text
.
├── components/          # Herbruikbare UI-componenten
├── pages/               # Next.js pagina's
├── public/              # Statische bestanden
├── styles/              # Globale styling
├── types/               # TypeScript type-definities en API types
├── package.json         # Projectconfiguratie en scripts
├── tsconfig.json        # TypeScript configuratie
├── next-env.d.ts        # Next.js TypeScript configuratie
├── .gitignore           # Git-ignore file
└── README.md            # Projectdocumentatie
```

## Belangrijk om te weten

- De frontend gebruikt lokaal opgeslagen data via `localStorage` voor login, profiel en leeslijst-status.
- De backend API moet lokaal draaien om login en data-opslag te laten werken.
- De projectnaam in de repo is `LU1 Frontend 2.1` en is bedoeld als frontend voor het bijbehorende backend-project.

## Belangrijke paden

Enkele belangrijke pagina's in de app:

- `/` - Startpagina
- `/profiel/login` - Inloggen
- `/profiel/register` - Registreren
- `/leesprofiel/ProfielInvullen` - Leesprofiel invullen
- `/advice` - Leesadvies
- `/catalog` - Catalogus
- `/reading-list` - Leeslijst

## Opmerking

Dit project is primair gericht op het frontend-gedeelte van een leeromgeving. Voor volledige functionaliteit moet de bijbehorende backend ook lokaal beschikbaar zijn.
