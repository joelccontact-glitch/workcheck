'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, LogIn, ShieldCheck, User as UserIcon, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'USER' | 'ADMIN'>('USER'); // 권한 선택 추가
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      setLoading(false);
    } else {
      // 로그인 성공 시 로컬 스토리지에 선택한 역할 잠시 저장 (초기 진입용)
      localStorage.setItem('login_intent_role', loginRole);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: 'hsl(var(--muted)/0.3)', padding: '1.5rem' }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}>
        <header style={{ textAlign: 'center' as const, marginBottom: '2.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '18px', backgroundColor: 'hsl(var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', fontWeight: 900 }}>W</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>WorkCheck 로그인</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>서비스 이용을 위해 권한을 선택하고 로그인하세요.</p>
        </header>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Role Selection Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: 'hsl(var(--muted)/0.5)', padding: '0.4rem', borderRadius: '14px' }}>
            <button
              type="button"
              onClick={() => setLoginRole('USER')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.75rem', borderRadius: '10px', border: 'none',
                backgroundColor: loginRole === 'USER' ? 'white' : 'transparent',
                color: loginRole === 'USER' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: loginRole === 'USER' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none'
              }}
            >
              <UserIcon size={16} /> 사용자
            </button>
            <button
              type="button"
              onClick={() => setLoginRole('ADMIN')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.75rem', borderRadius: '10px', border: 'none',
                backgroundColor: loginRole === 'ADMIN' ? 'white' : 'transparent',
                color: loginRole === 'ADMIN' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))',
                fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: loginRole === 'ADMIN' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none'
              }}
            >
              <ShieldCheck size={16} /> 관리자
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>이메일</label>
              <div style={inputWrapperStyle}>
                <Mail size={18} style={iconStyle} />
                <input
                  type="email" required placeholder="yourname@daumit.net"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>비밀번호</label>
              <div style={inputWrapperStyle}>
                <Lock size={18} style={iconStyle} />
                <input
                  type="password" required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.875rem', borderRadius: '12px', backgroundColor: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="btn btn-primary"
            style={{ 
              height: '3.5rem', borderRadius: '16px', fontSize: '1rem', fontWeight: 800, gap: '0.75rem',
              backgroundColor: loginRole === 'ADMIN' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'
            }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> {loginRole === 'ADMIN' ? '관리자 로그인' : '사용자 로그인'}</>}
          </button>
        </form>

        <footer style={{ marginTop: '2rem', textAlign: 'center' as const, fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
          계정이 없으신가요? <button onClick={() => router.push('/signup')} style={{ color: 'hsl(var(--primary))', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>회원가입</button>
        </footer>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' };
const inputWrapperStyle: React.CSSProperties = { position: 'relative', display: 'flex', alignItems: 'center' };
const iconStyle: React.CSSProperties = { position: 'absolute', left: '1rem', color: 'hsl(var(--muted-foreground))' };
const inputStyle: React.CSSProperties = { 
  width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', 
  border: '1px solid hsl(var(--border))', outline: 'none', fontSize: '0.875rem',
  transition: 'border-color 0.2s',
  backgroundColor: 'hsl(var(--muted)/0.1)'
};
