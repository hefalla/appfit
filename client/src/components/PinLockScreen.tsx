import React, { useState } from 'react';
import { Lock, Delete, Dumbbell, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { storage } from '../services/storage';

interface PinLockScreenProps {
  onUnlock: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleKeyPress = async (digit: string) => {
    if (isLoading || pin.length >= 4) return;

    const newPin = pin + digit;
    setPin(newPin);
    setIsError(false);

    if (newPin.length === 4) {
      setIsLoading(true);
      try {
        const result = await api.verifyPin(newPin);
        if (result.success) {
          storage.setPinAuthenticated(true);
          onUnlock();
        } else {
          triggerError(result.message || 'PIN incorrecto');
        }
      } catch (err) {
        triggerError('Error al validar el PIN');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = () => {
    if (isLoading || pin.length === 0) return;
    setPin(pin.slice(0, -1));
    setIsError(false);
  };

  const triggerError = (msg: string) => {
    setIsError(true);
    setErrorMessage(msg);
    setTimeout(() => {
      setPin('');
      setIsError(false);
      setErrorMessage('');
    }, 900);
  };

  return (
    <div className="pin-view fade-in">
      {/* Top Branding */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
            marginBottom: '14px',
          }}
        >
          <Dumbbell size={32} color="#10b981" />
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          AppFit <span style={{ color: '#10b981' }}>Pro</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
          Asistente de Entrenamiento Diario
        </p>
      </div>

      {/* Middle: PIN indicators */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>
          <Lock size={15} color="#10b981" />
          <span>Ingresa tu PIN de acceso</span>
        </div>

        <div className={`pin-indicators ${isError ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`pin-dot ${pin.length > index ? 'filled' : ''} ${isError ? 'error' : ''}`}
            />
          ))}
        </div>

        {errorMessage && (
          <p style={{ color: '#f43f5e', fontSize: '0.82rem', fontWeight: 600, animation: 'fadeInScale 0.2s' }}>
            {errorMessage}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 14px',
            borderRadius: '16px',
            fontSize: '0.75rem',
            color: '#64748b',
            marginTop: '10px',
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>PIN por defecto de prueba: <strong>1234</strong></span>
        </div>
      </div>

      {/* Tactile Keypad */}
      <div className="pin-keypad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            className="pin-key"
            onClick={() => handleKeyPress(digit)}
            disabled={isLoading}
          >
            {digit}
          </button>
        ))}

        <div className="pin-key empty" />
        <button
          className="pin-key"
          onClick={() => handleKeyPress('0')}
          disabled={isLoading}
        >
          0
        </button>
        <button
          className="pin-key"
          onClick={handleDelete}
          disabled={isLoading || pin.length === 0}
          style={{ color: '#94a3b8' }}
          aria-label="Borrar dígito"
        >
          <Delete size={24} />
        </button>
      </div>
    </div>
  );
};
