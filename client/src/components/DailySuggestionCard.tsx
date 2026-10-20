import React from 'react';
import type { MuscleGroup } from '../types/index';
import { Play, RefreshCw, Flame, ChevronRight } from 'lucide-react';

interface DailySuggestionCardProps {
  suggestedMuscle: MuscleGroup | null;
  onChangeMuscleClick: () => void;
  onStartWorkout: () => void;
  isLoading?: boolean;
}

export const DailySuggestionCard: React.FC<DailySuggestionCardProps> = ({
  suggestedMuscle,
  onChangeMuscleClick,
  onStartWorkout,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="glass" style={{ borderRadius: '24px', padding: '24px', margin: '20px' }}>
        <div className="skeleton" style={{ height: '24px', width: '50%', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '36px', width: '80%', marginBottom: '20px' }} />
        <div className="skeleton" style={{ height: '52px', width: '100%' }} />
      </div>
    );
  }

  const exerciseCount = suggestedMuscle?.exercises?.length || 4;

  return (
    <div
      className="glass fade-in"
      style={{
        borderRadius: '24px',
        padding: '24px',
        margin: '16px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(17, 26, 46, 0.85) 0%, rgba(13, 21, 38, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.5), 0 0 25px rgba(16, 185, 129, 0.1)',
      }}
    >
      {/* Decorative Glow Orb */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <Flame size={13} /> Sugerencia de Hoy
        </div>

        <button
          onClick={onChangeMuscleClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1',
            padding: '5px 12px',
            borderRadius: '12px',
            fontSize: '0.76rem',
            fontWeight: 600,
          }}
        >
          <RefreshCw size={12} />
          Cambiar músculo
        </button>
      </div>

      <div style={{ margin: '14px 0 20px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
          {suggestedMuscle ? suggestedMuscle.displayName : 'Cargando rutina...'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.4 }}>
          Rutina optimizada con {exerciseCount} ejercicios clave de hipertrofia y fuerza.
        </p>
      </div>

      {/* Exercise preview pills */}
      {suggestedMuscle?.exercises && suggestedMuscle.exercises.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
          {suggestedMuscle.exercises.slice(0, 3).map((ex) => (
            <span
              key={ex.id}
              style={{
                fontSize: '0.74rem',
                color: '#cbd5e1',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '4px 10px',
                borderRadius: '8px',
              }}
            >
              {ex.name}
            </span>
          ))}
          {suggestedMuscle.exercises.length > 3 && (
            <span
              style={{
                fontSize: '0.74rem',
                color: '#06b6d4',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              +{suggestedMuscle.exercises.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* Start Button */}
      <button className="btn-primary" onClick={onStartWorkout}>
        <Play size={18} fill="#ffffff" />
        <span>Empezar Rutina de Hoy</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
