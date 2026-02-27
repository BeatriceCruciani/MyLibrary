/**
 * app.js
 * Configurazione Express separata dall'entry point server.js.
 * Questo permette di importare l'app nei test senza avviare il server HTTP.
 */
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/books");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MyLibrary API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);
  res.status(500).json({ error: "Errore interno" });
});

module.exports = app;