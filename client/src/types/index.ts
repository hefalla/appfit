export interface Exercise {
  id: string;
  name: string;
  muscleGroupId: string;
  imageUrl: string;
  instructions: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeightKg: number;
  defaultRestSeconds: number;
}

export interface MuscleGroup {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  displayOrder: number;
  exercises?: Exercise[];
}

export interface WorkoutSetData {
  id?: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface ExerciseTrackingState {
  exerciseId: string;
  exerciseName: string;
  targetMuscle: string;
  imageUrl: string;
  instructions: string;
  isCustomOrAlternative?: boolean;
  alternativeInfo?: {
    reasonForAlternative: string;
    equipmentNeeded: string;
    executionTip: string;
  };
  sets: WorkoutSetData[];
}

export interface WorkoutSessionData {
  id: string;
  userId: string;
  muscleGroupId: string;
  muscleGroup?: MuscleGroup;
  date: string;
  completed: boolean;
  durationMinutes: number;
  totalSets: number;
  totalWeightKg: number;
  createdAt: string;
}

export interface MonthlyMetricsData {
  month: string;
  monthName: string;
  daysTrained: number;
  monthlyGoal: number;
  muscleDistribution: { name: string; count: number }[];
  totalMonthWeight: number;
  totalMonthSets: number;
}

export interface AlternativeExerciseAIResponse {
  exerciseName: string;
  targetMuscle: string;
  reasonForAlternative: string;
  recommendedSets: number;
  recommendedReps: string;
  equipmentNeeded: string;
  executionTip: string;
}
