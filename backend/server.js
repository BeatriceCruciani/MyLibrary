/**
 * server.js (entry point)
 *
 * Questo file è il punto di avvio del backend MyLibrary.
 * Si occupa di:
 * - caricare le variabili d'ambiente (.env)
 * - inizializzare Express
 * - configurare middleware globali (CORS, JSON body parsing)
 * - registrare le rotte principali (auth e books)
 * - avviare il server sulla porta configurata
 */
const dotenv = require("dotenv");
dotenv.config();// Carica le variabili d'ambiente da .env in process.env

const express = require("express");
const cors = require("cors");

// Import delle rotte modulari (separazione responsabilità)
const authRoutes = require("./src/routes/auth.routes");
const bookRoutes = require("./src/routes/books");

const app = express();

/**
 * La porta viene letta da variabile d'ambiente per flessibilità (deploy),
 * altrimenti si usa 5000 di default in locale.
 */
const PORT = process.env.PORT || 5000;


/**
 * Middleware globali
 */

// Abilita CORS: consente al frontend (es. localhost:3000) di chiamare le API
app.use(cors());
// Consente di leggere req.body come JSON (POST/PUT/PATCH)
app.use(express.json());

/**
 * Health check
 * Endpoint semplice per verificare che l'API sia attiva.
 * Utile anche per debug rapido o ambienti di deploy.
 */
app.get("/", (req, res) => {
  res.send("MyLibrary API is running");
});

/**
 * Routes
 * Ogni router gestisce un insieme di endpoint:
 * - /api/auth  -> autenticazione (register/login/me)
 * - /api/books -> gestione libri + citazioni + recensioni
 */
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

/**
 * Error handler globale (opzionale)
 * Cattura errori non gestiti lanciati nelle rotte/middleware.
 * Mantiene una risposta uniforme al client e logga l'errore sul server.
 */
app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);
  res.status(500).json({ error: "Errore interno" });
});

/**
 * Avvio server HTTP
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
