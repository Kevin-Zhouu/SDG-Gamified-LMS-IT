'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import UNiSDGLogo from "@/public/UNiSDG_logo.svg";
import AuthButton from '@/components/AuthButton';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  // Check if we're on a auth page
  const isAuthPage = pathname === '/login' || pathname === '/reset-password' || pathname === '/update-password';

  useEffect(() => {
    // Get initial auth state and check admin status
    const getInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Check if user has admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
       
        setIsAdmin(profile?.role === 'admin');
      }
    };
  
    getInitialUser();
  
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
     
      if (currentUser) {
        // Check admin status when auth state changes
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
       
        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });
  
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]); // Add supabase to dependency array

  return (
    <header className="sticky top-0 z-[901] h-full bg-surface">
      <div className="h-full px-16 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={UNiSDGLogo}
            alt="UNiSDG Logo"
            width={40}
            height={40}
            className="mr-2"
            style={{ height: 'auto' }}
          />
          <span className="text-lg font-semibold">UNi SDG</span>
        </Link>
        <div className="flex flex-row gap-4 items-center">
          {/* Only show navigation items if NOT on auth pages OR if user is admin */}
          {(!isAuthPage || isAdmin) && (
            <>
              <Link href="/#Dashboard" className={`btn-ghost ${pathname === '/#Dashboard' ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link href="/#SDG" className={`btn-ghost ${pathname === '/#SDG' ? 'active' : ''}`}>
                SDG
              </Link>
              <Link href="/search" className={`btn-ghost ${pathname === '/search' ? 'active' : ''}`}>
                <Search className="w-6 h-6"/>
              </Link>
            </>
          )}
          
          {/* Show profile and auth button if NOT on auth pages OR if user is admin */}
          {(!isAuthPage || isAdmin) && (
            <div className="flex items-center space-x-4">
              <div className="flex flex-row items-center gap-4">
                <Link href="/profile" className="relative">
                  <User className="h-8 w-8 rounded-full p-1 bg-neutral-300" />
                  {isAdmin && (
                    <ShieldCheck className="w-4 h-4 text-blue-600 absolute -top-1 -right-1 bg-white rounded-full" />
                  )}
                </Link>
                <AuthButton />
              </div>
            </div>
          )}

          {/* Always show auth button on auth pages */}
          {isAuthPage && !isAdmin && (
            <AuthButton />
          )}
        </div>
      </div>
    </header>
  );
}