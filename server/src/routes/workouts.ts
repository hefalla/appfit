import { Router, Request, Response } from 'express';
import { prisma } from '../services/db.js';
import { SaveWorkoutSetSchema, CompleteSessionSchema, StartSessionSchema } from '../schemas/index.js';

export const workoutsRouter = Router();

// Helper to get formatted local date YYYY-MM-DD
function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get or ensure default user
async function getDefaultUserId(): Promise<string> {
  const user = await prisma.user.findFirst();
  if (user) return user.id;

  const newUser = await prisma.user.create({
    data: {
      id: 'owner-user',
      pinHash: '$2a$10$dummyHashForDevModePin1234',
    },
  });
  return newUser.id;
}

// Get active or today's session
workoutsRouter.get('/today', async (_req: Request, res: Response): Promise<void> => {
  try {
    const today = getLocalDateString();
    const userId = await getDefaultUserId();

    const session = await prisma.workoutSession.findFirst({
      where: {
        userId,
        date: today,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        muscleGroup: true,
        sets: {
          include: {
            exercise: true,
          },
          orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
        },
      },
    });

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al recuperar la sesión de hoy',
      error: (error as Error).message,
    });
  }
});

// Start or retrieve a session for a given muscle group
workoutsRouter.post('/start', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = StartSessionSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || 'Datos inválidos',
      });
      return;
    }

    const { muscleGroupId, date } = parseResult.data;
    const userId = await getDefaultUserId();

    // Check if a session already exists for this date and muscle
    let session = await prisma.workoutSession.findFirst({
      where: {
        userId,
        date,
      },
      include: {
        muscleGroup: true,
        sets: {
          include: { exercise: true },
          orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
        },
      },
    });

    if (!session) {
      session = await prisma.workoutSession.create({
        data: {
          userId,
          muscleGroupId,
          date,
          completed: false,
        },
        include: {
          muscleGroup: true,
          sets: {
            include: { exercise: true },
            orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
          },
        },
      });
    } else if (session.muscleGroupId !== muscleGroupId && !session.completed) {
      // If user switches muscle group before completing
      session = await prisma.workoutSession.update({
        where: { id: session.id },
        data: { muscleGroupId },
        include: {
          muscleGroup: true,
          sets: {
            include: { exercise: true },
            orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
          },
        },
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión de entrenamiento',
      error: (error as Error).message,
    });
  }
});

// Save or toggle a set
workoutsRouter.post('/set', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = SaveWorkoutSetSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || 'Datos del set inválidos',
      });
      return;
    }

    const { sessionId, exerciseId, setNumber, weightKg, reps, isCompleted } = parseResult.data;

    // Check existing set
    const existing = await prisma.workoutSet.findFirst({
      where: {
        workoutSessionId: sessionId,
        exerciseId,
        setNumber,
      },
    });

    let savedSet;
    if (existing) {
      savedSet = await prisma.workoutSet.update({
        where: { id: existing.id },
        data: {
          weightKg,
          reps,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      });
    } else {
      savedSet = await prisma.workoutSet.create({
        data: {
          workoutSessionId: sessionId,
          exerciseId,
          setNumber,
          weightKg,
          reps,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      });
    }

    // Recalculate totals for session
    const allCompletedSets = await prisma.workoutSet.findMany({
      where: {
        workoutSessionId: sessionId,
        isCompleted: true,
      },
    });

    const totalSets = allCompletedSets.length;
    const totalWeightKg = allCompletedSets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);

    await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        totalSets,
        totalWeightKg,
      },
    });

    res.json({
      success: true,
      data: savedSet,
      totals: {
        totalSets,
        totalWeightKg,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al guardar la serie de entrenamiento',
      error: (error as Error).message,
    });
  }
});

// Complete workout session
workoutsRouter.post('/complete', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = CompleteSessionSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || 'Datos inválidos',
      });
      return;
    }

    const { sessionId, durationMinutes } = parseResult.data;

    const completedSession = await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        durationMinutes,
      },
      include: {
        muscleGroup: true,
        sets: {
          include: { exercise: true },
        },
      },
    });

    res.json({
      success: true,
      data: completedSession,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al finalizar la sesión',
      error: (error as Error).message,
    });
  }
});

// Monthly metrics: trained days, muscle distribution
workoutsRouter.get('/metrics/monthly', async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const monthPrefix = `${currentYear}-${currentMonth}`; // e.g. "2026-10"

    const sessions = await prisma.workoutSession.findMany({
      where: {
        date: {
          startsWith: monthPrefix,
        },
        OR: [{ completed: true }, { totalSets: { gt: 0 } }],
      },
      include: {
        muscleGroup: true,
      },
    });

    // Unique days trained
    const uniqueDates = new Set(sessions.map((s) => s.date));
    const daysTrained = uniqueDates.size;

    // Breakdown by muscle group
    const muscleMap: Record<string, { name: string; count: number; color?: string }> = {};
    for (const s of sessions) {
      const mName = s.muscleGroup?.displayName || 'Otros';
      if (!muscleMap[mName]) {
        muscleMap[mName] = { name: mName, count: 0 };
      }
      muscleMap[mName].count += 1;
    }

    const muscleDistribution = Object.values(muscleMap);

    // Total weight and total sets in month
    const totalMonthWeight = sessions.reduce((sum, s) => sum + s.totalWeightKg, 0);
    const totalMonthSets = sessions.reduce((sum, s) => sum + s.totalSets, 0);

    res.json({
      success: true,
      data: {
        month: monthPrefix,
        monthName: now.toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
        daysTrained,
        monthlyGoal: 20,
        muscleDistribution,
        totalMonthWeight,
        totalMonthSets,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al calcular métricas mensuales',
      error: (error as Error).message,
    });
  }
});
