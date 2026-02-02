import Link from "next/link";
import {
  BarChart3,
  Package,
  ShoppingCart,
  ArrowLeft,
  LayoutDashboard,
  Settings,
  Bell,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fcf9f5]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#9f4d2c]/10 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#9f4d2c] rounded-xl flex items-center justify-center transform transition-transform group-hover:rotate-12">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#1a120e]">
              Goodwill<span className="text-[#9f4d2c]">.</span>
            </span>
          </Link>
          <div className="mt-2 text-xs font-bold text-[#4a403a]/50 uppercase tracking-widest px-1">
            Admin Suite
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 bg-[#9f4d2c]/5 text-[#9f4d2c] border border-[#9f4d2c]/10"
          >
            <Package className="w-5 h-5" />
            Inventory Control
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#4a403a] hover:bg-[#9f4d2c]/5 hover:text-[#9f4d2c] rounded-2xl transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            Order Insights
          </Link>

          <div className="my-6 border-t border-[#9f4d2c]/5 mx-4" />

          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#4a403a] hover:bg-[#9f4d2c]/5 hover:text-[#9f4d2c] rounded-2xl transition-all duration-300"
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#4a403a] hover:bg-[#9f4d2c]/5 hover:text-[#9f4d2c] rounded-2xl transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
            System Rules
          </Link>
        </nav>

        <div className="p-6">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#1a120e] bg-[#fcf9f5] border border-[#9f4d2c]/10 rounded-2xl hover:bg-[#9f4d2c] hover:text-white transition-all duration-500 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Public View
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-[#9f4d2c]/5 flex items-center justify-between px-10 z-10">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#9f4d2c]" />
            <span className="font-bold text-[#1a120e]">Dashboard Control</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-[#4a403a] hover:text-[#9f4d2c] transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#9f4d2c] rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#9f4d2c] to-[#9f4d2c]/40 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 relative">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9f4d2c]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
