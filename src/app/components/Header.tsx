'use client'; // Client-side for interactivity

import { useState } from 'react';
import { useTheme } from 'next-themes';
import Cookies from 'js-cookie'; // Install: npm install js-cookie

export default function Header({ studentNumber }: { studentNumber: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Remember last page with cookies
  const activePage = Cookies.get('activePage') || '/';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center">
      <div className="absolute top-2 left-2 text-sm">{studentNumber}</div>
      <nav>
        {/* Hamburger Menu with CSS Transform */}
        <button onClick={toggleMenu} aria-label="Toggle menu" className="flex flex-col space-y-1">
          <span className={`w-6 h-0.5 bg-black dark:bg-white transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''} transition-transform`}></span>
          <span className={`w-6 h-0.5 bg-black dark:bg-white ${isMenuOpen ? 'opacity-0' : ''} transition-opacity`}></span>
          <span className={`w-6 h-0.5 bg-black dark:bg-white transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''} transition-transform`}></span>
        </button>
        {isMenuOpen && (
          <ul className="absolute top-12 left-0 bg-gray-100 dark:bg-gray-900 p-4 space-y-2">
            <li><a href="/" onClick={() => Cookies.set('activePage', '/')}>Home</a></li>
            <li><a href="/about" onClick={() => Cookies.set('activePage', '/about')}>About</a></li>
            <li><a href="/escape-room" onClick={() => Cookies.set('activePage', '/escape-room')}>Escape Room</a></li>
            <li><a href="/coding-races" onClick={() => Cookies.set('activePage', '/coding-races')}>Coding Races</a></li>
            <li><a href="/court-room" onClick={() => Cookies.set('activePage', '/court-room')}>Court Room</a></li>
          </ul>
        )}
      </nav>
      {/* Theme Toggle */}
      <select value={theme} onChange={(e) => setTheme(e.target.value)} className="ml-auto">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </header>
  );
}