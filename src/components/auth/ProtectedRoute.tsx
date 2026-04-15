"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { usePathname, useRouter } from "next/navigation";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const search = new URLSearchParams({ redirect: pathname }).toString();
      router.replace(`/auth?${search}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="container-page py-16 text-center text-slate-400 text-sm">
        Checking your session...
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

