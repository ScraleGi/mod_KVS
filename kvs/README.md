# KVS – Kursverwaltungssystem

Dies ist ein [Next.js](https://nextjs.org) Projekt mit TypeScript, Prisma und MySQL als Datenbank.  
Für Authentifizierung wird [Auth0](https://auth0.com/) verwendet.

---

## Getting Started

### 1. Abhängigkeiten installieren

Führe im Projektverzeichnis aus:

```bash
npm install
```

### 2. Umgebungsvariablen setzen

Lege die Dateien `.env` und `.env.local` im Projektverzeichnis an.  
**Beispiel für die wichtigsten Variablen:**

#### `.env` (für Prisma & MySQL)
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

#### `.env.local` (für Auth0 & ggf. lokale Anpassungen)
```env
AUTH0_SECRET=dein_auth0_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://deine-domain.eu.auth0.com
AUTH0_CLIENT_ID=deine_client_id
AUTH0_CLIENT_SECRET=dein_client_secret
```

> **Hinweis:** Passe die Werte an deine Umgebung an!

### 3. Datenbank migrieren

Führe die Migrationen aus, um die Datenbankstruktur zu erstellen:

```bash
npx prisma migrate deploy
# oder für Entwicklung:
npx prisma migrate dev
```

### 4. Seed-Daten (optional)

Um Beispieldaten einzuspielen:

```bash
npx prisma db seed
```

### 5. Entwicklung starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

---

## Wichtige Technologien

- **Next.js** (App Router, SSR/SSG)
- **TypeScript**
- **Prisma** (ORM, Datenbankzugriff)
- **MySQL** (als Datenbank)
- **Auth0** (Authentifizierung)
- **Tailwind CSS** (Styling)

---

## Weitere Hinweise

- Die Datenbankverbindung wird über die Umgebungsvariable `DATABASE_URL` gesteuert.
- Auth0 benötigt die oben genannten Variablen für Login/Logout.
- Änderungen am Prisma-Schema (`prisma/schema.prisma`) erfordern eine neue Migration.

---

## Nützliche Befehle

- Migration erzeugen:  
  ```bash
  npx prisma migrate dev --name <migration-name>
  ```
- Datenbank reset (Achtung: löscht alle Daten!):  
  ```bash
  npx prisma migrate reset
  ```

---

## Deployment

Für das Deployment auf Vercel oder anderen Plattformen:  
- Alle Umgebungsvariablen müssen im Deployment-Umfeld gesetzt sein.
- Die Datenbank muss öffentlich erreichbar sein (z.B. über einen Cloud-MySQL-Dienst).

---

## Kontakt & Support

Bei Fragen oder Problemen:  
- Siehe [Next.js Doku](https://nextjs.org/docs)
- Siehe [Prisma Doku](https://www.prisma.io/docs)
- Siehe [Auth0 Doku](https://auth0.com/docs)

---