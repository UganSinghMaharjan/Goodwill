"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Please log in to access this page");
        router.push("/auth/login?redirect=" + pathname);
      } else if (adminOnly && user?.role !== "admin") {
        toast.error("Unauthorized. Admin access only.");
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, user, adminOnly, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (adminOnly && user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
