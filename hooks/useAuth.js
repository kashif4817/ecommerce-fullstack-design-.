'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  const { user, setUser, isLoading } = context;

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Login failed');
        return { success: false, error: data.message };
      }

      setUser(data.user);
      toast.success('Login successful!');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return { success: false, error: error.message };
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Signup failed');
        return { success: false, error: data.message };
      }

      toast.success('Account created! Redirecting to login...');
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
      return { success: false };
    }
  };

  return {
    user,
    setUser,
    isLoading,
    login,
    signup,
    logout,
  };
}
