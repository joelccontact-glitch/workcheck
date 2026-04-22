'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : loginError.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1.5rem', backgroundColor: 'hsl(var(--muted)/0.3)' }}>
      <div className="card animate-in shadow-2xl" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', border: 'none' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: 'hsl(var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.5rem', margin: '0 auto 1.25rem' }}>W</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' }}>다시 오셨군요! 👋</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>WorkCheck에 로그인하여 업무를 시작하세요.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>이메일</label>
            <div style={inputWrapperStyle}>
              <Mail size={18} style={iconStyle} />
              <input 
                type="email" required placeholder="yourname@daumit.net"
                value={email} onChange={(e) => setEmail(e.target.value)}
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
                value={password} onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button className="btn btn-primary" style={{ height: '3.25rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : '로그인'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
          아직 계정이 없으신가요? <button onClick={() => router.push('/signup')} style={{ border: 'none', background: 'none', color: 'hsl(var(--primary))', fontWeight: 600, cursor: 'pointer' }}>회원가입</button>
        </div>
      </div>

      <style jsx>{`
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15); }
      `}</style>
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
