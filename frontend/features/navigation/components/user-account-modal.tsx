"use client";

import React from "react";
import { useAuth } from "@/features/auth/auth-context";
import { useRouter } from "next/navigation";
import { LogOut, Package, Receipt, Settings, User as UserIcon, Loader2 } from "lucide-react";

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-neutral-800 border border-zinc-700 rounded-xl max-w-sm w-full p-8 shadow-2xl text-center"
        >
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mx-auto" />
          <p className="text-zinc-400 text-xs mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — show login CTA
  if (!isAuthenticated || !user) {
    return (
      <div
        id="user-account-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
        onClick={onClose}
      >
        <div
          id="user-account-modal-card"
          onClick={(e) => e.stopPropagation()}
          className="relative bg-neutral-800 border border-zinc-700 rounded-xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-700">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-emerald-400" />
              <h4 className="text-white text-sm font-semibold">Welcome to CodeMart</h4>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-zinc-300 text-xs mb-4 leading-relaxed">
            Sign in to access your downloads, purchase history, billing, and account settings.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/login");
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/login");
              }}
              className="w-full text-center text-xs text-zinc-400 hover:text-zinc-200 py-2 transition-colors"
            >
              Create an account
            </button>
          </div>

          <p className="text-center text-[10px] text-zinc-600 mt-4">
            Admin? <span className="text-emerald-400 cursor-pointer" onClick={() => router.push("/login")}>Login here</span>
          </p>
        </div>
      </div>
    );
  }

  // Authenticated — show user info + menu
  const initials = user.name
    ?.split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "U";

  const isAdmin = user.role === "admin" || user.role === "super_admin";

  return (
    <div
      id="user-account-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="user-account-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-neutral-800 border border-zinc-700 rounded-xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
                {initials}
              </div>
            )}
            <div>
              <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                {user.name}
                {isAdmin && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {user.role === "super_admin" ? "SUPER ADMIN" : "ADMIN"}
                  </span>
                )}
              </h4>
              <p className="text-zinc-400 text-xs">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <div className="space-y-1 text-sm text-zinc-300">
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/admin");
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-zinc-700 transition-colors flex items-center gap-3 text-emerald-400 font-medium"
            >
              <Settings className="h-4 w-4" />
              <span>Admin Panel</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full text-left px-3 py-2 rounded hover:bg-zinc-700 transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              <Package className="h-4 w-4" />
              My Downloads
            </span>
            <span className="text-xs bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">
              0
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-left px-3 py-2 rounded hover:bg-zinc-700 transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              <Receipt className="h-4 w-4" />
              Purchase History
            </span>
            <span className="text-xs text-zinc-500">View</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-left px-3 py-2 rounded hover:bg-zinc-700 transition-colors flex items-center gap-3"
          >
            <Settings className="h-4 w-4" />
            Account Settings
          </button>
        </div>

        {/* Logout */}
        <div className="mt-4 pt-3 border-t border-zinc-700">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-center text-xs text-red-400 hover:text-red-300 py-1.5 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
