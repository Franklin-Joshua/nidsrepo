import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../lib/db.js';
import { User } from '../models/User.js';

dotenv.config();

async function run() {
  await connectToDatabase();

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const userUsername = process.env.USER_USERNAME || 'user';
  const userPassword = process.env.USER_PASSWORD || 'user123';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  await User.updateOne(
    { username: adminUsername },
    { $set: { username: adminUsername, passwordHash: adminHash, role: 'admin' } },
    { upsert: true }
  );
  await User.updateOne(
    { username: userUsername },
    { $set: { username: userUsername, passwordHash: userHash, role: 'user' } },
    { upsert: true }
  );

  // eslint-disable-next-line no-console
  console.log('Seeded users:', adminUsername, userUsername);
  process.exit(0);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


