'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, MapPin, Clock } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'NORMAL' | 'TARDY' | 'ABSENT' | 'WFH' | 'OUTSIDE';
  location?: string;
}

export default function AttendanceCalendar() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMonthRecords = async () => {
    if (!user) return;
    setLoading(true);
    
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59).toISOString();

    const { data: logs } = await supabase
      .from('work_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('timestamp', startOfMonth)
      .lte('timestamp', endOfMonth)
      .order('timestamp', { ascending: true });

    const grouped: Record<string, AttendanceRecord> = {};
    
    logs?.forEach((log: any) => {
      const date = log.timestamp.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { date, checkIn: null, checkOut: null, status: 'NORMAL', location: log.location_name };
      }
      if (log.type === 'check-in') grouped[date].checkIn = log.timestamp;
      else grouped[date].checkOut = log.timestamp;
    });

    setRecords(grouped);
    setLoading(false);
  };

  useEffect(() => {
    fetchMonthRecords();
  }, [currentMonth, user]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="card animate-in" style={{ padding: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="btn btn-outline" style={{ padding: '0.5rem' }}>
            <ChevronLeft size={18} />
          </button>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="btn btn-outline" style={{ padding: '0.5rem' }}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div style={{ backgroundColor: 'hsl(var(--muted))', borderRadius: '8px', padding: '4px', display: 'flex' }}>
           <button 
            onClick={() => setViewMode('CALENDAR')}
            style={{ border: 'none', background: viewMode === 'CALENDAR' ? 'white' : 'transparent', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
             <CalendarIcon size={14} /> 달력
           </button>
           <button 
            onClick={() => setViewMode('LIST')}
            style={{ border: 'none', background: viewMode === 'LIST' ? 'white' : 'transparent', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
             <List size={14} /> 목록
           </button>
        </div>
      </header>

      {viewMode === 'CALENDAR' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
            {['일', '월', '화', '수', '목', '금', '토'].map(d => (
              <div key={d} style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, padding: '8px 0' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const dateStr = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const record = records[dateStr];
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDate(dateStr)}
                  style={{ 
                    aspectRatio: '1', border: '1px solid hsl(var(--border)/0.3)', borderRadius: '12px', 
                    background: selectedDate === dateStr ? 'hsl(var(--primary)/0.05)' : isToday ? 'hsl(var(--primary)/0.02)' : 'transparent',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    cursor: 'pointer', position: 'relative'
                  }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: isToday ? 700 : 500, color: isToday ? 'hsl(var(--primary))' : 'inherit' }}>{day}</span>
                  {record && (
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'hsl(var(--success))' }} />
                      {record.checkOut && <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'hsl(var(--primary))' }} />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Object.values(records).reverse().map(record => (
            <div key={record.date} className="glass" style={{ padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{record.date}</div>
                 <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Clock size={12} /> {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Clock size={12} /> {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}</span>
                 </div>
               </div>
               <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--success))' }}>정상</div>
                 <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: '2px' }}><MapPin size={10} /> {record.location}</div>
               </div>
            </div>
          ))}
        </div>
      )}

      {selectedDate && records[selectedDate] && (
        <div className="animate-in" style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'hsl(var(--muted)/0.3)', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '1rem' }}>{selectedDate} 상세 기록</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid hsl(var(--border)/0.5)' }}>
               <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>출근</div>
               <div style={{ fontSize: '1rem', fontWeight: 700 }}>{records[selectedDate].checkIn ? new Date(records[selectedDate].checkIn!).toLocaleTimeString() : '-'}</div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid hsl(var(--border)/0.5)' }}>
               <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>퇴근</div>
               <div style={{ fontSize: '1rem', fontWeight: 700 }}>{records[selectedDate].checkOut ? new Date(records[selectedDate].checkOut!).toLocaleTimeString() : '-'}</div>
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} color="hsl(var(--primary))" />
            <span>{records[selectedDate].location}</span>
          </div>
        </div>
      )}
    </div>
  );
}
