'use client';

import React, { useEffect, useState } from 'react';
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

  const fetchStats = async () => {
    setLoading(true);
    
    // 1. Total users
    const { count: total } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // 2. Currently working (latest log is check-in)
    // This is slightly complex to do in one query without a view, 
    // so we'll fetch all latest logs or just a count of users with check-in.
    const { data: logs } = await supabase
      .from('work_logs')
      .select('user_id, type, timestamp')
      .order('timestamp', { ascending: false });
    
    const uniqueUsers = new Set();
    let onlineCount = 0;
    if (logs) {
      logs.forEach((log: any) => {
        if (!uniqueUsers.has(log.user_id)) {
          uniqueUsers.add(log.user_id);
          if (log.type === 'check-in') onlineCount++;
        }
      });
    }

    // 3. Pending leave requests
    const { count: pending } = await supabase
      .from('leave_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING');

    // 4. On leave today
    const today = new Date().toISOString().split('T')[0];
    const { count: onLeave } = await supabase
      .from('leave_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'APPROVED')
      .lte('start_date', today)
      .gte('end_date', today);

    setStats({
      total: total || 0,
      online: onlineCount,
      pendingLeave: pending || 0,
      onLeave: onLeave || 0
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    window.addEventListener('attendance-updated', fetchStats);
    window.addEventListener('leave-updated', fetchStats);
    return () => {
      window.removeEventListener('attendance-updated', fetchStats);
      window.removeEventListener('leave-updated', fetchStats);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card flex-center" style={{ height: '120px' }}>
            <Loader2 className="animate-spin" size={24} color="hsl(var(--muted-foreground))" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      <StatCard icon={<Users size={20} />} label="전체 팀원" value={stats.total} color="hsl(var(--primary))" />
      <StatCard icon={<LogIn size={20} />} label="현재 근무 중" value={stats.online} color="hsl(var(--success))" />
      <StatCard icon={<Calendar size={20} />} label="오늘 휴가" value={stats.onLeave} color="hsl(var(--warning))" />
      <StatCard icon={<Clock size={20} />} label="결재 대기" value={stats.pendingLeave} color="hsl(var(--destructive))" />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div className="flex-center" style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}명</div>
      </div>
    </div>
  );
}
