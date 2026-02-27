/**
 * server.js (entry point)
 * Carica le variabili d'ambiente e avvia il server HTTP.
 * La configurazione Express è in src/app.js (separata per permettere i test).
 */
const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});