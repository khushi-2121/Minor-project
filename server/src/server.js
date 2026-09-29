import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url) });
console.log('AI configured:', Boolean(process.env.AI_API_KEY && !process.env.AI_API_KEY.startsWith('YOUR_')));

const { default: app } = await import('./app.js');
const { connectDB } = await import('./config/db.js');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AgriSense AI Server running on port ${PORT}`);
    console.log(`Health check: /api/health`);
  });

  try {
    await connectDB();
  } catch (error) {
    console.error('----------------------------------------------------');
    console.error('⚠️  DATABASE NOT CONNECTED:');
    console.error(`Reason: ${error.message}`);
    console.error('Action: Set MONGO_URI in Render Dashboard -> Environment tab');
    console.error('Example: mongodb+srv://<user>:<password>@cluster0...mongodb.net/agrisense-ai');
    console.error('----------------------------------------------------');
  }
};

startServer();
