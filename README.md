# MyLibrary

Applicazione web (Single Page Application) per gestire una libreria personale: elenco libri, dettaglio e gestione (CRUD) con stato di lettura.

Componenti:
- **Frontend**: SPA in **React** (Create React App)
- **Backend**: API REST in **Node.js + Express**
- **DBMS**: **MySQL**

---

## Funzionalità
- Lista libri
- Dettaglio libro
- Creazione, modifica ed eliminazione libro
- Stato di lettura: `da leggere`, `in lettura`, `letto`

Nel database sono presenti anche le tabelle **citazioni** e **recensioni** (già previste nello schema).

---

## Tecnologie utilizzate

### Frontend
- React (Create React App / `react-scripts`)
- Fetch API per le chiamate HTTP
- CSS (stile custom)

### Backend
- Node.js
- Express
- mysql2
- dotenv
- cors
- nodemon (sviluppo)

### Database
- MySQL
- Script di inizializzazione: `database/mylibrary.sql`

---

## Struttura del progetto

```
MyLibrary/
  backend/            # API REST (Node/Express)
  frontend/           # SPA React
  database/
    mylibrary.sql     # schema + dati di esempio
```

---

## Avvio del progetto

### Prerequisiti
- Node.js (consigliata versione LTS)
- MySQL Server (locale) oppure MySQL in Docker

### 1) Setup database
Lo script `database/mylibrary.sql` crea il database `mylibrary`, le tabelle e alcuni dati di esempio.

Import da terminale (da root progetto):

```bash
mysql -u root -p < database/mylibrary.sql
```

> Se il tuo utente MySQL non è `root`, sostituiscilo nel comando.

### 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Il backend parte (di default) su `http://localhost:5000`.

**Configurazione**: modifica `backend/.env` con i parametri corretti:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mylibrary
PORT=5000
```

### 3) Frontend

```bash
cd frontend
npm install
npm start
```

Il frontend parte (di default) su `http://localhost:3000`.

#### Proxy API (consigliato)
Nel file `frontend/package.json` aggiungi:

```json
{ "proxy": "http://localhost:5000" }
```

Così il frontend può chiamare le API con path relativo, ad esempio `/api/books`.

---

## Endpoints API
Base path: `/api/books`

- `GET /api/books` — lista libri
- `GET /api/books/:id` — dettaglio libro
- `POST /api/books` — crea libro
- `PUT /api/books/:id` — aggiorna libro
- `DELETE /api/books/:id` — elimina libro

Esempio body JSON (POST/PUT):

```json
{ "titolo": "1984", "autore": "George Orwell", "stato": "in lettura", "utente_id": 1 }
```

---

## Test su mobile (web)
- Chrome → **Ispeziona** → icona **📱** “Toggle device toolbar”
- In alternativa, apri l’app dal telefono usando l’IP del PC (stessa Wi‑Fi) e avviando il dev server in ascolto su rete.


