import React from 'react';
import { Poppins } from 'next/font/google';
import "./globals.css";
import Header from './Header';

// Configure Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SDG Learning Platform",
  description: "The best way to learn SDG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="bg-background text-foreground min-h-screen">
        <Header />
        <main className="flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}