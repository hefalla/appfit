import { useState, useEffect } from 'react';
import { PinLockScreen } from './components/PinLockScreen';
import { TopBar } from './components/TopBar';
import { DailySuggestionCard } from './components/DailySuggestionCard';
import { MuscleSelectorModal } from './components/MuscleSelectorModal';
import { ExerciseCard } from './components/ExerciseCard';
import { AiAlternativeModal } from './components/AiAlternativeModal';
import { CelebrationModal } from './components/CelebrationModal';
import { MonthlyMetricsCard } from './components/MonthlyMetricsCard';
import { api } from './services/api';
import { storage } from './services/storage';
import type {
  MuscleGroup,
  ExerciseTrackingState,
  WorkoutSetData,
  MonthlyMetricsData,
  AlternativeExerciseAIResponse,
} from './types/index';
import { Dumbbell, BarChart2, CheckCircle, Flame } from 'lucide-react';

export function App() {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storage.isPinAuthenticated());

  // Views & Modals
  const [currentTab, setCurrentTab] = useState<'workout' | 'metrics'>('workout');
  const [isMuscleModalOpen, setIsMuscleModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);

  // Data
  const [allMuscles, setAllMuscles] = useState<MuscleGroup[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState<boolean>(true);
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Exercise tracking in progress (Crash-Proof)
  const [exercisesState, setExercisesState] = useState<ExerciseTrackingState[]>([]);

  // AI Alternative state
  const [selectedExerciseForAi, setSelectedExerciseForAi] = useState<ExerciseTrackingState | null>(null);
  const [aiAlternativeResult, setAiAlternativeResult] = useState<AlternativeExerciseAIResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Monthly metrics & summary
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetricsData | null>(null);
  const [sessionSummary, setSessionSummary] = useState({
    totalExercises: 0,
    totalSets: 0,
    totalWeightKg: 0,
    durationMinutes: 45,
    muscleName: '',
  });

  // Load initial data upon authentication
  useEffect(() => {
    if (!isAuthenticated) return;

    const initialize = async () => {
      try {
        setIsLoadingSuggestion(true);
        const muscles = await api.getMuscles();
        setAllMuscles(muscles);

        const metrics = await api.getMonthlyMetrics();
        setMonthlyMetrics(metrics);

        const cachedExercises = storage.getTrackingState();
        const cachedSession = storage.getActiveSession();

        if (cachedExercises && cachedExercises.length > 0 && cachedSession) {
          setExercisesState(cachedExercises);
          setActiveSessionId(cachedSession.id);
          setIsWorkoutActive(true);

          const matchingMuscle = muscles.find((m) => m.id === cachedSession.muscleGroupId);
          if (matchingMuscle) setSelectedMuscle(matchingMuscle);
        } else {
          const suggestion = await api.getSuggestedToday();
          if (suggestion.muscle) {
            setSelectedMuscle(suggestion.muscle);
          } else if (muscles.length > 0) {
            setSelectedMuscle(muscles[0]);
          }
        }
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        setIsLoadingSuggestion(false);
      }
    };

    initialize();
  }, [isAuthenticated]);

  // Persist tracking state crash-proof whenever it changes
  useEffect(() => {
    if (isWorkoutActive && exercisesState.length > 0) {
      storage.setTrackingState(exercisesState);
    }
  }, [exercisesState, isWorkoutActive]);

  const handleLock = () => {
    storage.setPinAuthenticated(false);
    setIsAuthenticated(false);
  };

  const handleStartWorkout = async () => {
    if (!selectedMuscle) return;

    const todayDate = new Date().toISOString().split('T')[0];
    const session = await api.startSession(selectedMuscle.id, todayDate);

    const sessionId = session?.id || `local_session_${Date.now()}`;
    setActiveSessionId(sessionId);
    storage.setActiveSession({ id: sessionId, muscleGroupId: selectedMuscle.id });

    const initialExercises: ExerciseTrackingState[] = (selectedMuscle.exercises || []).map((ex) => {
      const sets: WorkoutSetData[] = [];
      const count = ex.defaultSets || 3;
      for (let i = 1; i <= count; i++) {
        sets.push({
          setNumber: i,
          weightKg: ex.defaultWeightKg || 20,
          reps: ex.defaultReps || 10,
          isCompleted: false,
        });
      }
      return {
        exerciseId: ex.id,
        exerciseName: ex.name,
        targetMuscle: selectedMuscle.displayName,
        imageUrl: ex.imageUrl,
        instructions: ex.instructions,
        sets,
      };
    });

    setExercisesState(initialExercises);
    storage.setTrackingState(initialExercises);
    setIsWorkoutActive(true);
  };

  const handleSetChange = async (
    exerciseId: string,
    setIndex: number,
    updatedSet: WorkoutSetData
  ) => {
    const nextExercises = exercisesState.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const newSets = [...ex.sets];
      newSets[setIndex] = updatedSet;
      return { ...ex, sets: newSets };
    });

    setExercisesState(nextExercises);
    storage.setTrackingState(nextExercises);

    if (activeSessionId) {
      api.saveSet({
        sessionId: activeSessionId,
        exerciseId,
        setNumber: updatedSet.setNumber,
        weightKg: updatedSet.weightKg,
        reps: updatedSet.reps,
        isCompleted: updatedSet.isCompleted,
      });
    }
  };

  const handleAddSet = (exerciseId: string) => {
    const nextExercises = exercisesState.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSetNumber = ex.sets.length + 1;
      const newSet: WorkoutSetData = {
        setNumber: newSetNumber,
        weightKg: lastSet ? lastSet.weightKg : 20,
        reps: lastSet ? lastSet.reps : 10,
        isCompleted: false,
      };
      return { ...ex, sets: [...ex.sets, newSet] };
    });
    setExercisesState(nextExercises);
  };

  const handleRequestAiAlternative = async (exercise: ExerciseTrackingState) => {
    setSelectedExerciseForAi(exercise);
    setAiAlternativeResult(null);
    setIsAiLoading(true);
    setIsAiModalOpen(true);

    try {
      const alt = await api.getAiAlternative(exercise.exerciseName, exercise.targetMuscle);
      setAiAlternativeResult(alt);
    } catch (e) {
      console.warn('Error fetching alternative:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAlternative = (alt: AlternativeExerciseAIResponse) => {
    if (!selectedExerciseForAi) return;

    const nextExercises = exercisesState.map((ex) => {
      if (ex.exerciseId !== selectedExerciseForAi.exerciseId) return ex;
      return {
        ...ex,
        exerciseName: alt.exerciseName,
        instructions: alt.reasonForAlternative + ' ' + alt.executionTip,
        isCustomOrAlternative: true,
        alternativeInfo: {
          reasonForAlternative: alt.reasonForAlternative,
          equipmentNeeded: alt.equipmentNeeded,
          executionTip: alt.executionTip,
        },
      };
    });

    setExercisesState(nextExercises);
    storage.setTrackingState(nextExercises);
    setIsAiModalOpen(false);
  };

  const handleCompleteWorkout = async () => {
    let completedSetsCount = 0;
    let totalVolume = 0;

    for (const ex of exercisesState) {
      for (const s of ex.sets) {
        if (s.isCompleted) {
          completedSetsCount++;
          totalVolume += s.weightKg * s.reps;
        }
      }
    }

    const summary = {
      totalExercises: exercisesState.length,
      totalSets: completedSetsCount,
      totalWeightKg: totalVolume,
      durationMinutes: 50,
      muscleName: selectedMuscle?.displayName || 'Cuerpo Completo',
    };

    setSessionSummary(summary);

    if (activeSessionId) {
      await api.completeSession(activeSessionId, 50);
    }

    const updatedMetrics = await api.getMonthlyMetrics();
    setMonthlyMetrics(updatedMetrics);

    storage.clearActiveWorkout();
    setIsWorkoutActive(false);
    setExercisesState([]);
    setActiveSessionId(null);
    setIsCelebrationOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <main className="app-container">
        <PinLockScreen onUnlock={() => setIsAuthenticated(true)} />
      </main>
    );
  }

  const completedSetsCount = exercisesState.reduce(
    (total, ex) => total + ex.sets.filter((s) => s.isCompleted).length,
    0
  );

  return (
    <main className="app-container">
      <TopBar
        onLock={handleLock}
        activeMuscleName={selectedMuscle?.displayName}
        isTrainingActive={isWorkoutActive}
      />

      <nav
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding: '10px 16px',
          gap: '8px',
          background: 'rgba(11, 17, 30, 0.6)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={() => setCurrentTab('workout')}
          style={{
            padding: '10px',
            borderRadius: '12px',
            background: currentTab === 'workout' ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
            border: currentTab === 'workout' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent',
            color: currentTab === 'workout' ? '#10b981' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Dumbbell size={16} />
          <span>Rutina de Hoy</span>
        </button>

        <button
          onClick={() => setCurrentTab('metrics')}
          style={{
            padding: '10px',
            borderRadius: '12px',
            background: currentTab === 'metrics' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
            border: currentTab === 'metrics' ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid transparent',
            color: currentTab === 'metrics' ? '#06b6d4' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <BarChart2 size={16} />
          <span>Métricas del Mes</span>
        </button>
      </nav>

      {currentTab === 'workout' && (
        <div style={{ flex: 1, paddingBottom: '90px' }}>
          {!isWorkoutActive ? (
            <>
              <DailySuggestionCard
                suggestedMuscle={selectedMuscle}
                onChangeMuscleClick={() => setIsMuscleModalOpen(true)}
                onStartWorkout={handleStartWorkout}
                isLoading={isLoadingSuggestion}
              />
              <MonthlyMetricsCard metrics={monthlyMetrics} />
            </>
          ) : (
            <div style={{ padding: '12px 10px 20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <div style={{ color: '#10b981', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Entrenamiento en Curso
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 800 }}>
                    {selectedMuscle?.displayName}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    color: '#38bdf8',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  {completedSetsCount} series listas
                </div>
              </div>

              {exercisesState.map((ex) => (
                <ExerciseCard
                  key={ex.exerciseId}
                  exercise={ex}
                  onSetChange={handleSetChange}
                  onAddSet={handleAddSet}
                  onRequestAiAlternative={handleRequestAiAlternative}
                />
              ))}

              <div style={{ marginTop: '24px' }}>
                <button
                  className="btn-primary"
                  onClick={handleCompleteWorkout}
                  style={{
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5)',
                  }}
                >
                  <CheckCircle size={20} strokeWidth={2.5} />
                  <span>Terminar Entrenamiento</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {currentTab === 'metrics' && (
        <div style={{ flex: 1, paddingBottom: '40px' }}>
          <MonthlyMetricsCard metrics={monthlyMetrics} />

          <div
            className="glass fade-in"
            style={{
              margin: '0 16px 20px',
              padding: '20px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.12))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#c084fc', fontWeight: 700 }}>
              <Flame size={18} />
              <span>Constancia de Acero</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.45 }}>
              Cada sesión suma a tu salud, hipertrofia y disciplina. Mantén el balance entre empuje, jalón y pierna para un desarrollo simétrico.
            </p>
          </div>
        </div>
      )}

      <MuscleSelectorModal
        isOpen={isMuscleModalOpen}
        onClose={() => setIsMuscleModalOpen(false)}
        muscles={allMuscles}
        selectedId={selectedMuscle?.id || ''}
        onSelectMuscle={(m) => setSelectedMuscle(m)}
      />

      <AiAlternativeModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        originalExerciseName={selectedExerciseForAi?.exerciseName || ''}
        targetMuscle={selectedExerciseForAi?.targetMuscle || ''}
        alternativeData={aiAlternativeResult}
        isLoading={isAiLoading}
        onApplyAlternative={handleApplyAlternative}
      />

      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        sessionSummary={sessionSummary}
        monthlyMetrics={monthlyMetrics}
      />
    </main>
  );
}

export default App;
