import React, { useState } from 'react';
import type { ExerciseTrackingState, WorkoutSetData } from '../types/index';
import { Sparkles, Info, Check, Plus, Minus, ChevronDown, ChevronUp, Bot } from 'lucide-react';

interface ExerciseCardProps {
  exercise: ExerciseTrackingState;
  onSetChange: (exerciseId: string, setIndex: number, updatedSet: WorkoutSetData) => void;
  onAddSet: (exerciseId: string) => void;
  onRequestAiAlternative: (exercise: ExerciseTrackingState) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onSetChange,
  onAddSet,
  onRequestAiAlternative,
}) => {
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  const completedSetsCount = exercise.sets.filter((s) => s.isCompleted).length;
  const isAllCompleted = completedSetsCount === exercise.sets.length && exercise.sets.length > 0;

  const handleWeightStep = (setIndex: number, delta: number) => {
    const current = exercise.sets[setIndex];
    const newWeight = Math.max(0, Math.round((current.weightKg + delta) * 10) / 10);
    onSetChange(exercise.exerciseId, setIndex, {
      ...current,
      weightKg: newWeight,
    });
  };

  const handleRepsStep = (setIndex: number, delta: number) => {
    const current = exercise.sets[setIndex];
    const newReps = Math.max(1, current.reps + delta);
    onSetChange(exercise.exerciseId, setIndex, {
      ...current,
      reps: newReps,
    });
  };

  const handleToggleComplete = (setIndex: number) => {
    const current = exercise.sets[setIndex];
    onSetChange(exercise.exerciseId, setIndex, {
      ...current,
      isCompleted: !current.isCompleted,
      completedAt: !current.isCompleted ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div className={`exercise-card ${isAllCompleted ? 'active' : ''} fade-in`}>
      {/* Exercise Image Banner */}
      <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden' }}>
        <img
          src={exercise.imageUrl}
          alt={exercise.exerciseName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80';
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #111a2e 0%, rgba(17, 26, 46, 0.4) 60%, transparent 100%)',
          }}
        />

        {/* Badges on top */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: '12px',
              color: '#34d399',
              fontSize: '0.74rem',
              fontWeight: 700,
              border: '1px solid rgba(52, 211, 153, 0.3)',
            }}
          >
            {exercise.targetMuscle}
          </span>
          {exercise.isCustomOrAlternative && (
            <span
              style={{
                background: 'rgba(139, 92, 246, 0.8)',
                backdropFilter: 'blur(8px)',
                padding: '4px 8px',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Bot size={11} /> Alternativa IA
            </span>
          )}
        </div>

        {/* Progress pill */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: '12px',
            color: isAllCompleted ? '#10b981' : '#94a3b8',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: isAllCompleted ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {completedSetsCount} / {exercise.sets.length} series
        </div>

        {/* Bottom title inside banner */}
        <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.25 }}>
            {exercise.exerciseName}
          </h3>
        </div>
      </div>

      {/* Body content */}
      <div style={{ padding: '12px 10px' }}>
        {/* Quick action bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            gap: '6px',
          }}
        >
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              fontSize: '0.76rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 0',
            }}
          >
            <Info size={13} color="#06b6d4" />
            <span>Instrucciones</span>
            {showInstructions ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {/* AI Alternative button */}
          <button
            onClick={() => onRequestAiAlternative(exercise)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(139, 92, 246, 0.45)',
              color: '#c084fc',
              padding: '5px 10px',
              borderRadius: '10px',
              fontSize: '0.73rem',
              fontWeight: 700,
              boxShadow: '0 2px 10px rgba(139, 92, 246, 0.15)',
            }}
            title="Sustituir si la máquina está ocupada"
          >
            <Sparkles size={12} color="#c084fc" />
            <span>Alternativa IA</span>
          </button>
        </div>

        {/* Instructions dropdown */}
        {showInstructions && (
          <div
            className="fade-in"
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '14px',
              fontSize: '0.82rem',
              color: '#e2e8f0',
              lineHeight: 1.45,
            }}
          >
            <p>{exercise.instructions}</p>
            {exercise.alternativeInfo && (
              <div style={{ marginTop: '8px', borderTop: '1px solid rgba(6, 182, 212, 0.2)', paddingTop: '6px' }}>
                <p style={{ color: '#c084fc', fontWeight: 600 }}>💡 Consejo del entrenador IA:</p>
                <p style={{ color: '#cbd5e1' }}>{exercise.alternativeInfo.executionTip}</p>
              </div>
            )}
          </div>
        )}

        {/* Sets table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '22px 1fr 1fr 38px',
            gap: '6px',
            padding: '0 8px 6px',
            color: '#64748b',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <div>#</div>
          <div style={{ textAlign: 'center' }}>Peso (kg)</div>
          <div style={{ textAlign: 'center' }}>Reps</div>
          <div style={{ textAlign: 'center' }}>Listo</div>
        </div>

        {/* Set Rows */}
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className={`set-row ${set.isCompleted ? 'completed' : ''}`}>
            <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.78rem' }}>
              #{set.setNumber}
            </div>

            {/* Weight stepper */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <button
                className="stepper-btn"
                onClick={() => handleWeightStep(setIndex, -2.5)}
                disabled={set.isCompleted}
                aria-label="Restar 2.5 kg"
              >
                <Minus size={13} />
              </button>
              <div
                style={{
                  minWidth: '34px',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: set.isCompleted ? '#10b981' : '#f8fafc',
                }}
              >
                {set.weightKg}
              </div>
              <button
                className="stepper-btn"
                onClick={() => handleWeightStep(setIndex, 2.5)}
                disabled={set.isCompleted}
                aria-label="Sumar 2.5 kg"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Reps stepper */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <button
                className="stepper-btn"
                onClick={() => handleRepsStep(setIndex, -1)}
                disabled={set.isCompleted}
                aria-label="Restar 1 rep"
              >
                <Minus size={13} />
              </button>
              <div
                style={{
                  minWidth: '26px',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: set.isCompleted ? '#10b981' : '#f8fafc',
                }}
              >
                {set.reps}
              </div>
              <button
                className="stepper-btn"
                onClick={() => handleRepsStep(setIndex, 1)}
                disabled={set.isCompleted}
                aria-label="Sumar 1 rep"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Checkmark Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                className={`check-btn ${set.isCompleted ? 'checked' : ''}`}
                onClick={() => handleToggleComplete(setIndex)}
                aria-label="Marcar serie como realizada"
              >
                <Check size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Set button */}
        <button
          onClick={() => onAddSet(exercise.exerciseId)}
          style={{
            width: '100%',
            padding: '8px',
            marginTop: '8px',
            background: 'transparent',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            color: '#94a3b8',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Plus size={14} />
          <span>Agregar otra serie</span>
        </button>
      </div>
    </div>
  );
};
