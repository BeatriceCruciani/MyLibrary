# MyLibrary 📚

MyLibrary è una web app (Single Page Application) per gestire una libreria personale.
L’utente può registrarsi e accedere tramite autenticazione JWT, quindi creare e gestire i propri libri e aggiungere **citazioni** e **recensioni** per ogni libro.

---

## Funzionalità principali

- Registrazione utente (nome, email, password)
- Login con email + password (JWT)
- Area privata con i **libri dell’utente loggato**
- CRUD libri (crea, modifica, elimina)
- Gestione **citazioni** per libro (aggiungi/elimina)
- Gestione **recensioni** per libro (aggiungi/elimina)
- Interfaccia responsive (utilizzabile anche da mobile)

---

## Tecnologie utilizzate

### Frontend
- **React** (Single Page Application)
- Fetch wrapper con gestione token JWT (Authorization Bearer)
- CSS custom (tema beige, responsive)

### Backend
- **Node.js + Express**
- **JWT** per autenticazione (rotte protette)
- **bcryptjs** per hashing password

### Database
- **MySQL** (o MariaDB)
- Script SQL nella cartella `database/` per creare tabelle e dati iniziali (se presenti)

---

## Struttura del progetto
MyLibrary/
  backend/
  frontend/
  database/


---

## Requisiti

Assicurati di avere installato:

- Node.js (consigliato: LTS)
- npm
- MySQL / MariaDB

---

## Avvio del progetto (step-by-step)

### 1) Database
1. Avvia MySQL
2. Crea un database (esempio: `mylibrary`)
3. Importa lo script SQL presente nella cartella `database/` (se disponibile), ad esempio:
   - `database/mylibrary.sql`
   - oppure altri file `.sql`

> Se stai usando MySQL Workbench: apri lo script → esegui.

---

### 2) Backend
1. Entra nella cartella backend:
   ```bash
   cd backend

   Installa le dipendenze:

npm install


Crea il file .env nella cartella backend/ (se non esiste) con una configurazione simile:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mylibrary

JWT_SECRET=una_stringa_molto_lunga_e_random
JWT_EXPIRES_IN=7d


Avvia il server:

npm start


Il backend sarà disponibile su:

http://localhost:5000


3) Frontend

Apri un nuovo terminale e vai nella cartella frontend:

cd frontend


Installa le dipendenze:

npm install


Avvia React:

npm start


Apri il browser su:

http://localhost:3000