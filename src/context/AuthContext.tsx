'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const publicPaths = ['/login', '/signup', '/auth/callback'];
  const isPublicPath = publicPaths.includes(pathname);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('[Auth] Fetching profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || '사용자',
          role: (data.role as Role) || 'USER',
          department_id: data.department_id,
          team: data.team || '소속 없음',
          rank: data.rank || '직급 없음',
          total_leave: data.total_leave || 15,
          used_leave: data.used_leave || 0,
          work_start_time: data.work_start_time || '09:00:00',
          work_end_time: data.work_end_time || '18:00:00'
        });
      } else {
        console.warn('[Auth] No profile found.');
        setProfile(null);
        if (!isPublicPath) router.replace('/signup');
      }
    } catch (err) {
      console.error('[Auth] Error fetching profile:', err);
      setProfile(null);
    } finally {
      setLoading(false); // 프로필 조회(성공/실패) 후에만 로딩 해제
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      console.log('[Auth] Initializing...');
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      const user = session?.user ?? null;
      
      setSupabaseUser(user);
      
      if (user) {
        // 사용자가 있다면 프로필을 가져올 때까지 loading을 유지함
        await fetchProfile(user.id);
      } else {
        setLoading(false);
        if (!isPublicPath) router.replace('/login');
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        console.log('[Auth] Event:', event);
        const user = session?.user ?? null;
        setSupabaseUser(user);
        
        if (user) {
          setLoading(true); // 권한 정보를 다시 가져올 때 로딩을 켬
          await fetchProfile(user.id);
        } else {
          setProfile(null);
          setLoading(false);
          if (!isPublicPath && event === 'SIGNED_OUT') {
            router.replace('/login');
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname]);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const refreshProfile = async () => {
    if (supabaseUser) {
      setLoading(true);
      await fetchProfile(supabaseUser.id);
    }
  };

  const setRole = (newRole: Role) => {
    if (profile) setProfile({ ...profile, role: newRole });
  };

  const userData = supabaseUser ? {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '사용자',
    team: profile?.team || '소속 없음',
    rank: profile?.rank || '직급 없음',
    total_leave: profile?.total_leave || 15,
    used_leave: profile?.used_leave || 0,
    work_start_time: profile?.work_start_time || '09:00:00',
    work_end_time: profile?.work_end_time || '18:00:00'
  } : null;

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
