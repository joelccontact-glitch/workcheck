'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Users, LogIn, Calendar, Clock, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboardStats() {
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    pendingLeave: 0,
    onLeave: 0
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    // 이미 로딩 중이면 데이터를 초기화하지 않고 부드럽게 갱신
    const today = new Date().toISOString().split('T')[0];

    try {
      // 4가지 통계를 병렬로 동시 요청 (속도 극대화)
      const [totalRes, onlineRes, pendingRes, onLeaveRes] = await Promise.all([
        // 1. 전체 직원 수
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        
        // 2. 현재 근무 중 (오늘 로그 중 퇴근하지 않은 인원)
        supabase.from('work_logs')
          .select('*', { count: 'exact', head: true })
          .eq('work_date', today)
          .is('check_out', null),
          
        // 3. 결재 대기 중인 휴가
        supabase.from('leave_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'PENDING'),
          
        // 4. 오늘 휴가 중인 인원
        supabase.from('leave_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'APPROVED')
          .lte('start_date', today)
          .gte('end_date', today)
      ]);

      setStats({
        total: totalRes.count || 0,
        online: onlineRes.count || 0,
        pendingLeave: pendingRes.count || 0,
        onLeave: onLeaveRes.count || 0
      });
    } catch (err) {
      console.error('[Stats] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStats();
    // 외부 이벤트 발생 시 갱신
    window.addEventListener('attendance-updated', fetchStats);
    window.addEventListener('leave-updated', fetchStats);
    return () => {
      window.removeEventListener('attendance-updated', fetchStats);
      window.removeEventListener('leave-updated', fetchStats);
    };
  }, [fetchStats]);

  // 로딩 시에도 카드 형태를 유지하여 레이아웃 흔들림 방지
  if (loading && stats.total === 0) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card shadow-sm" style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', border: 'none' }}>
            <Loader2 className="animate-spin" size={24} color="hsl(var(--muted))" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      <StatCard 
        icon={<Users size={22} />} 
        label="전체 팀원" 
        value={stats.total} 
        color="hsl(var(--primary))" 
        description="등록된 전체 직원 수"
      />
      <StatCard 
        icon={<LogIn size={22} />} 
        label="현재 근무 중" 
        value={stats.online} 
        color="hsl(var(--success))" 
        description="오늘 출근 보고 완료"
      />
      <StatCard 
        icon={<Calendar size={22} />} 
        label="오늘 휴가" 
        value={stats.onLeave} 
        color="hsl(var(--warning))" 
        description="승인된 휴가 인원"
      />
      <StatCard 
        icon={<Clock size={22} />} 
        label="결재 대기" 
        value={stats.pendingLeave} 
        color="hsl(var(--destructive))" 
        description="확인이 필요한 신청건"
      />
    </div>
  );
}

function StatCard({ icon, label, value, color, description }: { icon: React.ReactNode, label: string, value: number, color: string, description: string }) {
  return (
    <div className="card shadow-md" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', border: 'none', background: 'white', borderRadius: '20px' }}>
      <div className="flex-center" style={{ width: 56, height: 56, borderRadius: '16px', backgroundColor: `${color}10`, color: color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{value}<span style={{ fontSize: '0.875rem', fontWeight: 600, marginLeft: '2px' }}>명</span></div>
        <div style={{ fontSize: '0.65rem', color: 'hsl(var(--muted-foreground)/0.7)', marginTop: '0.2rem' }}>{description}</div>
      </div>
    </div>
  );
}
