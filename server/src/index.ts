import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { authRouter } from './routes/auth.js';
import { aiRouter } from './routes/ai.js';
import { musclesRouter } from './routes/muscles.js';
import { workoutsRouter } from './routes/workouts.js';
import { prisma } from './services/db.js';
import { ensureDatabaseSeeded } from './services/seedService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: (error as Error).message,
    });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/muscles', musclesRouter);
app.use('/api/workouts', workoutsRouter);

// Serve static client assets in production if dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Endpoint no encontrado' });
    }
  });
});

const PORT = config.port;
app.listen(PORT, async () => {
  console.log(`⚡ [AppFit Backend] Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`🔒 [AppFit Backend] PIN configurado: **** (longitud 4)`);
  console.log(`🤖 [AppFit Backend] IA Gemini: ${config.geminiApiKey ? 'Configurada' : 'Modo contingencia local activo'}`);
  await ensureDatabaseSeeded();
});
