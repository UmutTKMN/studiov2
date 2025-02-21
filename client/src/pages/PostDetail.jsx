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
        setPost(response.data.post); // Direkt backend'den gelen post objesini kullan
        setError(null);
      } catch (err) {
        setError("Yazı yüklenirken bir hata oluştu");
        console.error("Hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="text-center py-10">Yükleniyor...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;
  if (!post) return <div className="text-center py-10">Gönderi bulunamadı.</div>;

  return (
    <div>
      <Link to="/posts" className="text-blue-500 hover:underline flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.707 4.293a1 1 0 010 1.414L7.414 9H15a1 1 0 110 2H7.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Yazılara Dön
      </Link>

      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        {post?.post_image && (
          <div className="relative h-[400px]">
            <img src={post.post_image} alt={post.post_title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post?.post_title}</h1>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-medium">
                  {post?.author_name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Yazar</p>
                <p className="font-medium">{post?.author_name}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 text-right">
              <div>Görüntülenme: {post?.post_views}</div>
              <div>Beğeni: {post?.post_likes}</div>
              <div>Yorum: {post?.post_comments}</div>
            </div>
          </div>

          {post?.post_excerpt && (
            <div className="mb-6 text-lg text-gray-600 italic border-l-4 border-gray-200 pl-4">
              {post.post_excerpt}
            </div>
          )}

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-wrap">{post?.post_content}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center gap-2">
                {post?.category_name && (
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    {post.category_name}
                  </span>
                )}
              </div>
              <div>
                <div>Oluşturulma: {new Date(post?.post_createdAt).toLocaleDateString('tr-TR')}</div>
                <div>Güncelleme: {new Date(post?.post_updatedAt).toLocaleDateString('tr-TR')}</div>
              </div>
            </div>
          </div>

          {post?.post_tags && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {post.post_tags.split(',').map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
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
