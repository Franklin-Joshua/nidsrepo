import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { Log } from '../models/Log.js';

const router = Router();

router.use(authenticateJWT);

router.get('/logs', async (req, res) => {
  const logs = await Log.find({}).sort({ createdAt: -1 }).limit(1000);
  return res.json({ count: logs.length, logs });
});

router.get('/attacks', async (req, res) => {
  const logs = await Log.find({ classification: 'Attack' }).sort({ createdAt: -1 }).limit(1000);
  return res.json({ count: logs.length, logs });
});

router.get('/stats', async (req, res) => {
  const totalLogs = await Log.countDocuments({});
  const totalAttackTraffic = await Log.countDocuments({ classification: 'Attack' });
  const totalNormalTraffic = await Log.countDocuments({ classification: 'Normal Traffic' });
  const attackAgg = await Log.aggregate([
    { $match: { classification: 'Attack' } },
    { $group: { _id: '$attack_label', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const attackCountsByType = Object.fromEntries(attackAgg.map((a) => [a._id, a.count]));
  return res.json({ totalLogs, totalNormalTraffic, totalAttackTraffic, attackCountsByType });
});

export default router;


