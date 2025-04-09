import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthUser {
  user_name: string;
  user_id: number;
}

interface AuthContextType {
  user: AuthUser | null;
  setAuthUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setAuthUser = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
