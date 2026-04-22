'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Clock, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface LeaveRequest {
  id: number;
  user_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  profiles?: {
    full_name: string;
  };
}

export default function LeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const supabase = createClient();

  const fetchRequests = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from('leave_requests')
      .select(`
        *,
        profiles (full_name)
      `)
      .order('id', { ascending: false });

    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    if (data) setRequests(data as any);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status })
      .eq('id', id);

    if (!error) {
      fetchRequests();
    }
  };

  useEffect(() => {
    fetchRequests();
    window.addEventListener('leave-updated', fetchRequests);
    return () => window.removeEventListener('leave-updated', fetchRequests);
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="card flex-center" style={{ padding: '4rem' }}>
        <Loader2 className="animate-spin" size={32} color="hsl(var(--primary))" />
      </div>
    );
  }

  return (
    <div className="card animate-in" style={{ animationDelay: '0.1s' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
        {isAdmin ? '결재 요청 목록' : '내 신청 현황'}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} style={{ 
              padding: '1.25rem', 
              borderRadius: 'var(--radius)', 
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--card))'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="flex-center" style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                      {request.profiles?.full_name || '알 수 없음'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                      {request.start_date} ~ {request.end_date}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  padding: '0.25rem 0.6rem', 
                  borderRadius: '6px', 
                  fontSize: '0.7rem', 
                  fontWeight: 700,
                  backgroundColor: 
                    request.status === 'APPROVED' ? 'hsl(var(--success) / 0.1)' : 
                    request.status === 'REJECTED' ? 'hsl(var(--destructive) / 0.1)' : 
                    'hsl(var(--warning) / 0.1)',
                  color: 
                    request.status === 'APPROVED' ? 'hsl(var(--success))' : 
                    request.status === 'REJECTED' ? 'hsl(var(--destructive))' : 
                    'hsl(var(--warning))'
                }}>
                  {request.status}
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: 'hsl(var(--muted)/0.3)', borderRadius: '6px' }}>
                {request.reason}
              </p>

              {isAdmin && request.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                    className="btn btn-primary" style={{ flex: 1, height: '2.5rem', fontSize: '0.875rem' }}
                  >
                    <Check size={16} /> 승인
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                    className="btn btn-outline" style={{ flex: 1, height: '2.5rem', fontSize: '0.875rem' }}
                  >
                    <X size={16} /> 반려
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'hsl(var(--muted-foreground))' }}>
             <Calendar size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
             <p style={{ fontSize: '0.875rem' }}>표시할 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
