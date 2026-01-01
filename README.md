Descrizione del progetto

MyLibrary è un’applicazione web che consente agli utenti di catalogare i propri libri e monitorarne lo stato di lettura.
L’obiettivo è offrire uno strumento digitale semplice e intuitivo per organizzare le letture personali, accessibile da browser web e fruibile anche da dispositivi mobile grazie a un’interfaccia responsive.

L’applicazione è sviluppata come Single Page Application lato frontend e utilizza un backend REST con database relazionale MySQL.

🎯 Obiettivi

Gestire un catalogo di libri personali

Monitorare lo stato di lettura dei libri

Fornire un backend strutturato e facilmente estendibile

Applicare un’architettura chiara e conforme ai requisiti dell’esame

🧩 Funzionalità implementate

Visualizzazione elenco libri

Visualizzazione dettaglio di un libro

Aggiunta di nuovi libri

Modifica dei dati di un libro

Eliminazione di un libro

Gestione dello stato di lettura (da leggere, in lettura, letto)

Validazione dei dati tramite middleware

Gestione delle relazioni nel database

🏗️ Architettura dell’applicazione

L’applicazione segue un’architettura client–server ed è strutturata secondo il pattern MVC lato backend.

Client (SPA / Browser)
   ↓ HTTP (JSON)
Backend (Node.js + Express)
   ↓ Query SQL
Database (MySQL)

Backend – Pattern MVC

Routes: definizione degli endpoint REST

Controllers: gestione delle richieste HTTP e delle risposte

Models: accesso ai dati e gestione delle query SQL

Middleware: validazione input e controllo dei parametri

🛠️ Tecnologie utilizzate
Backend

Node.js

Express

MySQL

mysql2

dotenv

cors

Database

MySQL (DBMS relazionale)

Strumenti

Postman (test delle API)

GitHub (repository pubblico)

🗄️ Database

Il database è di tipo relazionale ed è progettato per supportare l’estensione futura dell’applicazione.

Tabelle principali:

utenti

libri

Sono inoltre presenti tabelle aggiuntive (citazioni, recensioni) predisposte per futuri sviluppi.

🔌 API REST disponibili
Metodo	Endpoint	Descrizione
GET	/api/books	Elenco libri
GET	/api/books/:id	Dettaglio libro
POST	/api/books	Creazione libro
PUT	/api/books/:id	Modifica libro
DELETE	/api/books/:id	Eliminazione libro
▶️ Avvio del progetto (Backend)

Clonare il repository

Installare le dipendenze:

npm install


Creare il file .env:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=*****
DB_NAME=mylibrary
PORT=5000


Avviare il server:

npm run dev

🧪 Test

Le API REST sono state testate tramite Postman, verificando il corretto funzionamento di tutte le operazioni CRUD e la comunicazione con il database.
