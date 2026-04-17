'use client';

import React from 'react';
import { Calendar, Check, X, Clock } from 'lucide-react';

const DUMMY_LEAVE = [
  { id: 1, name: '이수민', type: '연차', date: '2026-04-20', status: 'PENDING' },
  { id: 2, name: '박지훈', type: '반차(오후)', date: '2026-04-21', status: 'APPROVED' },
  { id: 3, name: '정우성', type: '보상휴가', date: '2026-04-22', status: 'PENDING' },
];

export default function LeaveRequests() {
  return (
    <div className="card animate-in" style={{ animationDelay: '0.1s' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>결재 대기 항목</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {DUMMY_LEAVE.map((request) => (
          <div key={request.id} style={{ 
            padding: '1rem', 
            borderRadius: 'var(--radius)', 
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--card))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="flex-center" style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>
                  <Calendar size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{request.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{request.type}</div>
                </div>
              </div>
              <div style={{ 
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.65rem', 
                fontWeight: 700,
                backgroundColor: request.status === 'APPROVED' ? 'hsl(var(--success) / 0.1)' : 'hsl(var(--destructive) / 0.1)',
                color: request.status === 'APPROVED' ? 'hsl(var(--success))' : 'hsl(var(--destructive))'
              }}>
                {request.status}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
              <Clock size={12} />
              신청일: {request.date}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
                <Check size={14} /> 승인
              </button>
              <button className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
                <X size={14} /> 반려
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
