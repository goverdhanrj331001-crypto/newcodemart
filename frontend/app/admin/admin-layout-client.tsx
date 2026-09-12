"use client";

import React from "react";
import { AdminProvider } from "@/features/admin/context/admin-context";
import { useAuth } from "@/features/auth/auth-context";
import { AdminLoginGate } from "@/features/auth/components/admin-login-gate";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // While we're checking auth status, show a loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-zinc-400 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → show login gate
  if (!isAuthenticated || !isAdmin) {
    return <AdminLoginGate />;
  }

  // Authenticated admin → render the admin panel
  return <AdminProvider>{children}</AdminProvider>;
}
