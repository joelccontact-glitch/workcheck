'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('이메일 또는 비밀번호가 잘못되었습니다. (혹은 메일 인증이 완료되지 않았을 수 있습니다.)');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem', backgroundColor: 'hsl(var(--muted)/0.3)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '10px', 
            backgroundColor: 'hsl(var(--primary))', margin: '0 auto 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: '1.25rem'
          }}>W</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>로그인</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>계속하려면 계정 정보를 입력하세요</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>이메일</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={iconStyle} />
              <input 
                type="email" required placeholder="example@daumit.net" 
                value={email} onChange={e => setEmail(e.target.value)}
                style={authInputStyle} 
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>비밀번호</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={iconStyle} />
              <input 
                type="password" required placeholder="••••••••" 
                value={password} onChange={e => setPassword(e.target.value)}
                style={authInputStyle} 
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))', fontSize: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%', height: '3rem' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : '로그인'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
          계정이 없으신가요? <Link href="/signup" style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>회원가입</Link>
        </p>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid hsl(var(--border))', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>
          <p>임시 계정 정보 (개발용):<br />test@daumit.net / 12345678</p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' };
const iconStyle = { position: 'absolute' as const, left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' };
const authInputStyle = { 
  width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', 
  borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))', 
  outline: 'none', transition: 'all 0.2s', fontSize: '0.875rem' 
};
