import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await categoryService.getAllCategories();
        if (response?.data?.categories) {
          setCategories(response.data.categories);
        } else {
          setCategories([]); // Beklenmedik API yanıtı durumunda temizleme
        }
        setError(null);
      } catch (err) {
        setError(
          `Error loading categories: ${
            err.message || "Please try again later."
          }`
        );
        console.error("Error fetching categories:", err);
        setCategories([]); // Hata durumunda kategorileri temizle
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!categories.length) {
    return <div className="text-center p-4">No categories found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.slug}`}
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          {category.image && (
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-bold">{category.title}</h2>
            <p className="text-gray-600 mt-2">
              {category.description || "No description available"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
