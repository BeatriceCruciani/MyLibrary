# 📚 MyLibrary – Web Application

MyLibrary è un’applicazione web per la gestione di una libreria personale.  
L’utente può visualizzare libri, aggiungere citazioni e recensioni, e interagire con i dati tramite un’interfaccia web responsive.

Il progetto è stato realizzato come parte del modulo 1 dell’esame di **Applicazioni Web e Basi di Dati**.

---

## 🚀 Funzionalità principali

- Autenticazione tramite JWT
- Visualizzazione dei libri associati all’utente loggato
- Visualizzazione elenco libri
- Dettaglio di un libro
- Inserimento e visualizzazione recensioni
- Inserimento e visualizzazione citazioni
- Interfaccia responsive, fruibile anche da dispositivi mobile

---

## 🧱 Architettura del progetto

Il progetto segue il paradigma **Single Page Application (SPA)** ed è suddiviso in:

- Backend: API REST (Node.js / Express)
- Frontend: applicazione web (React)
- Database: sistema relazionale per la persistenza dei dati (MySQL)

Struttura del progetto:

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
- MySQL – gestito tramite MySQL Workbench
- Pattern MVC (controllers / models / routes)

### Frontend
- React
- React Router
- Fetch API / Axios
- CSS responsive

---

## 🗄 Database

Il database gestisce le seguenti entità:

- Utenti
- Libri
- Recensioni
- Citazioni

Ogni recensione e citazione è associata a uno specifico libro tramite relazioni tra le tabelle.  
L’accesso ad alcune risorse è protetto tramite autenticazione JWT.

---

## ⚙️ Installazione e avvio del progetto

### Requisiti
- Node.js (>= 18)
- npm
- MySQL
- MySQL Workbench

---

### 1️⃣ Clonare il repository

    git clone https://github.com/tuo-username/MyLibrary.git
    cd MyLibrary

---

### 2️⃣ Configurare le variabili d’ambiente (Backend)

Creare un file `.env` nella cartella `backend/` con i seguenti parametri (esempio):

    PORT=5000
    JWT_SECRET=your_secret_key

    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name

---

### 3️⃣ Avvio Backend

    cd backend
    npm install
    npm start

Il backend sarà disponibile su:

    http://localhost:5000

---

### 4️⃣ Avvio Frontend

Aprire un nuovo terminale ed eseguire:

    cd frontend
    npm install
    npm start

Il frontend sarà disponibile su:

    http://localhost:3000

---

## 🔐 Autenticazione

L’applicazione utilizza JSON Web Token (JWT).

- Al login viene restituito un token
- Il token viene inviato nelle richieste protette tramite header:
  Authorization: Bearer <token>
- Le rotte protette consentono l’accesso ai dati dell’utente autenticato

---

## 📱 Responsive Design

L’interfaccia è progettata per essere utilizzabile sia su desktop che su dispositivi mobili.

---

## 👤 Autore

- Beatrice Cruciani  
- Progetto individuale  
- Università degli Studi di Camerino
