'use client';

import React, { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { MapPin, Clock, CheckCircle2, AlertCircle, Wifi, Navigation, Loader2 } from 'lucide-react';

export default function AttendanceCard() {
  const { user } = useAuth();
  const { coords, loading: geoLoading, error: geoError, accuracy } = useGeolocation();
  const supabase = createClient();

  const [status, setStatus] = useState<'OUT' | 'IN'>('OUT');
  const [inTime, setInTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState('00:00:00');
  const [zones, setZones] = useState<any[]>([]);

  const fetchStatus = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('work_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('work_date', today)
      .maybeSingle();

    if (data) {
      setStatus(data.check_out ? 'OUT' : 'IN');
      setInTime(data.check_in);
    }
    setLoading(false);
  };

  const fetchZones = async () => {
    const { data } = await supabase.from('work_zones').select('*');
    if (data) setZones(data);
  };

  useEffect(() => {
    fetchStatus();
    fetchZones();
  }, [user]);

  useEffect(() => {
    if (status === 'IN' && inTime) {
      const interval = setInterval(() => {
        const diff = Date.now() - new Date(inTime).getTime();
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimer(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimer('00:00:00');
    }
  }, [status, inTime]);

  const handleCheckIn = async () => {
    if (!user || !coords) return;
    
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('work_logs').insert({
      user_id: user.id,
      work_date: today,
      check_in: new Date().toISOString(),
      location_in: `POINT(${coords.longitude} ${coords.latitude})`,
    });

    if (!error) fetchStatus();
    setLoading(false);
  };

  const handleCheckOut = async () => {
    if (!user || !coords) return;

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('work_logs').update({
      check_out: new Date().toISOString(),
      location_out: `POINT(${coords.longitude} ${coords.latitude})`,
    }).eq('user_id', user.id).eq('work_date', today);

    if (!error) fetchStatus();
    setLoading(false);
  };

  return (
    <div className="card animate-in shadow-xl" style={{ padding: '2rem', borderRadius: '28px', border: 'none', background: 'white' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>실시간 근태 태깅</h3>
            <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
          </div>
          <div style={{ padding: '0.5rem 1rem', borderRadius: '12px', backgroundColor: status === 'IN' ? 'hsl(var(--success)/0.1)' : 'hsl(var(--muted))', color: status === 'IN' ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))', fontSize: '0.75rem', fontWeight: 700 }}>
            {status === 'IN' ? '● 근무 중' : '○ 근무 종료'}
          </div>
        </div>

        {/* Timer Section - Responsive Scale */}
        <div style={{ 
          margin: '0 auto', width: 'clamp(180px, 50vw, 220px)', height: 'clamp(180px, 50vw, 220px)', 
          borderRadius: '50%', border: '8px solid hsl(var(--muted)/0.5)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative', background: 'hsl(var(--muted)/0.1)',
          transition: 'all 0.3s ease'
        }}>
          {status === 'IN' && (
            <div style={{ position: 'absolute', top: '-4px', left: '-4px', right: '-4px', bottom: '-4px', borderRadius: '50%', border: '8px solid hsl(var(--primary))', borderTopColor: 'transparent', animation: 'spin 10s linear infinite' }} />
          )}
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}>오늘 총 근무 시간</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', fontFamily: 'monospace' }}>{timer}</div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button 
            onClick={handleCheckIn}
            disabled={status === 'IN' || loading || geoLoading}
            className="btn btn-primary"
            style={{ height: '3.5rem', borderRadius: '18px', fontSize: '1rem', fontWeight: 700, gap: '0.5rem', boxShadow: status === 'OUT' ? '0 10px 20px -5px rgba(var(--primary-rgb), 0.4)' : 'none' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Navigation size={20} /> 출근하기</>}
          </button>
          <button 
            onClick={handleCheckOut}
            disabled={status === 'OUT' || loading || geoLoading}
            className="btn btn-outline"
            style={{ height: '3.5rem', borderRadius: '18px', fontSize: '1rem', fontWeight: 700, gap: '0.5rem', border: '2px solid hsl(var(--border))' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><LogOut size={20} /> 퇴근하기</>}
          </button>
        </div>

        {/* Location Status Info */}
        <div className="glass" style={{ padding: '1rem', borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', border: '1px solid hsl(var(--border)/0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="flex-center" style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}>
              <Navigation size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))' }}>현재 위치</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{geoLoading ? '확인 중...' : accuracy ? `${accuracy.toFixed(1)}m` : '알 수 없음'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="flex-center" style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}>
              <Wifi size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))' }}>네트워크</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>내부 망</div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function LogOut({ size }: { size: number }) {
  return <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
}
