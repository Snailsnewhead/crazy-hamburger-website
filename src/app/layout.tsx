'use client'; 
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import Cookies from 'js-cookie';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('system');
  const activePage = Cookies.get('activePage') || '/';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const setActivePage = (path: string) => {
    Cookies.set('activePage', path, { expires: 7 });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'system';
    setTheme(currentTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const name = 'Tan Dung Nguyen'; 
  const studentNumber = '22162861'; 

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen pt-16 pb-16">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center z-10">
            <div className="absolute top-4 left-20 text-sm text-black dark:text-white">{studentNumber}</div>
            <nav>
              <button
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
                className="flex flex-col space-y-1 focus:outline-none"
              >
                <span
                  className={`w-6 h-0.5 bg-black dark:bg-white transition-transform duration-300 ${
                    isMenuOpen ? 'rotate-20 translate-y-1.5' : ''
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-black dark:bg-white transition-opacity duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-black dark:bg-white transition-transform duration-300 ${
                    isMenuOpen ? '-rotate-20 -translate-y-1.5' : ''
                  }`}
                ></span>
              </button>
              {isMenuOpen && (
                <ul className="absolute top-12 left-0 bg-gray-100 dark:bg-gray-900 p-4 space-y-2 w-48 shadow-lg">
                  <li>
                    <a
                      href="/"
                      onClick={() => setActivePage('/')}
                      className={`block ${activePage === '/' ? 'font-bold text-blue-500' : 'text-black dark:text-white'}`}
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      onClick={() => setActivePage('/about')}
                      className={`block ${activePage === '/about' ? 'font-bold text-blue-500' : 'text-black dark:text-white'}`}
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="/escape-room"
                      onClick={() => setActivePage('/escape-room')}
                      className={`block ${activePage === '/escape-room' ? 'font-bold text-blue-500' : 'text-black dark:text-white'}`}
                    >
                      Escape Room
                    </a>
                  </li>
                  <li>
                    <a
                      href="/coding-races"
                      onClick={() => setActivePage('/coding-races')}
                      className={`block ${activePage === '/coding-races' ? 'font-bold text-blue-500' : 'text-black dark:text-white'}`}
                    >
                      Coding Races
                    </a>
                  </li>
                  <li>
                    <a
                      href="/court-room"
                      onClick={() => setActivePage('/court-room')}
                      className={`block ${activePage === '/court-room' ? 'font-bold text-blue-500' : 'text-black dark:text-white'}`}
                    >
                      Court Room
                    </a>
                  </li>
                </ul>
              )}
            </nav>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="ml-auto bg-gray-100 dark:bg-gray-700 text-black dark:text-white p-1 rounded"
              aria-label="Select theme"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </header>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="fixed bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 p-4 text-center text-black dark:text-white">
            &copy; {name} - {studentNumber}
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}