import mongoose from 'mongoose';

let connectionPromise;

export async function connectDB() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGO_URI is required');
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri).then(connection => {
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return connection;
    }).catch(error => {
      connectionPromise = undefined;
      throw error;
    });
  }
  const connection = await connectionPromise;
  return connection.connection;
}
