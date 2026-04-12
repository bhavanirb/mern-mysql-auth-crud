// server.js — Entry point of the entire backend

const express      = require('express');
const cors         = require('cors');
require('dotenv').config();

const db           = require('./config/db');
const authRoutes   = require('./routes/authRoutes');
const itemRoutes   = require('./routes/itemRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

app.use('/api/auth',  authRoutes);
app.use('/api/items', itemRoutes);

// ── Error Handler (must be last) ────────────
app.use(errorHandler);

// ── Start Server ────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});