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
        if (!response.data) {
          throw new Error("Kategori bulunamadı");
        }
        setCategory(response.data.category);
        setError(null);
      } catch (err) {
        console.error("Kategori detay hatası:", err);
        setError("Kategori detayları yüklenirken bir hata oluştu.");
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
    <div>
      <Link to="/categories" className="text-blue-500 hover:underline flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.707 4.293a1 1 0 010 1.414L7.414 9H15a1 1 0 110 2H7.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Kategorilere Dön
      </Link>

      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {category.name || category.category_name}
          </h1>
          
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700">
              {category.description || category.category_description}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
            <span>Yazı Sayısı: {category.post_count || 0}</span>
            <div>
              <div>Oluşturulma: {new Date(category.createdAt || category.category_createdAt).toLocaleDateString('tr-TR')}</div>
              <div>Son Güncelleme: {new Date(category.updatedAt || category.category_updatedAt).toLocaleDateString('tr-TR')}</div>
            </div>
          </div>
        </div>
      </article>

      {category.posts && category.posts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Bu Kategorideki Yazılar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.posts.map(post => (
              <Link
                key={post.post_id}
                to={`/posts/${post.post_slug}`}
                className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                {post.post_image && (
                  <img 
                    src={post.post_image}
                    alt={post.post_title}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2">{post.post_title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {post.post_excerpt || post.post_content?.substring(0, 100)}...
                </p>
                <div className="text-sm text-gray-500">
                  {new Date(post.post_createdAt).toLocaleDateString('tr-TR')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
