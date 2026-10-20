import React from 'react';
import type { MonthlyMetricsData } from '../types/index';
import { BarChart3, Dumbbell, Flame, CheckCircle2 } from 'lucide-react';

interface MonthlyMetricsCardProps {
  metrics: MonthlyMetricsData | null;
  onRefresh?: () => void;
}

const MUSCLE_COLORS: Record<string, string> = {
  Pecho: '#10b981',
  Espalda: '#06b6d4',
  Pierna: '#f59e0b',
  Hombro: '#8b5cf6',
  Brazo: '#ec4899',
  'Core y Estabilidad': '#3b82f6',
  Core: '#3b82f6',
};

export const MonthlyMetricsCard: React.FC<MonthlyMetricsCardProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="glass" style={{ margin: '16px', padding: '20px', borderRadius: '20px' }}>
        <div className="skeleton" style={{ height: '24px', width: '40%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '60px', width: '100%' }} />
      </div>
    );
  }

  const daysTrained = metrics.daysTrained || 0;
  const goal = metrics.monthlyGoal || 20;
  const percentage = Math.min(100, Math.round((daysTrained / goal) * 100));

  return (
    <div
      className="glass fade-in"
      style={{
        margin: '16px',
        padding: '20px',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChart3 size={17} color="#06b6d4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              Balance Mensual
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.74rem', textTransform: 'capitalize' }}>
              {metrics.monthName || 'Mes en curso'}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '4px 10px',
            color: '#10b981',
            fontSize: '0.76rem',
            fontWeight: 700,
          }}
        >
          <Flame size={13} />
          <span>{daysTrained} / {goal} días</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
          <span>Meta mensual de constancia</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>{percentage}% completado</span>
        </div>
        <div
          style={{
            height: '8px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #10b981, #06b6d4)',
              borderRadius: '4px',
              transition: 'width 0.8s ease',
            }}
          />
        </div>
      </div>

      {/* Volume Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '12px',
          borderRadius: '14px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dumbbell size={18} color="#06b6d4" />
          <div>
            <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>VOLUMEN TOTAL</div>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.92rem' }}>
              {Math.round(metrics.totalMonthWeight || 0).toLocaleString()} kg
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <div>
            <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>SERIES TOTALES</div>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.92rem' }}>
              {metrics.totalMonthSets || 0} series
            </div>
          </div>
        </div>
      </div>

      {/* Muscle Distribution Breakdown */}
      <div>
        <h4 style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700, marginBottom: '10px' }}>
          Distribución por Grupo Muscular
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {metrics.muscleDistribution.map((item) => {
            const color = MUSCLE_COLORS[item.name] || '#10b981';
            const maxCount = Math.max(...metrics.muscleDistribution.map((m) => m.count), 1);
            const itemPct = Math.round((item.count / maxCount) * 100);

            return (
              <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: '#94a3b8' }}>
                    {item.count} {item.count === 1 ? 'sesión' : 'sesiones'}
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${itemPct}%`,
                      background: color,
                      borderRadius: '3px',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
