import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'AgriSense Administrator' } = process.env;

  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required.');
  }

  await mongoose.connect(MONGO_URI);
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log('Existing account promoted to admin:', existing.email);
  } else {
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), password: ADMIN_PASSWORD, role: 'admin' });
    console.log('Admin account created:', ADMIN_EMAIL.toLowerCase());
  }
  await mongoose.disconnect();
};

createAdmin().catch(async (error) => {
  console.error('Admin setup failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
