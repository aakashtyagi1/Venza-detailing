import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Serve static frontend build in production / standalone
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('API active. Running Vite development server on port 3000.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`[VENZA • BRING IT DIRTY] Atelier Backend API online at http://localhost:${PORT}`);
});
