import { Router, Request, Response } from 'express';
import { prisma } from '../services/db.js';

export const musclesRouter = Router();

// Day of week mapping (0: Sunday, 1: Monday, ..., 6: Saturday)
const DEFAULT_SPLIT: Record<number, string> = {
  1: 'pecho',    // Lunes
  2: 'espalda',  // Martes
  3: 'pierna',   // Miércoles
  4: 'hombro',   // Jueves
  5: 'brazo',    // Viernes
  6: 'core',     // Sábado
  0: 'pierna',   // Domingo
};

musclesRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const muscles = await prisma.muscleGroup.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        exercises: {
          orderBy: { name: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      data: muscles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener grupos musculares',
      error: (error as Error).message,
    });
  }
});

musclesRouter.get('/suggested-today', async (_req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const suggestedKey = DEFAULT_SPLIT[dayOfWeek] || 'pecho';

    // Find in DB
    const muscle = await prisma.muscleGroup.findFirst({
      where: { name: suggestedKey },
      include: {
        exercises: true,
      },
    });

    res.json({
      success: true,
      data: muscle,
      dayOfWeek,
      suggestedKey,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al calcular sugerencia del día',
      error: (error as Error).message,
    });
  }
});
