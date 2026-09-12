"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  api,
  getAccessToken,
  setTokens,
  clearTokens,
  login as apiLogin,
  logout as apiLogout,
} from "@/lib/api-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "store_owner" | "admin" | "super_admin";
  avatar?: string | null;
  status?: string;
  walletPoints?: number;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;            // initial loading (fetching /users/me)
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const u = await api<AuthUser>("/users/me");
      setUser(u);
    } catch (e) {
      // token invalid / network error — silent logout
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    setUser(result.user as AuthUser);
    return result.user as AuthUser;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
