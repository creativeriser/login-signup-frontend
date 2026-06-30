import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Loader2, Sparkles, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTheme } from '../lib/ThemeContext';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
      const response = await fetch(`${API_URL}/pages/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
        });

        const data = await response.json();

        if (response.ok && data.msg) {
          setMessage(data.msg);
          setLoading(false);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
      await fetch(`${API_URL}/pages/logout`, { method: 'POST' });
    } catch (e) {
      // Ignore errors
    }
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-canvas">
        <Loader2 size={32} className="animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface transition-colors duration-300">
      <div className="absolute top-6 right-6 md:top-8 md:right-8">
        <button 
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-900/5 dark:hover:bg-white/10 hover:text-ink-900"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="font-display text-4xl font-semibold text-ink-900 tracking-tight">
          Welcome to Dashboard
        </h1>
        <p className="text-ink-600">
          Ready to leave?{' '}
          <button 
            onClick={handleLogout}
            className="font-medium text-brand-600 hover:text-brand-700 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded transition-colors"
          >
            Click here to sign out
          </button>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
