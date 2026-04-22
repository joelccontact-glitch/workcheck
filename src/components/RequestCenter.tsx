'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { MapPin, Home, Calendar, Send, History, CheckCircle2, Loader2, Clock } from 'lucide-react';
import LeaveRequests from './LeaveRequests';

type RequestType = 'ANNUAL' | 'HALF_AM' | 'HALF_PM' | 'WFH' | 'OUTSIDE';

export default function RequestCenter() {
  const { user, refreshProfile } = useAuth();
  const supabase = createClient();
  
  const [activeTab, setActiveTab] = useState<'NEW' | 'HISTORY'>('NEW');
  const [type, setType] = useState<RequestType>('ANNUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from('leave_requests').insert({
      user_id: user.id,
      type,
      start_date: startDate,
      end_date: endDate || startDate,
      reason,
      status: 'PENDING'
    });

    if (!error) {
      alert('신청이 완료되었습니다.');
      setStartDate('');
      setEndDate('');
      setReason('');
      await refreshProfile();
      setActiveTab('HISTORY');
    } else {
      alert('오류 발생: ' + error.message);
    }
    setLoading(false);
  };

  const leaveUsedPercent = user ? (user.used_leave / user.total_leave) * 100 : 0;

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Leave Stats Card */}
      <div className="card" style={{ 
        padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem',
        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%)',
        color: 'white', border: 'none'
      }}>
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeWidth="3" 
              strokeDasharray={`${leaveUsedPercent} 100`} strokeLinecap="round" />
          </svg>
          <div className="flex-center" style={{ position: 'absolute', inset: 0, fontSize: '0.75rem', fontWeight: 700 }}>
            {Math.round(leaveUsedPercent)}%
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>잔여 연차 현황</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>총 {user?.total_leave}일 중 {user?.total_leave! - user?.used_leave!}일 남음</p>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem' }}>
             <div style={{ fontSize: '0.75rem' }}>사용: <strong>{user?.used_leave}일</strong></div>
             <div style={{ fontSize: '0.75rem' }}>사용 가능: <strong>{user?.total_leave! - user?.used_leave!}일</strong></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid hsl(var(--border))' }}>
        <button onClick={() => setActiveTab('NEW')} style={{ 
          padding: '0.75rem 1.5rem', border: 'none', background: 'none', 
          borderBottom: activeTab === 'NEW' ? '2px solid hsl(var(--primary))' : 'none',
          color: activeTab === 'NEW' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
          fontWeight: 600, cursor: 'pointer'
        }}>신규 신청</button>
        <button onClick={() => setActiveTab('HISTORY')} style={{ 
          padding: '0.75rem 1.5rem', border: 'none', background: 'none', 
          borderBottom: activeTab === 'HISTORY' ? '2px solid hsl(var(--primary))' : 'none',
          color: activeTab === 'HISTORY' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
          fontWeight: 600, cursor: 'pointer'
        }}>신청 내역</button>
      </div>

      {activeTab === 'NEW' ? (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', display: 'block' }}>신청 유형</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
              <TypeButton active={type === 'ANNUAL'} onClick={() => setType('ANNUAL')} icon={<Calendar size={16} />} label="연차" />
              <TypeButton active={type === 'HALF_AM'} onClick={() => setType('HALF_AM')} icon={<Clock size={16} />} label="오전반차" />
              <TypeButton active={type === 'HALF_PM'} onClick={() => setType('HALF_PM')} icon={<Clock size={16} />} label="오후반차" />
              <TypeButton active={type === 'WFH'} onClick={() => setType('WFH')} icon={<Home size={16} />} label="재택" />
              <TypeButton active={type === 'OUTSIDE'} onClick={() => setType('OUTSIDE')} icon={<MapPin size={16} />} label="외근" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>시작일</label>
              <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
            </div>
            {type === 'ANNUAL' && (
              <div>
                <label style={labelStyle}>종료일</label>
                <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>사유 (상세 내용)</label>
            <textarea 
              rows={3} required value={reason} onChange={e => setReason(e.target.value)}
              placeholder="상세 사유를 입력하세요."
              style={{ ...inputStyle, resize: 'none' }} 
            />
          </div>

          <button className="btn btn-primary" style={{ height: '3rem', width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> 신청하기</>}
          </button>
        </form>
      ) : (
        <LeaveRequests />
      )}
    </div>
  );
}

function TypeButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0.75rem', borderRadius: '12px',
      border: active ? '1.5px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
      background: active ? 'hsl(var(--primary)/0.05)' : 'white',
      color: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
      cursor: 'pointer', transition: 'all 0.2s'
    }}>
      {icon}
      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{label}</span>
    </button>
  );
}

const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' };
const inputStyle = { 
  width: '100%', padding: '0.75rem', borderRadius: '8px', 
  border: '1px solid hsl(var(--border))', outline: 'none', fontSize: '0.875rem' 
};
