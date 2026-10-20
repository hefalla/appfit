import React from 'react';
import type { AlternativeExerciseAIResponse } from '../types/index';
import { Sparkles, X, Check, ShieldAlert, Zap } from 'lucide-react';

interface AiAlternativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalExerciseName: string;
  targetMuscle: string;
  alternativeData: AlternativeExerciseAIResponse | null;
  isLoading: boolean;
  onApplyAlternative: (alt: AlternativeExerciseAIResponse) => void;
}

export const AiAlternativeModal: React.FC<AiAlternativeModalProps> = ({
  isOpen,
  onClose,
  originalExerciseName,
  targetMuscle,
  alternativeData,
  isLoading,
  onApplyAlternative,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        zIndex: 110,
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
          borderTop: '1px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 -10px 40px rgba(139, 92, 246, 0.2)',
          padding: '24px 20px 32px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Alternativa Inteligente
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                Asistido por IA Gemini para {targetMuscle}
              </p>
            </div>
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

        {/* Loading state */}
        {isLoading && (
          <div style={{ padding: '30px 10px', textAlign: 'center' }}>
            <div
              className="animate-glow"
              style={{
                width: '56px',
                height: '56px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                border: '3px solid #8b5cf6',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
              }}
            />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              Consultando entrenador IA...
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              Buscando el mejor sustituto biomecánico para {originalExerciseName}...
            </p>
          </div>
        )}

        {/* Loaded alternative state */}
        {!isLoading && alternativeData && (
          <div className="fade-in">
            {/* Context tag */}
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '12px',
                padding: '8px 12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#fda4af',
              }}
            >
              <ShieldAlert size={16} />
              <span>Sustituyendo: <strong>{originalExerciseName}</strong></span>
            </div>

            {/* Alternative Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(23, 35, 62, 0.9), rgba(15, 23, 42, 0.95))',
                border: '1.5px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '18px',
                padding: '18px',
                marginBottom: '18px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#c084fc',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                <Zap size={11} /> Ejercicio Sugerido
              </div>

              <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
                {alternativeData.exerciseName}
              </h4>

              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.45, marginBottom: '14px' }}>
                {alternativeData.reasonForAlternative}
              </p>

              {/* Specs Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                  borderRadius: '12px',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>SERIES / REPS</div>
                  <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
                    {alternativeData.recommendedSets} series × {alternativeData.recommendedReps}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>EQUIPAMIENTO</div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.85rem' }}>
                    {alternativeData.equipmentNeeded}
                  </div>
                </div>
              </div>

              {/* Execution Tip */}
              <div
                style={{
                  borderLeft: '3px solid #10b981',
                  paddingLeft: '10px',
                  fontSize: '0.82rem',
                  color: '#e2e8f0',
                }}
              >
                <span style={{ color: '#10b981', fontWeight: 700 }}>Técnica recomendada: </span>
                {alternativeData.executionTip}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                onClick={onClose}
                style={{ flex: '1', minHeight: '48px' }}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={() => onApplyAlternative(alternativeData)}
                style={{
                  flex: '2',
                  minHeight: '48px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                }}
              >
                <Check size={18} strokeWidth={2.5} />
                <span>Aplicar Alternativa</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
