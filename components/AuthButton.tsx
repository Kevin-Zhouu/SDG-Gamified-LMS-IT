'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { getUserRole } from '@/utils/getUserRole';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      console.log("User:", user);
      getUserRole(supabase).then(role => setUserRole(role));
    };

    getUser();
  }, [supabase]); // Added supabase to dependency array

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };
  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  if (!user) {
    return (
      <Link
        href="/login"
        className="btn-secondary"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {user.user_metadata.userRole && (
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.user_metadata.userRole)}`}>
          {user.user_metadata.userRole}
        </span>
      )}

      Hey, {user.email}!
      <button
        onClick={signOut}
        className="btn-secondary"
      >
        Logout
      </button>
    </div>
  );
}