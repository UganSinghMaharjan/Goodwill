"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import {
  Plus,
  Trash2,
  Star,
  RefreshCcw,
  Upload,
  Package,
  Image as ImageIcon,
  DollarSign,
  Type,
  AlignLeft,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  is_featured: boolean;
  is_hidden: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image_url: "/images/cat-living.png", // Default for now
    is_featured: false,
    is_hidden: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<Product[]>("/products");
      setProducts(data);
    } catch (error: any) {
      console.error("Failed to fetch products", error);
      toast.error(error.message || "Failed to load products");
      setError(
        error.message || "Failed to load products. Check backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        const res = await fetch("http://127.0.0.1:8001/upload", {
          method: "POST",
          body: uploadData,
        });

        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({ ...prev, image_url: data.url }));
        } else {
          alert("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      // Simple success toast or alert
      toast.success("Masterpiece added to registry!");
      fetchProducts(); // Refresh list
      setFormData({
        name: "",
        category: "",
        price: "",
        description: "",
        image_url: "/images/cat-living.png",
        is_featured: false,
        is_hidden: false,
      });
    } catch (error: any) {
      console.error("Error adding product", error);
      toast.error(`Failed to add product: ${error.message}`);
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await apiFetch(`/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...product, is_featured: !product.is_featured }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  const toggleVisibility = async (product: Product) => {
    try {
      await apiFetch(`/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...product, is_hidden: !product.is_hidden }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating visibility", error);
    }
  };

  const deleteProduct = async (productId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently remove this asset from the registry?",
      )
    )
      return;

    try {
      await apiFetch(`/products/${productId}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error removing product", error);
      alert("Failed to remove product");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#1a120e] tracking-tight">
            Inventory Control
          </h1>
          <p className="text-[#4a403a] font-medium opacity-70 mt-1">
            Curate and expand your architectural furniture collection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a403a]/40" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-[#9f4d2c]/10 rounded-xl text-sm focus:outline-none focus:border-[#9f4d2c] transition-all w-64 shadow-sm"
            />
          </div>
          <button
            onClick={fetchProducts}
            className={`p-2.5 bg-white border border-[#9f4d2c]/10 rounded-xl text-[#9f4d2c] hover:bg-[#9f4d2c]/5 transition-all shadow-sm ${loading ? "animate-spin" : ""}`}
            disabled={loading}
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Add Product Form - Modern Sidebar Style */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#9f4d2c]/5 sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-[#9f4d2c]/10 rounded-xl text-[#9f4d2c]">
                <Plus className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-[#1a120e]">New Entry</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Type className="w-3 h-3" /> Asset Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Minimalist Oak Table"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#fcf9f5] text-foreground border border-[#9f4d2c]/5 rounded-2xl text-sm focus:outline-none focus:border-[#9f4d2c]/20 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#4a403a]/60 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Package className="w-3 h-3" /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#fcf9f5] text-foreground  border border-[#9f4d2c]/5 rounded-2xl text-sm focus:outline-none focus:border-[#9f4d2c]/20 transition-all appearance-none"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="living-room">Living Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="dining-room">Dining Room</option>
                  <option value="office">Office</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#4a403a]/60 uppercase tracking-widest flex items-center gap-2 px-1">
                  <DollarSign className="w-3 h-3" /> Valuation
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#fcf9f5] text-foreground border border-[#9f4d2c]/5 rounded-2xl text-sm focus:outline-none focus:border-[#9f4d2c]/20 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#4a403a]/60 uppercase tracking-widest flex items-center gap-2 px-1">
                  <ImageIcon className="w-3 h-3" /> Visual Asset
                </label>
                <div className="relative group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full px-4 py-6 bg-[#fcf9f5] border-2 border-dashed border-[#9f4d2c]/10 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:bg-[#9f4d2c]/5 transition-all">
                    <Upload className="w-6 h-6 text-[#9f4d2c] opacity-40 group-hover:opacity-100 transition-all" />
                    <span className="text-[10px] font-bold text-[#4a403a]/40 uppercase tracking-tight">
                      Click to upload
                    </span>
                  </div>
                </div>
                {formData.image_url && (
                  <div className="mt-2 text-[10px] font-bold text-green-600/70 truncate flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Linked:{" "}
                    {formData.image_url.split("/").pop()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#4a403a]/60 uppercase tracking-widest flex items-center gap-2 px-1">
                  <AlignLeft className="w-3 h-3" /> Narrative
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the masterpiece..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#fcf9f5] text-foreground border border-[#9f4d2c]/5 rounded-2xl text-sm focus:outline-none focus:border-[#9f4d2c]/20 transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#4a403a]/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9f4d2c]"></div>
                </label>
                <span className="text-xs font-bold text-[#1a120e]">
                  Highlight as Featured
                </span>
              </div>

              <div className="flex items-center gap-3 py-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_hidden"
                    checked={formData.is_hidden}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#4a403a]/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
                <span className="text-xs font-bold text-[#1a120e]">
                  Hide from Public Grid
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#9f4d2c] text-white rounded-2xl font-bold shadow-lg shadow-[#9f4d2c]/20 hover:bg-[#863d22] transition-all duration-300 translate-y-0 active:translate-y-1"
              >
                Create Asset
              </button>
            </form>
          </div>
        </div>

        {/* Product List - Modern Table Style */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#9f4d2c]/5">
            <div className="px-8 py-6 border-b border-[#9f4d2c]/5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1a120e]">
                Asset Registry
              </h2>
              <div className="text-xs font-bold text-[#4a403a]/40 bg-[#fcf9f5] px-3 py-1 rounded-full border border-[#9f4d2c]/5">
                {filteredProducts.length} Total Items
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fcf9f5]/50 no-border">
                    <th className="px-8 py-4 text-[10px] font-bold text-[#4a403a]/50 uppercase tracking-[0.15em]">
                      Object
                    </th>
                    <th className="px-4 py-4 text-[10px] font-bold text-[#4a403a]/50 uppercase tracking-[0.15em]">
                      Category
                    </th>
                    <th className="px-4 py-4 text-[10px] font-bold text-[#4a403a]/50 uppercase tracking-[0.15em]">
                      Valuation
                    </th>
                    <th className="px-4 py-4 text-[10px] font-bold text-[#4a403a]/50 uppercase tracking-[0.15em]">
                      Status
                    </th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[#4a403a]/50 uppercase tracking-[0.15em] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#9f4d2c]/5">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[#fcf9f5]/80 transition-all duration-300 group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#f5ebe0] shadow-sm border border-[#9f4d2c]/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => {
                                console.error(
                                  `<img> tag failed to load:`,
                                  product.image_url,
                                );
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#1a120e] text-sm leading-tight">
                              {product.name}
                            </div>
                            <div className="text-[10px] font-medium text-[#4a403a]/40 mt-0.5 tracking-tight capitalize">
                              {product.category}
                            </div>
                            <div className="text-[8px] text-gray-400 break-all max-w-[150px] mt-1">
                              URL: {product.image_url}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="px-2.5 py-1 text-[10px] font-bold bg-[#f5ebe0] text-[#4a403a] rounded-lg tracking-wide uppercase border border-[#9f4d2c]/5">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="font-bold text-[#9f4d2c] text-sm tracking-tight">
                          ${product.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        {product.is_featured ? (
                          <div className="flex items-center gap-1.5 text-green-600">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Featured
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#4a403a]/20">
                            <XCircle className="w-3.5 h-3.5" />
                            <span className="text-[10px]  text-foreground/50 font-bold uppercase tracking-wider">
                              Regular
                            </span>
                          </div>
                        )}
                        {product.is_hidden && (
                          <div className="flex items-center gap-1.5 text-amber-600 mt-1">
                            <EyeOff className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Hidden
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 pr-0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                          <button
                            onClick={() => toggleVisibility(product)}
                            className={`p-2 rounded-xl border transition-all ${product.is_hidden ? "bg-[#1a120e] text-white" : "bg-blue-50 border-blue-100 text-blue-400 hover:bg-blue-500 hover:text-white"}`}
                            title={
                              product.is_hidden ? "Show Asset" : "Hide Asset"
                            }
                          >
                            {product.is_hidden ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => toggleFeatured(product)}
                            className={`p-2 rounded-xl border transition-all ${product.is_featured ? "bg-amber-50 border-amber-100 text-amber-500 hover:bg-amber-500 hover:text-white" : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-amber-500 hover:text-white"}`}
                            title={
                              product.is_featured
                                ? "Remove Featured"
                                : "Make Featured"
                            }
                          >
                            <Star
                              className={`w-4 h-4 ${product.is_featured ? "fill-current" : ""}`}
                            />
                          </button>

                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 rounded-xl border bg-red-50 border-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                            title="Remove Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-8 py-12 text-center text-[#4a403a]/40 font-medium"
                      >
                        No assets found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
