import React from "react";
import { AdminLayout } from "./admin-layout-client";

export const metadata = {
  title: "Admin Panel | CodeMart Digital Marketplace",
  description: "CodeMart Admin Panel — Dashboard, Products, Categories, Users, Orders, Banners and Settings",
};

export default function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
