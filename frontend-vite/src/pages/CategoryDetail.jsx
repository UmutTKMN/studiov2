import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { categoryService } from "../services/api";

export default function CategoryDetail() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await categoryService.getCategoryBySlug(slug);
        setCategory(response.data.category);
      } catch (err) {
        setError("Error loading category details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!category) return <div className="text-center p-4">Category not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {category.image && (
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-[300px] object-cover rounded-lg shadow-lg mb-8"
        />
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{category.title}</h1>
        
        <div className="prose max-w-none mb-8">
          <p className="text-gray-700">{category.description}</p>
        </div>

        {category.posts && category.posts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.posts.map(post => (
                <Link
                  key={post.id}
                  to={`/posts/${post.slug}`}
                  className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
                >
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
