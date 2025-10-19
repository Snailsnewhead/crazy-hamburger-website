const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.post('/api/attempts', (req, res) => {
  try {
    console.log('📥 Received:', req.body);
    res.json({ 
      success: true, 
      message: 'Attempt saved',
      data: req.body 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/attempts', (req, res) => {
  res.json({ success: true, attempts: [] });
});

app.put('/api/attempts/:id', (req, res) => {
  res.json({ success: true, data: req.body });
});

app.delete('/api/attempts/:id', (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});