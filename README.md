# LU1 Frontend 2.1

Dit project is de frontend van een leerplatform voor lezen en leesadvies. De app helpt studenten om een leesprofiel in te vullen, persoonlijke boekaanbevelingen te ontvangen, een catalogus te doorzoeken en een eigen leeslijst te beheren.

De codebase draait op Next.js met React en TypeScript. De frontend communiceert met een lokale backend API op `http://localhost:8080`.

## Doel van de README

Deze README is bedoeld voor een nieuwe ontwikkelaar die het project snel wil begrijpen en zonder mondelinge uitleg een kleine wijziging kan bouwen, testen en draaien.

## Snelstart

### Vereisten

Zorg dat je het volgende lokaal hebt:

- Node.js 18+ (liefst recente LTS-versie)
- npm
- Een werkende backend voor dit project, bijvoorbeeld in een naastliggende repo:
  `../LU1 Backend 2.1`
- De backend moet draaien op `http://localhost:8080`

### 1. Installatie

Open een terminal in de projectmap en run:

```bash
npm install
```

### 2. Development server starten

```bash
npm run dev
```

Ga dan naar:

```text
http://localhost:3000
```

### 3. Productie build controleren

```bash
npm run build
```

### 4. Productie server starten

```bash
npm start
```

## Scripts

De belangrijkste scripts uit `package.json`:

```bash
npm run dev        # Start de Next.js dev-server
npm run build      # Bouwt de productieversie
npm run start      # Start de productieversie
npm run lint       # Voert ESLint uit
npm run lint:fix   # Herstelt automatisch kleine lint-problemen
npm run generate:api   # Genereert TypeScript types uit de OpenAPI-spec
```

### `generate:api`

```bash
npm run generate:api
```

Dit script verwacht het backend OpenAPI-bestand in:

```text
../LU1 Backend 2.1/openapi.yaml
```

Als die map of het bestand niet bestaat, zal de type-generatie niet werken. De gegenereerde types komen in `types/api.ts`.

## Architectuur en projectstructuur

```text
LU1 Frontend 2.1/
├── components/                 # Herbruikbare UI-componenten
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── SkeletonAdvice.tsx
│   ├── SkeletonCatalog.tsx
│   ├── SkeletonLeeslijst.tsx
│   ├── SkeletonLeesprofiel.tsx
│   └── SkeletonProfielbekijken.tsx
├── pages/                     # Next.js routes / pagina's
│   ├── index.tsx
│   ├── catalog.tsx
│   ├── advice.tsx
│   ├── teacher.tsx
│   ├── reading-list.tsx
│   ├── profiel/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── profielDashboard.tsx
│   ├── leesprofiel/
│   │   ├── ProfielInvullen.tsx
│   │   ├── ProfielBewerken.tsx
│   │   └── ProfielBekijken.tsx
│   └── _app.tsx
├── public/                    # Statische assets zoals afbeeldingen
├── styles/                    # Globale CSS / styling
├── types/                     # TypeScript types en API types
│   ├── api.ts                 # Gegenereerd uit OpenAPI
│   └── index.ts              # Verwijzingen en domein types
├── .gitignore
├── eslint.config.mjs          # ESLint-configuratie
├── next-env.d.ts
├── package.json
├── tsconfig.json
├── README.md
├── package-lock.json
└── ...
```

## Belangrijkste onderdelen

### Pages

In `pages/` staan de route-pagina's van de applicatie. Deze zijn de primaire UI-pagina's:

- `/` - startpagina en toegangspoort naar leesprofiel / advies / catalogus
- `/profiel/login` - inloggen
- `/profiel/register` - account aanmaken
- `/leesprofiel/ProfielInvullen` - leesprofiel invullen
- `/leesprofiel/ProfielBekijken` - leesprofiel bekijken
- `/advice` - leesadvies tonen
- `/catalog` - catalogus van boeken
- `/reading-list` - persoonlijke leeslijst
- `/teacher` - docent/dashboard 

### Components

`components/` bevat herbruikbare UI-onderdelen zoals:

- `Header` en `Sidebar` voor navigatie/layout
- `Skeleton...` componenten voor loading states bij pagina's

### Types

`types/` bevat de projecttypes. De file `types/index.ts` exporteert de belangrijkste applicatietypes en verwijst naar de OpenAPI gegenereerde schema's.

Belangrijk: `types/api.ts` wordt automatisch gegenereerd uit de backend OpenAPI-spec. Wijzig deze niet handmatig.

### Styling

De styling staat in `styles/` en wordt gebruikt door de pagina's en componenten. De app gebruikt een mix van custom CSS en component-gebaseerde layout.

## Werkwijze voor een kleine wijziging

Een teamlid kan zonder mondelinge uitleg een simpele wijziging doen volgens deze flow:

1. Kies de juiste pagina of component in `pages/` of `components/`.
2. Controleer of de wijziging een API-call of UI-verbetering is.
3. Gebruik bestaande types uit `types/` waar mogelijk.
4. Run lokaal:

```bash
npm run lint
```

5. Start de app opnieuw:

```bash
npm run dev
```

6. Controleer de pagina in de browser op `http://localhost:3000`.

## API en auth-flow

De app maakt bijna allemaal calls naar de backend via `fetch` naar `http://localhost:8080`.

Typische patronen:

- token ophalen uit `localStorage`
- bij ontbrekend token doorsturen naar `/profiel/login`
- protected routes controleren voor 401-responses
- login-resultaat opslaan in `localStorage` via `token`, `studentId` en `user`

Als je een nieuwe API-call toevoegt, werk dan ook de bijbehorende type(s) in `types/index.ts` bij als dat nodig is.

## Coding style guide

De codebase volgt de standaard Next.js + TypeScript ESLint regels, zoals geconfigureerd in `eslint.config.mjs`.

Belangrijkste principes:

- Gebruik TypeScript in alle relevante bestanden
- Houd componenten klein en duidelijk gescheiden
- Gebruik `React` hooks op de gebruikelijke manier
- Vermijd `any` waar mogelijk; in `eslint.config.mjs` staat `@typescript-eslint/no-explicit-any` als warning, niet als error
- Ongebruikte parameters moeten worden genoemd met `_` om expliciet te markeren
- React hooks warnings worden bewust niet als hard fout behandeld (`react-hooks/exhaustive-deps`, `react-hooks/set-state-in-effect`)

Deze configuratie is de gekozen coding style guide voor dit project. De regels zijn niet alleen in de code terug te vinden, maar ook gelinkt aan de praktijk van de app:

- Next.js/React conventions worden toegepast
- TypeScript best practices worden afgedwongen
- de linting setup maakt het makkelijk om consistente code te houden voor teamleden

### Linting lokaal uitvoeren

```bash
npm run lint
```

Als je een structurele wijziging doet, is het verstandig om eerst te linten voordat je een PR opent.

## Veelvoorkomende tips

- Gebruik `localStorage` alleen in client-side code, niet tijdens server-side rendering.
- Controleer eerst of een route beveiligd moet zijn; dit gebeurt vaak via token-verificatie.
- Als je een nieuwe pagina toevoegt, gebruik de bestaande route-conventies en kies een logische naam in `pages/`.
- Houd componentnamen en bestandsnamen consistent met de bestaande structuur.
- Gebruik de generatie van API types via `npm run generate:api` i.p.v. handmatig nieuwe types te schrijven.

## Opmerking voor de backend

Dit repo is de frontend. De volledige app werkt pas goed als de bijbehorende backend ook lokaal draait. De frontend verwacht de API op `http://localhost:8080`.

