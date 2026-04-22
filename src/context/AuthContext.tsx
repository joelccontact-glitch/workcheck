'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

type Role = 'ADMIN' | 'USER';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: {
    id: string;
    email: string;
    name: string;
    team: string;
    rank: string;
  } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('USER');
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSupabaseUser(session?.user ?? null);
      
      // Load role from metadata or localStorage for now
      // In a real app, this would come from a profiles table
      const savedRole = localStorage.getItem('user-role');
      if (savedRole) setRole(savedRole as Role);
      
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setSupabaseUser(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user-role');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('user-role', newRole);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const userData = supabaseUser ? {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    name: supabaseUser.user_metadata.full_name || supabaseUser.email!.split('@')[0],
    team: role === 'ADMIN' ? '인사관리팀' : '개발팀',
    rank: role === 'ADMIN' ? '팀장' : '과장',
  } : null;

  return (
    <AuthContext.Provider value={{ 
      role, 
      setRole: handleSetRole, 
      user: userData, 
      loading,
      signOut: handleSignOut 
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
