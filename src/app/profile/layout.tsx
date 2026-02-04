"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Overview", href: "/profile", icon: LayoutDashboard },
    { name: "My Orders", href: "/profile/orders", icon: Package },
    { name: "Settings", href: "/profile/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-32">
              <div className="mb-10 px-4">
                <h2 className="font-bold text-2xl text-foreground tracking-tight">
                  {user?.name || "User"}
                </h2>
                <p className="text-sm text-secondary font-medium">
                  {user?.email}
                </p>
              </div>

              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-foreground font-bold"
                          : "text-secondary hover:text-foreground"
                      }`}
                    >
                      <item.icon
                        className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-0"}`}
                      />
                      <span className={isActive ? "" : "-ml-7"}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-12 pt-8 border-t border-foreground/15 px-4 space-y-3">
                <Link
                  href="/"
                  className="text-sm font-medium text-secondary hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Back to Home
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-secondary hover:text-red-600 transition-colors flex items-center gap-2"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <ProtectedRoute>{children}</ProtectedRoute>
          </main>
        </div>
      </div>
    </div>
  );
}
