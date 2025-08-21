import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard', auth: true },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">M</span>
            </motion.div>
            <span className="font-display font-bold text-xl">MultiLink</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            if (link.auth && !user) return null;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:text-primary-600 ${
                  router.pathname === link.href ? 'text-primary-600' : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full neumorphic dark:neumorphic-dark"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full neumorphic dark:neumorphic-dark"
              >
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </button>

              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-dark-800 ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link href="/dashboard">
                    <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center">
                      <FiSettings className="mr-2" /> Dashboard
                    </a>
                  </Link>
                  <Link href="/profile">
                    <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center">
                      <FiUser className="mr-2" /> Profile
                    </a>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login">
                <a className="btn btn-secondary">Login</a>
              </Link>
              <Link href="/register">
                <a className="btn btn-primary">Sign Up</a>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full neumorphic dark:neumorphic-dark"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden glass"
        >
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              if (link.auth && !user) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 font-medium ${
                    router.pathname === link.href ? 'text-primary-600' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {!user && (
              <div className="pt-3 flex flex-col space-y-2">
                <Link href="/login">
                  <a className="btn btn-secondary w-full">Login</a>
                </Link>
                <Link href="/register">
                  <a className="btn btn-primary w-full">Sign Up</a>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
