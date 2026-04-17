'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Domain validation
    if (!email.endsWith('@daumit.net')) {
      setError('회원가입은 @daumit.net 도메인 이메일만 가능합니다.');
      return;
    }

    setLoading(true);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem', backgroundColor: 'hsl(var(--muted)/0.3)' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div className="flex-center" style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'hsl(var(--success)/0.1)', color: 'hsl(var(--success))', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>인증 메일 발송 완료</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', marginBottom: '2rem' }}>
             {email}로 인증 메일을 보냈습니다.<br />메일함 확인 후 인증을 완료해 주세요.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>로그인 화면으로</Link>
        </div>
      </div>
    );
  }

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
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>회원가입</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>WorkCheck 내부 프로젝트 계정 생성</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>이름</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={iconStyle} />
              <input 
                type="text" required placeholder="성함 입력" 
                value={name} onChange={e => setName(e.target.value)}
                style={authInputStyle} 
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>이메일 (@daumit.net 전용)</label>
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
            {loading ? <Loader2 className="animate-spin" /> : '가입하기'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
          이미 계정이 있으신가요? <Link href="/login" style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>로그인</Link>
        </p>
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
