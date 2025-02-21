import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postService } from "../services/api";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await postService.getAllPosts();
        if (response?.data?.posts) {
          setPosts(response.data.posts);
        } else {
          setPosts([]); // Beklenmedik API yanıtı durumunda temizleme
        }
        setError(null);
      } catch (err) {
        setError(
          `Error loading posts: ${err.message || "Please try again later."}`
        );
        console.error("Error fetching posts:", err);
        setPosts([]); // Hata durumunda projeleri temizle
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!posts.length)
    return <div className="text-center p-4">No posts found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/posts/${post.slug}`}
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600 mt-2">
              {post.excerpt || post.content.substring(0, 150)}
            </p>
            {post.author && (
              <div className="mt-4 text-sm text-gray-500 flex items-center">
                {post.author.image && (
                  <img
                    src={post.author.image}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
