'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Timer } from 'lucide-react';

interface WorkTimerProps {
  checkInTime: string | null;
  workEndTime: string;
}

export default function WorkTimer({ checkInTime, workEndTime }: WorkTimerProps) {
  const [elapsed, setElapsed] = useState('00:00:00');
  const [remaining, setRemaining] = useState('00:00:00');

  useEffect(() => {
    if (!checkInTime) {
      setElapsed('00:00:00');
      setRemaining('--:--:--');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(checkInTime);
      
      // Elapsed
      const diff = now.getTime() - start.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsed(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

      // Remaining until work_end_time
      const [endH, endM] = workEndTime.split(':').map(Number);
      const end = new Date();
      end.setHours(endH, endM, 0, 0);
      
      if (now < end) {
        const remDiff = end.getTime() - now.getTime();
        const rh = Math.floor(remDiff / 3600000);
        const rm = Math.floor((remDiff % 3600000) / 60000);
        const rs = Math.floor((remDiff % 60000) / 1000);
        setRemaining(`${rh.toString().padStart(2, '0')}:${rm.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`);
      } else {
        setRemaining('00:00:00');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [checkInTime, workEndTime]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
      <div className="glass" style={{ padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
          <Clock size={12} /> 현재 근무 시간
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', color: 'hsl(var(--primary))' }}>
          {elapsed}
        </div>
      </div>
      <div className="glass" style={{ padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
          <Timer size={12} /> 퇴근까지 남은 시간
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', color: 'hsl(var(--success))' }}>
          {remaining}
        </div>
      </div>
    </div>
  );
}
