import React from "react";
import Link from "next/link";
import { ArrowLeft, PackageX } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-4 text-center text-zinc-300">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-zinc-400 mb-4 border border-neutral-700">
        <PackageX className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
      <p className="max-w-md text-sm text-zinc-400 mb-6">
        The digital asset or product page you are looking for may have been moved or is no longer available.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Marketplace</span>
      </Link>
    </div>
  );
}
