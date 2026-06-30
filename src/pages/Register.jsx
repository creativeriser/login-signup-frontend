import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, ArrowRight, Sun, Moon, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GoogleIcon } from '../components/ui/GoogleIcon';
import { TypewriterText } from '../components/ui/TypewriterText';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
      const response = await fetch(`${API_URL}/pages/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setSuccess('Account created! Entering dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(data.msg || data || 'Registration failed');
      }
    } catch (err) {
      setError('Could not connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`flex min-h-screen w-full flex-col bg-surface ${theme}`}>
      {/* Auth Navbar (Global Full-Width) */}
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border bg-surface/70 backdrop-blur-xl px-4 md:px-8 sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-canvas">
            <Sprout size={18} />
          </div>
          <span className="font-display text-lg font-bold tracking-wide text-ink-900">GoalFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-900/5 hover:text-ink-600"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex h-[calc(100vh-72px)] w-full">
        {/* Left Column - Form */}
        <div className="flex h-full w-full flex-col px-6 md:px-16 lg:w-1/2 xl:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto my-auto w-full max-w-[360px]"
          >
            <motion.div layout="position" className="mb-5">
              <h1 className="font-display text-2xl font-semibold text-ink-900">
                Create an account
              </h1>
            </motion.div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600 border border-green-200">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
                required
              />
              
              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
                required
                minLength="6"
              />

              <Button type="submit" className="mt-1 w-full justify-center" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account <ArrowRight size={16} className="ml-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface px-4 text-ink-400 text-[11px] font-medium uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="w-full justify-center gap-2 border-border/50 hover:bg-ink-900/5 dark:hover:bg-white/5 transition-all duration-300 ease-out shadow-sm" type="button" disabled={isLoading}>
                <GoogleIcon className="h-4 w-4" />
                Google
              </Button>
              <Button variant="secondary" className="w-full justify-center gap-2 border-border/50 hover:bg-ink-900/5 dark:hover:bg-white/5 transition-all duration-300 ease-out shadow-sm" type="button" disabled={isLoading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Button>
            </div>

            <p className="mt-5 text-center text-sm text-ink-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded disabled:opacity-50 disabled:pointer-events-none">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Column - Brand/Decorative */}
        <div className="relative hidden w-1/2 overflow-hidden bg-[#0A1017] dark:bg-surface lg:block transition-colors">
          
          {/* Subtle glowing spotlight to ground the text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-96 w-96 rounded-full bg-[#10b981] opacity-5 dark:opacity-10 blur-[100px]" />
          </div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

          {/* Simple Typing Animation */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="font-display text-4xl font-medium tracking-wide text-white drop-shadow-sm">
              <TypewriterText text="Achieve your goals :)" />
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
