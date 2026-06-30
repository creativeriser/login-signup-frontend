import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
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
    <div className="flex min-h-screen w-full flex-col bg-surface">
      <div className="flex flex-1 items-center justify-center">
        <h1 className="font-display text-4xl font-semibold text-ink-900 tracking-tight">
          Welcome to Dashboard
        </h1>
      </div>
      <div className="absolute top-8 right-8">
        <Button variant="secondary" onClick={handleLogout} className="px-6 py-2.5">
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
