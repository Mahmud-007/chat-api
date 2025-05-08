import express from 'express';
const app = express();

import type { Request, Response } from 'express';

app.get('/', (req, res) => {
  res.send('API is working 🚀');
});
app.listen(5000, () => console.log('Server running on port 5000'));
