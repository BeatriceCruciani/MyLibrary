const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const bookRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// (opzionale ma utile) Health check
app.get('/', (req, res) => {
  res.send('MyLibrary API is running');
});

// Routes
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
