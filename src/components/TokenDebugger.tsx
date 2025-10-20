import { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Componente de debugging para visualizar el estado del sistema de tokens
 * Solo debe usarse en desarrollo
 */
export const TokenDebugger = () => {
  const { accessToken, status } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Actualizar el tiempo restante cada segundo
  useEffect(() => {
    if (!accessToken) {
      setTimeLeft('Sin token');
      return;
    }

    const updateTimeLeft = () => {
      try {
        const decoded = jwtDecode<JWTPayload>(accessToken);
        const expirationTime = decoded.exp * 1000;
        const now = Date.now();
        const timeLeftMs = expirationTime - now;

        if (timeLeftMs <= 0) {
          setTimeLeft('⚠️ EXPIRADO');
          return;
        }

        const minutes = Math.floor(timeLeftMs / 60000);
        const seconds = Math.floor((timeLeftMs % 60000) / 1000);

        if (minutes > 5) {
          setTimeLeft(`✅ ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`⚠️ ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`🔴 ${seconds}s`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setTimeLeft('❌ Token inválido');
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [accessToken]);

  // Detectar actividad del usuario
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(new Date());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'click'];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 9999,
        minWidth: '280px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
        🔐 Token Debugger
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <strong>Token expira en:</strong> {timeLeft}
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <strong>Estado:</strong> {status}
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <strong>Última actividad:</strong> {lastActivity.toLocaleTimeString()}
      </div>

      <div
        style={{
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        💡 Solo detecta actividad EN esta ventana
      </div>
    </div>
  );
};

