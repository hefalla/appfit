import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  appPin: process.env.APP_PIN || '1234',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};
