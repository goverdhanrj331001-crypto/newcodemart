"use client";

import React, { useState } from "react";
import { useAdmin } from "../context/admin-context";
import { DollarSign, ShoppingCart, ClipboardList, Store, Clock, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

export const AdminDashboardView: React.FC = () => {
  const { orders, products } = useAdmin();
  const [timePeriod, setTimePeriod] = useState<"Today" | "Weekly" | "Monthly" | "Yearly">("Today");

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 445.20);
  const totalOrdersCount = orders.length > 0 ? orders.length : 16;
  const vendorCount = 249;
  const totalProductsCount = products.length > 0 ? products.length : 18;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* SECTION 1: Summary */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
            Summary
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total Revenue */}
          <div className="bg-white dark:bg-[#212121] rounded-lg p-5 border border-gray-100 dark:border-neutral-800 shadow-xs relative overflow-hidden flex items-center justify-between border-b-4 border-b-[#009f7f]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-amber-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 block mb-0.5">
                  Total Revenue
                </span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  ${totalRevenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Total Order */}
          <div className="bg-white dark:bg-[#212121] rounded-lg p-5 border border-gray-100 dark:border-neutral-800 shadow-xs relative overflow-hidden flex items-center justify-between border-b-4 border-b-indigo-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 block mb-0.5">
                  Total Order
                </span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {totalOrdersCount}
                </span>
              </div>
            </div>
          </div>

          {/* Vendor */}
          <div className="bg-white dark:bg-[#212121] rounded-lg p-5 border border-gray-100 dark:border-neutral-800 shadow-xs relative overflow-hidden flex items-center justify-between border-b-4 border-b-purple-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-600">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 block mb-0.5">
                  Vendor
                </span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {vendorCount}
                </span>
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white dark:bg-[#212121] rounded-lg p-5 border border-gray-100 dark:border-neutral-800 shadow-xs relative overflow-hidden flex items-center justify-between border-b-4 border-b-emerald-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 block mb-0.5">
                  Total Products
                </span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {totalProductsCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Order Status */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
              Order Status
            </h2>
          </div>

          {/* Time Filter Pills */}
          <div className="bg-gray-100 dark:bg-neutral-800 p-1 rounded-full flex items-center gap-1">
            {(["Today", "Weekly", "Monthly", "Yearly"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  timePeriod === period
                    ? "bg-[#009f7f] text-white shadow-xs"
                    : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white dark:bg-[#212121] rounded-lg p-5 border border-gray-100 dark:border-neutral-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 block mb-0.5">
                Pending Order
              </span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {orders.filter((o) => o.status === "Pending").length}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#212121] rounded-lg p-5 border border-gray-100 dark:border-neutral-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 block mb-0.5">
                Processing Order
              </span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {orders.filter((o) => o.status === "Processing").length}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#212121] rounded-lg p-5 border border-gray-100 dark:border-neutral-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 block mb-0.5">
                Completed Order
              </span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {orders.filter((o) => o.status === "Completed").length}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#212121] rounded-lg p-5 border border-gray-100 dark:border-neutral-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400 block mb-0.5">
                Cancelled Order
              </span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {orders.filter((o) => o.status === "Cancelled").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Recent Orders Table */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-100">
              Recent Orders
            </h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            Showing latest transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-neutral-800/60 text-gray-500 dark:text-neutral-400 font-bold border-b border-gray-100 dark:border-neutral-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Items</th>
                <th className="py-3.5 px-5">Total</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-gray-700 dark:text-neutral-300">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-gray-900 dark:text-neutral-100">{order.customerName}</div>
                    <div className="text-xs text-gray-400 dark:text-neutral-500">{order.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-5">{order.itemsCount} items</td>
                  <td className="py-3.5 px-5 font-bold text-[#009f7f]">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3.5 px-5">{order.date}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400"
                          : order.status === "Pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
