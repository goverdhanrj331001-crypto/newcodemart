"use client";

import React from "react";
import { LoginForm } from "./login-form";

/**
 * Gate shown when an unauthenticated / non-admin user tries to access /admin.
 * Falls back to the login form inline (not a redirect) so the URL stays the same.
 */
export function AdminLoginGate() {
  return <LoginForm />;
}
