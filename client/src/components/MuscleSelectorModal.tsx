import React from 'react';
import type { MuscleGroup } from '../types/index';
import { X, Shield, Layers, Activity, Target, Zap, Compass, Check } from 'lucide-react';

interface MuscleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  muscles: MuscleGroup[];
  selectedId: string;
  onSelectMuscle: (muscle: MuscleGroup) => void;
}

const getMuscleIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'pecho':
      return <Shield size={22} color="#10b981" />;
    case 'espalda':
      return <Layers size={22} color="#06b6d4" />;
    case 'pierna':
      return <Activity size={22} color="#f59e0b" />;
    case 'hombro':
      return <Target size={22} color="#8b5cf6" />;
    case 'brazo':
      return <Zap size={22} color="#ec4899" />;
    case 'core':
    default:
      return <Compass size={22} color="#3b82f6" />;
  }
};

export const MuscleSelectorModal: React.FC<MuscleSelectorModalProps> = ({
  isOpen,
  onClose,
  muscles,
  selectedId,
  onSelectMuscle,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        className="glass fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#0d1527',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '24px 20px 32px',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Selecciona Músculo de Hoy
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              Elige el grupo que deseas entrenar en esta jornada
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {muscles.map((muscle) => {
            const isSelected = muscle.id === selectedId;
            return (
              <button
                key={muscle.id}
                onClick={() => {
                  onSelectMuscle(muscle);
                  onClose();
                }}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(6, 182, 212, 0.15))'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '16px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  boxShadow: isSelected ? '0 0 18px rgba(16, 185, 129, 0.2)' : 'none',
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#10b981',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                <div>{getMuscleIcon(muscle.name)}</div>
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.98rem' }}>
                    {muscle.displayName}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.74rem' }}>
                    {muscle.exercises?.length || 4} ejercicios
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
