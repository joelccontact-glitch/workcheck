'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, LogIn, LogOut, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { isWithinZone, DEFAULT_WORK_ZONE } from '@/utils/geoUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface Log {
  type: 'check-in' | 'check-out';
  timestamp: string;
  location: string;
}

export default function AttendanceCard() {
  const { coords, loading, error, refresh } = useGeolocation();
  const [status, setStatus] = useState<'IDLE' | 'WORKING' | 'CHECKING'>('IDLE');
  const [lastAction, setLastAction] = useState<Log | null>(null);
  const [isInZone, setIsInZone] = useState(false);
  const [zone, setZone] = useState(DEFAULT_WORK_ZONE);

  const loadData = () => {
    const savedStatus = localStorage.getItem('attendance-status');
    const savedLastAction = localStorage.getItem('last-action');
    const savedZone = localStorage.getItem('work-zone');
    
    if (savedStatus) setStatus(savedStatus as any);
    if (savedLastAction) setLastAction(JSON.parse(savedLastAction));
    if (savedZone) setZone(JSON.parse(savedZone));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('zone-updated', loadData);
    return () => window.removeEventListener('zone-updated', loadData);
  }, []);

  useEffect(() => {
    if (coords) {
      const within = isWithinZone(
        coords.latitude,
        coords.longitude,
        zone.latitude,
        zone.longitude,
        zone.radius
      );
      setIsInZone(within);
    }
  }, [coords, zone]);

  const handleAction = (type: 'check-in' | 'check-out') => {
    if (!coords || !isInZone) return;

    setStatus('CHECKING');
    
    // Simulate API delay
    setTimeout(() => {
      const newLog: Log = {
        type,
        timestamp: new Date().toLocaleTimeString(),
        location: zone.name
      };

      const nextStatus = type === 'check-in' ? 'WORKING' : 'IDLE';
      setStatus(nextStatus);
      setLastAction(newLog);
      
      localStorage.setItem('attendance-status', nextStatus);
      localStorage.setItem('last-action', JSON.stringify(newLog));
      
      // Save to history log
      const history = JSON.parse(localStorage.getItem('attendance-history') || '[]');
      localStorage.setItem('attendance-history', JSON.stringify([newLog, ...history].slice(0, 10)));
      
      // Force refresh for parent
      window.dispatchEvent(new Event('attendance-updated'));
    }, 1500);
  };

  return (
    <div className="card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>근무 관리</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
            {new Date().toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ 
          padding: '0.5rem 0.75rem', 
          borderRadius: '2rem', 
          backgroundColor: status === 'WORKING' ? 'hsl(var(--success) / 0.1)' : 'hsl(var(--muted))',
          color: status === 'WORKING' ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem'
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: status === 'WORKING' ? 'hsl(var(--success))' : 'currentColor' }} />
          {status === 'WORKING' ? '근무 중' : '근무 종료'}
        </div>
      </div>

      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div className="flex-center" style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
            <MapPin size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>현재 위치</div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>
              {loading ? '위치 확인 중...' : isInZone ? DEFAULT_WORK_ZONE.name : '지정된 장소 밖'}
            </div>
          </div>
          {!loading && !isInZone && (
             <div style={{ marginLeft: 'auto', color: 'hsl(var(--destructive))', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
               <AlertCircle size={14} />
               출근 불가 지점
             </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="flex-center" style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>최근 기록</div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>
              {lastAction ? `${lastAction.type === 'check-in' ? '출근' : '퇴근'} ${lastAction.timestamp}` : '기록 없음'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button 
          className="btn btn-primary" 
          disabled={status !== 'IDLE' || !isInZone || loading}
          onClick={() => handleAction('check-in')}
          style={{ height: '3.5rem', width: '100%', fontSize: '1rem' }}
        >
          {status === 'CHECKING' && <Loader2 className="animate-spin" size={20} />}
          {status !== 'CHECKING' && <LogIn size={20} />}
          출근하기
        </button>
        <button 
          className="btn btn-outline" 
          disabled={status !== 'WORKING' || !isInZone || loading}
          onClick={() => handleAction('check-out')}
          style={{ height: '3.5rem', width: '100%', fontSize: '1rem' }}
        >
          {status === 'CHECKING' && <Loader2 className="animate-spin" size={20} />}
          {status !== 'CHECKING' && <LogOut size={20} />}
          퇴근하기
        </button>
      </div>

      {error && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius)', backgroundColor: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          {error}. 브라우저 설정을 확인해 주세요.
        </div>
      )}
    </div>
  );
}
