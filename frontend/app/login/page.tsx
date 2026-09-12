import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Admin Login | CodeMart",
  description: "Sign in to CodeMart admin panel",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <LoginForm showCloseButton />
    </Suspense>
  );
}
