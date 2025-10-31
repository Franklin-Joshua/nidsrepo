import { Router } from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth.js';
import { Log } from '../models/Log.js';
import { reloadDataset } from '../utils/ingest.js';

const router = Router();

router.use(authenticateJWT);

router.delete('/logs/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const result = await Log.findByIdAndDelete(id);
  if (!result) return res.status(404).json({ error: 'Not found' });
  return res.json({ ok: true, deletedId: id });
});

router.post('/reload', requireRole('admin'), async (req, res) => {
  const summary = await reloadDataset();
  return res.json({ ok: true, ...summary });
});

export default router;


