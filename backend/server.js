const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

// ROUTES
const bookRoutes = require('./src/routes/books');
const authRoutes = require('./src/routes/auth.routes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('MyLibrary API is running');
});

// ROUTES API
app.use('/api/auth', authRoutes);  
app.use('/api/books', bookRoutes);

const db = require("./src/db");

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Connesso al database MyLibrary");
  } catch (err) {
    console.error("❌ Errore connessione database:", err.message);
  }
})();


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

