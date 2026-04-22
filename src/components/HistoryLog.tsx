'use client';

import React, { useState, useEffect } from 'react';
import { History, MapPin, Calendar, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Log {
  type: 'check-in' | 'check-out';
  timestamp: string;
  location: string;
}

export default function HistoryLog() {
  const [history, setHistory] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const loadHistory = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: logs } = await supabase
      .from('work_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(20);

    if (logs) {
      setHistory(logs.map((log: any) => ({
        type: log.type,
        timestamp: new Date(log.timestamp).toLocaleString('ko-KR', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        location: log.location_name
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('attendance-updated', loadHistory);
    return () => window.removeEventListener('attendance-updated', loadHistory);
  }, []);

  return (
    <div className="card animate-in" style={{ animationDelay: '0.1s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div className="flex-center" style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>
          <History size={18} />
        </div>
        <h3 style={{ fontSize: '1.125rem' }}>최근 활동 기록</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div className="flex-center" style={{ padding: '3rem' }}>
            <Loader2 className="animate-spin" size={24} color="hsl(var(--muted-foreground))" />
          </div>
        ) : history.length > 0 ? (
          history.map((log, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1rem', 
              borderRadius: 'var(--radius)', 
              backgroundColor: 'hsl(var(--muted) / 0.5)',
              border: '1px solid hsl(var(--border) / 0.5)'
            }}>
              <div style={{ 
                width: 4, 
                height: 32, 
                borderRadius: '2px', 
                backgroundColor: log.type === 'check-in' ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))',
                marginRight: '1rem'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {log.type === 'check-in' ? '출근 완료' : '퇴근 완료'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                    {log.timestamp}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                  <MapPin size={12} />
                  {log.location}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem', 
            color: 'hsl(var(--muted-foreground))',
            fontSize: '0.875rem'
          }}>
            <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>최근 출퇴근 기록이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
