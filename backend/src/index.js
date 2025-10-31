import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectToDatabase } from './lib/db.js';
import authRoutes from './routes/auth.js';
import logsRoutes from './routes/logs.js';
import adminRoutes from './routes/admin.js';
import { ingestDatasetIfEmpty } from './utils/ingest.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'NIDS backend running' });
});

app.use('/api/auth', authRoutes);
app.use('/api', logsRoutes);
app.use('/api/admin', adminRoutes);

async function start() {
  await connectToDatabase();
  await ingestDatasetIfEmpty();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


