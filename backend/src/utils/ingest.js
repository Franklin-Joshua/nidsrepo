import fetch from 'node-fetch';
import mongoose from 'mongoose';
import { Log } from '../models/Log.js';

const NSL_KDD_URL = 'https://raw.githubusercontent.com/defcom17/NSL_KDD/master/KDDTrain+.txt';

function parseLineToDoc(line) {
  const parts = line.trim().split(',');
  // Guard minimal length (NSL-KDD KDDTrain+ has 43 columns inc. label & difficulty)
  if (parts.length < 43) return null;
  const duration = Number(parts[0]);
  const protocol_type = parts[1];
  const service = parts[2];
  const flag = parts[3];
  const src_bytes = Number(parts[4]);
  const dst_bytes = Number(parts[5]);
  const count = Number(parts[22]);
  const srv_count = Number(parts[23]);
  const dst_host_count = Number(parts[32]);
  const attack_label = parts[41];
  const difficulty = Number(parts[42]);
  const classification = attack_label === 'normal' ? 'Normal Traffic' : 'Attack';
  return {
    duration,
    protocol_type,
    service,
    flag,
    src_bytes,
    dst_bytes,
    count,
    srv_count,
    dst_host_count,
    attack_label,
    difficulty,
    classification
  };
}

export async function ingestDatasetIfEmpty() {
  const hasAny = await Log.estimatedDocumentCount();
  if (hasAny > 0) return { skipped: true, reason: 'Collection not empty' };
  return reloadDataset();
}

export async function reloadDataset() {
  const res = await fetch(NSL_KDD_URL);
  if (!res.ok) throw new Error(`Failed to download dataset: ${res.status}`);
  const text = await res.text();
  const lines = text.split('\n').filter(Boolean);

  const docs = [];
  for (const line of lines) {
    const doc = parseLineToDoc(line);
    if (doc) docs.push(doc);
  }

  const session = await mongoose.startSession();
  let inserted = 0;
  await session.withTransaction(async () => {
    await Log.deleteMany({});
    if (docs.length > 0) {
      const result = await Log.insertMany(docs, { ordered: false });
      inserted = result.length;
    }
  });
  session.endSession();

  return { skipped: false, inserted };
}


