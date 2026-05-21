'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-950/75 text-gray-900 dark:text-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-colors">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 tracking-tight transition hover:scale-[1.02]">
          <span className="text-amber-500 animate-float">💪</span> FitZone
        </Link>
        
        <button 
          className="md:hidden p-2 rounded-xl border border-gray-200/80 bg-white/80 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/70 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className={`${isOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 right-0 bg-white/95 dark:bg-gray-950/95 md:bg-transparent z-50 border-b md:border-b-0 border-gray-200 dark:border-gray-800 md:backdrop-blur-0 backdrop-blur-xl`}>
          <ul className="flex flex-col md:flex-row gap-2 md:gap-2 p-4 md:p-0 md:items-center">
            <li><Link href="/" className="inline-flex px-4 py-2 rounded-full hover:bg-amber-500/10 hover:text-amber-600 transition">Home</Link></li>
            <li><Link href="/classes" className="inline-flex px-4 py-2 rounded-full hover:bg-amber-500/10 hover:text-amber-600 transition">Classes</Link></li>
            <li><Link href="/trainers" className="inline-flex px-4 py-2 rounded-full hover:bg-amber-500/10 hover:text-amber-600 transition">Trainers</Link></li>
            <li><Link href="/membership" className="inline-flex px-4 py-2 rounded-full hover:bg-amber-500/10 hover:text-amber-600 transition">Membership</Link></li>
            <li><Link href="/contact" className="inline-flex px-4 py-2 rounded-full hover:bg-amber-500/10 hover:text-amber-600 transition">Contact</Link></li>
          </ul>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link href="/contact" className="bg-linear-to-r from-amber-500 to-orange-500 text-gray-900 px-6 py-2 rounded-full font-semibold hover:scale-105 shadow-lg shadow-amber-500/20 transition transform">
            Join Now
          </Link>
        </div>
      </nav>
    </header>
  );
}
