# 📚 MyLibrary – Web Application

MyLibrary è un’applicazione web per la gestione di una libreria personale.  
L’utente, dopo autenticazione, può visualizzare e gestire i propri libri, aggiungere recensioni e citazioni, e interagire con i dati tramite un’interfaccia web responsive.

Il progetto è stato realizzato come parte dell’esame di **Applicazioni Web, Mobile e Cloud** ed è sviluppato come **Single Page Application (SPA)**.

---

## 🚀 Funzionalità principali

- Autenticazione utenti tramite JSON Web Token (JWT)
- Accesso riservato alla libreria personale
- Visualizzazione elenco libri dell’utente autenticato
- Visualizzazione dettaglio di un libro
- Inserimento e visualizzazione recensioni
- Inserimento e visualizzazione citazioni
- Interfaccia responsive, fruibile anche da dispositivi mobile

---

## 🧱 Architettura del progetto

Il progetto segue il paradigma **Single Page Application (SPA)** ed è strutturato secondo un’architettura a tre livelli:

- **Frontend**: applicazione web sviluppata con React
- **Backend**: API REST sviluppate con Node.js ed Express
- **Database**: DBMS relazionale per la persistenza dei dati

La comunicazione tra frontend e backend avviene tramite richieste HTTP in formato JSON.  
Il database non è accessibile direttamente dal frontend, ma esclusivamente tramite le API del backend.

### Struttura del progetto

    MyLibrary/
    ├── backend/
    │   ├── src/
    │   │   ├── controllers/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   ├── middleware/
    │   │   └── app.js
    │   └── package.json
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   └── App.jsx
    │   └── package.json


---

## 🛠 Tecnologie utilizzate

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- MySQL
- Pattern MVC (controllers / models / routes)

### Frontend
- React
- Single Page Application senza routing esterno
- Fetch API
- CSS responsive

### DevOps e gestione dell’ambiente
- Docker
- Docker Compose
- Environment Variables per la configurazione

---

## 🗄 Database
Il database gestisce le seguenti entità principali:

- Utenti
- Libri
- Recensioni
- Citazioni

Ogni recensione e citazione è associata a uno specifico libro tramite relazioni tra le tabelle.  
L’accesso alle risorse protette è gestito tramite autenticazione JWT.
L’inizializzazione del database avviene automaticamente all’avvio dei container Docker tramite script SQL.

---

## ⚙️ Installazione e avvio del progetto

### Requisiti
- Docker
- Docker Compose
---

## 1. Avvio di Docker

Avviare Docker Desktop e attendere che lo stato diventi **Engine running**.

---

## 2. Configurazione delle variabili d’ambiente

Creare un file `.env` nella root del progetto con il seguente contenuto:

```env
DB_NAME=mylibrary
DB_USER=mylibrary_user
DB_PASSWORD=mylibrary_pass
DB_ROOT_PASSWORD=rootpass

BACKEND_PORT=5000
FRONTEND_PORT=3000

JWT_SECRET=stringa_lunga_random
```
---

### 3️. Avvio dell’applicazione
Dalla root del progetto:

    docker compose up -d

Questo comando:
    -costruisce le immagini Docker
    -avvia database, backend e frontend
    -crea la rete necessaria alla comunicazione tra i servizi

---

### 4️. Accesso all’applicazione

    Frontend:
         http://localhost:3000

    Backend (API):
         http://localhost:5000

---

### 5. Arresto all’applicazione

    docker compose down


---
## 🔐 Autenticazione

L’applicazione utilizza JSON Web Token (JWT).

- Al login viene restituito un token
- Il token viene inviato nelle richieste protette tramite header:
  Authorization: Bearer <token>
- Le rotte protette consentono l’accesso ai dati dell’utente autenticato

---

## 👤 Autore

- Beatrice Cruciani    
- Università degli Studi di Camerino
