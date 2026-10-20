import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import type { MonthlyMetricsData } from '../types/index';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionSummary: {
    totalExercises: number;
    totalSets: number;
    totalWeightKg: number;
    durationMinutes: number;
    muscleName: string;
  };
  monthlyMetrics: MonthlyMetricsData | null;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  sessionSummary,
  monthlyMetrics,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const daysTrained = (monthlyMetrics?.daysTrained || 0) + 1;
  const goal = monthlyMetrics?.monthlyGoal || 20;
  const progressPct = Math.min(100, Math.round((daysTrained / goal) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="glass fade-in"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'linear-gradient(160deg, #0d1527 0%, #090e1a 100%)',
          borderRadius: '28px',
          border: '1.5px solid rgba(16, 185, 129, 0.45)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.25)',
          padding: '28px 22px 24px',
          textAlign: 'center',
        }}
      >
        {/* Trophy icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(245, 158, 11, 0.25))',
            border: '1.5px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)',
          }}
        >
          <Trophy size={34} color="#10b981" />
        </div>

        <h3 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#f8fafc', marginBottom: '4px' }}>
          ¡Entrenamiento Completado!
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
          Sesión de <strong>{sessionSummary.muscleName}</strong> finalizada con éxito.
        </p>

        {/* Workout Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '14px 10px',
            marginBottom: '18px',
          }}
        >
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>EJERCICIOS</div>
            <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.25rem' }}>
              {sessionSummary.totalExercises}
            </div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>SERIES</div>
            <div style={{ color: '#10b981', fontWeight: 800, fontSize: '1.25rem' }}>
              {sessionSummary.totalSets}
            </div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>VOLUMEN</div>
            <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.15rem' }}>
              {Math.round(sessionSummary.totalWeightKg)} <span style={{ fontSize: '0.75rem' }}>kg</span>
            </div>
          </div>
        </div>

        {/* Monthly Habit Achievement Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '20px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, fontSize: '0.84rem' }}>
              <Flame size={15} />
              <span>Consistencia Mensual</span>
            </div>
            <span style={{ color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 600 }}>
              {daysTrained} / {goal} días
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '6px',
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                borderRadius: '4px',
              }}
            />
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.76rem', margin: 0 }}>
            Llevas <strong>{daysTrained} días entrenados</strong> este mes. ¡Gran disciplina!
          </p>
        </div>

        {/* Close Button */}
        <button
          className="btn-primary"
          onClick={onClose}
          style={{
            minHeight: '50px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          }}
        >
          <CheckCircle size={18} />
          <span>Listo por hoy</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
