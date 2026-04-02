'use client';

import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

async function readJson(response) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Something went wrong.');
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    const response = await fetch('/api/auth', {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    });

    const data = await readJson(response);
    setUser(data?.user || null);
    return data?.user || null;
  }

  async function login(payload) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await readJson(response);
    setUser(data?.user || null);
    return data?.user || null;
  }

  async function signup(payload) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await readJson(response);
    setUser(data?.user || null);
    return data?.user || null;
  }

  async function logout() {
    const response = await fetch('/api/auth', {
      method: 'DELETE',
      credentials: 'include',
    });

    await readJson(response);
    setUser(null);
  }

  useEffect(() => {
    let isActive = true;

    async function loadUser() {
      try {
        const response = await fetch('/api/auth', {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include',
        });

        const data = await readJson(response);

        if (isActive) {
          setUser(data?.user || null);
        }
      } catch {
        if (isActive) {
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
