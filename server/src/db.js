// server/src/db.js
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('❌ MONGODB_URI missing. Put it in server/.env (e.g., mongodb://127.0.0.1:27017/portobello)');
  }

  mongoose.set('strictQuery', true);

  // Short timeout so bad URIs fail fast
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  const { host, port, name } = mongoose.connection;
  console.log(`MongoDB connected → ${host}:${port}/${name}`);
  
  // Helpful event hooks
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err?.message || err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
}