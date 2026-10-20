import { Router, Request, Response } from 'express';
import { AlternativeExerciseRequestSchema } from '../schemas/index.js';
import { generateAlternativeExercise } from '../services/aiService.js';

export const aiRouter = Router();

aiRouter.post('/alternative-exercise', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = AlternativeExerciseRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || 'Datos de solicitud inválidos',
      });
      return;
    }

    const { exerciseName, targetMuscle, reason } = parseResult.data;
    const alternative = await generateAlternativeExercise(exerciseName, targetMuscle, reason);

    res.json({
      success: true,
      data: alternative,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar ejercicio alternativo',
      error: (error as Error).message,
    });
  }
});
