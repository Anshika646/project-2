import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// In AI Studio Cloud Run, nginx proxies external requests from 8080 to 3000.
// The app server must always listen on port 3000.
const PORT = 3000;

const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}
app.use(express.static(__dirname));

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('*', (req, res) => {
  const distIndex = path.join(distPath, 'index.html');
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`STICKZY Production Server listening on http://0.0.0.0:${PORT}`);
});
