"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdmin } from "../context/admin-context";
import { Search, Plus, Trash2, ChevronLeft, ChevronRight, UserPlus, X } from "lucide-react";

export const AdminUsersView: React.FC = () => {
  const { users, addUser, deleteUser } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"customer" | "store_owner" | "admin">("customer");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addUser({
      name: newName,
      email: newEmail,
      permissions: [newRole],
      walletPoints: 100,
      status: "Active",
    });

    setNewName("");
    setNewEmail("");
    setIsAddUserModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
            Users
          </h1>
        </div>

        <div className="flex items-center gap-3 grow sm:grow-0 justify-end">
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name"
              className="w-full h-10 rounded-md border border-gray-200 bg-gray-50/50 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all focus:border-[#009f7f] focus:bg-white dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-100 dark:focus:border-[#009f7f]"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 h-10 px-4 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-sm font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add User</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-neutral-800/60 text-gray-500 dark:text-neutral-400 font-bold border-b border-gray-100 dark:border-neutral-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Name</th>
                <th className="py-3.5 px-5">Permissions</th>
                <th className="py-3.5 px-5">Available wallet point</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-gray-700 dark:text-neutral-300">
              {paginatedUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="py-3.5 px-5 font-semibold text-gray-500 dark:text-neutral-400">
                    #ID: {u.id}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-[#009f7f] text-sm shrink-0">
                        {u.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">
                          {u.name}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-neutral-500">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex flex-wrap gap-1.5">
                      {u.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 text-xs font-medium"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-gray-900 dark:text-white">
                    {u.walletPoints}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => deleteUser(u.id)}
                      title="Delete User"
                      className="p-1.5 rounded-md hover:bg-rose-50 text-gray-400 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Image 6 */}
        <div className="p-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400">
          <span>
            Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
                className={`h-8 w-8 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pg
                    ? "bg-[#009f7f] text-white"
                    : "border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                }`}
              >
                {pg}
              </button>
            ))}

            {totalPages > 5 && <span className="px-1">...</span>}
            {totalPages > 5 && (
              <button
                type="button"
                onClick={() => setCurrentPage(15)}
                className={`h-8 w-8 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentPage === 15
                    ? "bg-[#009f7f] text-white"
                    : "border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                }`}
              >
                15
              </button>
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#212121] rounded-xl border border-gray-200 dark:border-neutral-800 w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-neutral-100 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#009f7f]" />
                Add New User
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                  Full Name*
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                  Email Address*
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                  Role Permission
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] px-3 text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
                >
                  <option value="customer">customer</option>
                  <option value="store_owner">store_owner</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="h-10 px-4 rounded-md border border-gray-200 dark:border-neutral-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
