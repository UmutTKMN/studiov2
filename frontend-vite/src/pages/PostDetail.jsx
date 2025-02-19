import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { postService } from "../services/api";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await postService.getPostBySlug(slug);
        setPost(response.data.data); // Direkt olarak backend'den gelen veriyi kullan
        setError(null);
      } catch (err) {
        setError("Yazı detayları yüklenirken bir hata oluştu.");
        console.error("Yazı detay hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Hata</h3>
        <p>{error}</p>
        <Link to="/posts" className="text-blue-500 hover:underline mt-4 inline-block">
          Yazılara Dön
        </Link>
      </div>
    </div>
  );

  if (!post) return (
    <div className="text-center">
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Yazı Bulunamadı</h3>
        <p>Aradığınız yazı mevcut değil veya kaldırılmış olabilir.</p>
        <Link to="/posts" className="text-blue-500 hover:underline mt-4 inline-block">
          Yazılara Dön
        </Link>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Belirtilmemiş";
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Geçersiz Tarih";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="mb-6">
        <Link to="/posts" className="text-blue-500 hover:underline flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.707 4.293a1 1 0 010 1.414L7.414 9H15a1 1 0 110 2H7.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Yazılara Dön
        </Link>
      </nav>

      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        {post.image && (
          <div className="relative h-[400px]">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            {post.author_image ? (
              <img
                src={post.author_image}
                alt={post.author_name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-medium">
                  {post.author_name?.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-500">Yazar</p>
              <p className="font-medium">{post.author_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Yayınlanma Tarihi</p>
              <p className="text-sm">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {post.excerpt && (
            <div className="mb-8 text-lg text-gray-600 italic">
              {post.excerpt}
            </div>
          )}

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                {post.category && (
                  <Link 
                    to={`/categories/${post.category.slug}`}
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100"
                  >
                    {post.category.name}
                  </Link>
                )}
              </div>
              <div>
                Son güncelleme: {formatDate(post.updatedAt)}
              </div>
            </div>
          </div>

          {post.tags && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
