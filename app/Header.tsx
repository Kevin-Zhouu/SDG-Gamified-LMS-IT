'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import UNiSDGLogo from "@/public/UNiSDG_logo.svg";
import AuthButton from '@/components/AuthButton';

export default function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <header className="sticky top-0 z-[901] h-16 bg-white">
      <div className="h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={UNiSDGLogo}
            alt="UNiSDG Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-lg font-semibold">SDG Learning Platform</span>
        </Link>
        {!isLoginPage && (
          <div className="flex items-center space-x-4">
            <AuthButton />
            <Link href="/search">
              <Search className="w-6 h-6" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}