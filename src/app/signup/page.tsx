'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1.1 도메인 제한 체크
    if (!email.endsWith('@daumit.net')) {
      setError('가입은 @daumit.net 도메인 이메일로만 가능합니다.');
      setLoading(false);
      return;
    }

    // 1.2 회원가입 요청
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        // 가입 후 인증 메일이 발송되도록 설정 (Supabase 설정에 따라 동작)
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signupError) {
      setError(signupError.message);
    } else {
      // 1.2 가입 후 이메일 인증 안내 표시
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', padding: '1.5rem', backgroundColor: 'hsl(var(--muted)/0.3)' }}>
        <div className="card animate-in" style={{ maxWidth: '400px', textAlign: 'center', padding: '2.5rem' }}>
          <div className="flex-center" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'hsl(var(--success)/0.1)', color: 'hsl(var(--success))', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>이메일을 확인해주세요!</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.6, marginBottom: '2rem' }}>
            <strong>{email}</strong> 주소로 인증 메일을 보냈습니다.<br />
            메일의 링크를 클릭하면 가입이 완료됩니다.
          </p>
          <button onClick={() => router.push('/login')} className="btn btn-primary" style={{ width: '100%' }}>
            로그인 화면으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1.5rem', backgroundColor: 'hsl(var(--muted)/0.3)' }}>
      <div className="card animate-in shadow-2xl" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', border: 'none' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: 'hsl(var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.5rem', margin: '0 auto 1.25rem' }}>W</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' }}>새로운 시작 🚀</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>WorkCheck와 함께 효율적으로 관리하세요.</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>실명</label>
            <div style={inputWrapperStyle}>
              <User size={18} style={iconStyle} />
              <input 
                type="text" required placeholder="홍길동"
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>회사 이메일 (@daumit.net)</label>
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
            {loading ? <Loader2 className="animate-spin" /> : '인증 메일 보내기'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
          이미 계정이 있으신가요? <button onClick={() => router.push('/login')} style={{ border: 'none', background: 'none', color: 'hsl(var(--primary))', fontWeight: 600, cursor: 'pointer' }}>로그인</button>
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
