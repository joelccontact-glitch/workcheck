'use client';

import React, { useState } from 'react';
import { X, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeaveRequestModal({ isOpen, onClose, onSuccess }: LeaveRequestModalProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('leave_requests').insert({
      user_id: user.id,
      start_date: startDate,
      end_date: endDate,
      reason: reason,
      status: 'PENDING'
    });

    setLoading(false);
    if (error) {
      alert('신청 중 오류가 발생했습니다: ' + error.message);
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="flex-center" style={{ 
      position: 'fixed', inset: 0, zIndex: 100, 
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' 
    }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>연차 신청하기</h2>
          <button onClick={onClose} style={{ color: 'hsl(var(--muted-foreground))' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>시작일</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={iconStyle} />
                <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>종료일</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={iconStyle} />
                <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>사유</label>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={16} style={{ ...iconStyle, top: '1rem', transform: 'none' }} />
              <textarea 
                required 
                placeholder="연차 사유를 간단히 적어주세요" 
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '2.5rem', resize: 'none' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>취소</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : '신청 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' };
const iconStyle = { position: 'absolute' as const, left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' };
const inputStyle = { 
  width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.5rem', 
  borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))', 
  outline: 'none', fontSize: '0.875rem' 
};
