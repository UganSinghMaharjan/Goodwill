"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  is_featured: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image_url: "/images/cat-living.png", // Default for now
    is_featured: false,
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
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://127.0.0.1:8001/upload", {
          method: "POST",
          body: formData,
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

      alert("Product added successfully!");
      fetchProducts(); // Refresh list
      setFormData({
        name: "",
        category: "",
        price: "",
        description: "",
        image_url: "/images/cat-living.png",
        is_featured: false,
      });
      // Reset file input if possible (simple way: controlled input or ref, but let's just leave it for now)
    } catch (error: any) {
      console.error("Error adding product", error);
      alert(`Failed to add product: ${error.message}`);
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

  // if (loading) return <div className="p-8 text-center">Loading products...</div>;
  // if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button
          onClick={fetchProducts}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh List"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6 border border-red-100">
          {error}
        </div>
      )}

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="living-room">Living Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="dining-room">Dining Room</option>
            <option value="office">Office</option>
          </select>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border p-2 rounded bg-gray-50"
            />
            {formData.image_url && (
              <div className="text-xs text-green-600 truncate">
                Uploaded: {formData.image_url}
              </div>
            )}
            <input type="hidden" name="image_url" value={formData.image_url} />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded md:col-span-2"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              id="is_featured"
            />
            <label htmlFor="is_featured">Featured Masterpiece</label>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded md:col-span-2 hover:bg-blue-700"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500 animate-pulse">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products found.</p>
            <p className="text-sm mt-2">
              Make sure the backend is running on port 8001.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Featured</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{product.id}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2 capitalize">{product.category}</td>
                  <td className="p-2">${product.price}</td>
                  <td className="p-2">
                    {product.is_featured ? (
                      <span className="text-green-600 font-bold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`px-3 py-1 rounded text-sm ${product.is_featured ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {product.is_featured
                        ? "Remove Featured"
                        : "Make Featured"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
