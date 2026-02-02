import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link
            href="/admin/products"
            className="hover:bg-gray-700 p-2 rounded"
          >
            Manage Products
          </Link>
          <Link href="/admin/orders" className="hover:bg-gray-700 p-2 rounded">
            View Orders
          </Link>
          <Link
            href="/"
            className="hover:bg-gray-700 p-2 rounded text-sm text-gray-400 mt-8"
          >
            Back to Website
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100 text-black">{children}</main>
    </div>
  );
}
