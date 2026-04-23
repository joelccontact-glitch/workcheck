'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

type Role = 'ADMIN' | 'USER';

interface Profile {
  full_name: string;
  role: Role;
  department_id?: number;
  team: string;
  rank: string;
  total_leave: number;
  used_leave: number;
  work_start_time: string;
  work_end_time: string;
  cached_uid?: string;
}

interface AuthContextType {
  role: Role;
  user: {
    id: string;
    email: string;
    name: string;
    team: string;
    rank: string;
    total_leave: number;
    used_leave: number;
    work_start_time: string;
    work_end_time: string;
  } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CACHE_KEY = 'workcheck_profile_v3';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isFetching = useRef(false);
  const loadingStateRef = useRef(true);

  // loading 상태를 추적하는 ref (타임아웃에서 사용)
  useEffect(() => {
    loadingStateRef.current = loading;
  }, [loading]);

  const publicPaths = ['/login', '/signup', '/auth/callback'];
  const isPublicPath = publicPaths.includes(pathname);

  // 즉시 캐시 로드
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
        if (parsed.cached_uid) {
          setLoading(false);
        }
      } catch (e) {
        console.error('Cache error', e);
      }
    }
  }, []);

  const fetchProfile = async (userId: string, isBackground = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    
    if (!isBackground) setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        const newProfile: Profile = {
          full_name: data.full_name || '사용자',
          role: (data.role as Role) || 'USER',
          department_id: data.department_id,
          team: data.team || '소속 없음',
          rank: data.rank || '직급 없음',
          total_leave: data.total_leave || 15,
          used_leave: data.used_leave || 0,
          work_start_time: data.work_start_time || '09:00:00',
          work_end_time: data.work_end_time || '18:00:00',
          cached_uid: userId
        };
        setProfile(newProfile);
        localStorage.setItem(CACHE_KEY, JSON.stringify(newProfile));
      } else {
        if (!isPublicPath) router.replace('/signup');
      }
    } catch (err) {
      console.error('[Auth] Fetch error:', err);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // 세션 확인 타임아웃 (모바일/인앱 브라우저 멈춤 방지)
    const authTimeout = setTimeout(() => {
      if (loadingStateRef.current) {
        console.warn('[Auth] Initialization timed out. Forcing UI render.');
        setLoading(false);
        if (!supabaseUser && !isPublicPath) {
          router.replace('/login');
        }
      }
    }, 4000); // 4초 후 강제 해제

    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const user = data?.session?.user ?? null;
        setSupabaseUser(user);
        
        if (user) {
          await fetchProfile(user.id, true);
        } else {
          setLoading(false);
          localStorage.removeItem(CACHE_KEY);
          if (!isPublicPath) router.replace('/login');
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
        setLoading(false);
      } finally {
        clearTimeout(authTimeout);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setSupabaseUser(user);
        
        if (user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          await fetchProfile(user.id, true);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setSupabaseUser(null);
          localStorage.removeItem(CACHE_KEY);
          setLoading(false);
          if (!isPublicPath) router.replace('/login');
        }
      }
    );

    return () => {
      clearTimeout(authTimeout);
      authListener.subscription.unsubscribe();
    };
  }, [pathname]);

  const handleSignOut = async () => {
    localStorage.removeItem(CACHE_KEY);
    setLoading(true);
    await supabase.auth.signOut();
    setProfile(null);
    setSupabaseUser(null);
    setLoading(false);
    router.replace('/login');
  };

  const refreshProfile = async () => {
    if (supabaseUser) await fetchProfile(supabaseUser.id, true);
  };

  const setRole = (newRole: Role) => {
    if (profile) {
      const updated = { ...profile, role: newRole };
      setProfile(updated);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    }
  };

  const userData = useMemo(() => {
    const targetUser = supabaseUser || (profile?.cached_uid ? { id: profile.cached_uid, email: '' } : null);
    if (!targetUser) return null;
    return {
      id: targetUser.id,
      email: (targetUser as any).email || '',
      name: profile?.full_name || '사용자',
      team: profile?.team || '소속 없음',
      rank: profile?.rank || '직급 없음',
      total_leave: profile?.total_leave || 15,
      used_leave: profile?.used_leave || 0,
      work_start_time: profile?.work_start_time || '09:00:00',
      work_end_time: profile?.work_end_time || '18:00:00'
    };
  }, [supabaseUser, profile]);

  return (
    <AuthContext.Provider value={{ 
      role: profile?.role || 'USER', 
      user: userData, 
      loading,
      signOut: handleSignOut,
      refreshProfile,
      setRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
