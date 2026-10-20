import { z } from 'zod';

export const VerifyPinSchema = z.object({
  pin: z.string().length(4, 'El PIN debe contener exactamente 4 dígitos').regex(/^\d{4}$/, 'El PIN debe ser numérico'),
});

export const AlternativeExerciseRequestSchema = z.object({
  exerciseName: z.string().min(1, 'Nombre del ejercicio requerido'),
  targetMuscle: z.string().min(1, 'Grupo muscular requerido'),
  reason: z.string().optional().default('Máquina ocupada'),
});

export const AlternativeExerciseResponseSchema = z.object({
  exerciseName: z.string().min(2),
  targetMuscle: z.string(),
  reasonForAlternative: z.string(),
  recommendedSets: z.number().int().positive(),
  recommendedReps: z.string(),
  equipmentNeeded: z.string(),
  executionTip: z.string(),
});

export type AlternativeExerciseResponse = z.infer<typeof AlternativeExerciseResponseSchema>;

export const SaveWorkoutSetSchema = z.object({
  sessionId: z.string().uuid(),
  exerciseId: z.string(),
  setNumber: z.number().int().positive(),
  weightKg: z.number().min(0),
  reps: z.number().int().min(0),
  isCompleted: z.boolean(),
});

export const CompleteSessionSchema = z.object({
  sessionId: z.string().uuid(),
  durationMinutes: z.number().int().min(0).optional().default(45),
});

export const StartSessionSchema = z.object({
  muscleGroupId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
});
