const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from PC!');
});

// Écoute sur toutes les interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log('Serveur démarré sur http://0.0.0.0:3000')
});
