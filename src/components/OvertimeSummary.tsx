'use client';

import React from 'react';
import { PieChart, Clock, AlertTriangle } from 'lucide-react';

export default function OvertimeSummary() {
  // Mock data for demo
  const totalLimit = 52;
  const used = 12.5;
  const percent = (used / totalLimit) * 100;

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>이번 달 초과근무 요약</h3>
          <PieChart size={20} color="hsl(var(--primary))" />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'hsl(var(--muted-foreground))' }}>누적 초과근무</span>
            <span style={{ fontWeight: 700 }}>{used}시간 / {totalLimit}시간</span>
          </div>
          <div style={{ height: '12px', backgroundColor: 'hsl(var(--muted))', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'hsl(var(--primary))', borderRadius: '6px' }} />
          </div>
        </div>

        <div style={{ padding: '1rem', backgroundColor: 'hsl(var(--warning)/0.1)', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <AlertTriangle size={18} color="hsl(var(--warning))" />
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--warning-foreground))', margin: 0, lineHeight: 1.5 }}>
            법정 주 52시간 근무 준수를 위해 관리가 필요합니다. <br />
            현재 페이스대로라면 이번 달 <strong>45시간</strong>을 초과할 것으로 예상됩니다.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>일별 초과근무 내역</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { date: '2026-04-15', hours: 2.5, reason: '분기 보고서 작성' },
            { date: '2026-04-10', hours: 4, reason: '긴급 시스템 점검' },
            { date: '2026-04-03', hours: 6, reason: '신제품 런칭 지원' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid hsl(var(--border)/0.5)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.date}</div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{item.reason}</div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>+{item.hours}h</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
