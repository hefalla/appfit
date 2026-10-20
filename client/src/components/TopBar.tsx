import React from 'react';
import { Dumbbell, LogOut, Calendar, Zap } from 'lucide-react';

interface TopBarProps {
  onLock: () => void;
  activeMuscleName?: string;
  isTrainingActive?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onLock,
  activeMuscleName,
  isTrainingActive,
}) => {
  const today = new Date();
  const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' });
  const dateFormatted = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

  return (
    <header className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Dumbbell size={20} color="#10b981" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-display)' }}>
              AppFit
            </span>
            {isTrainingActive && (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Zap size={10} /> En Vivo
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '0.78rem' }}>
            <Calendar size={11} color="#64748b" />
            <span style={{ textTransform: 'capitalize' }}>
              {dayName}, {dateFormatted}
            </span>
            {activeMuscleName && (
              <>
                <span style={{ color: '#475569' }}>•</span>
                <span style={{ color: '#06b6d4', fontWeight: 600 }}>{activeMuscleName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onLock}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
        }}
        title="Bloquear sesión (PIN)"
        aria-label="Bloquear"
      >
        <LogOut size={17} />
      </button>
    </header>
  );
};
