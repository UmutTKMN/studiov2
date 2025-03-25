import { trpc } from "../utils/trpc";
import { useEffect } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import Category from "./Category";

export default function Home() {
  // Ana bileşeni Error Boundary ile sarıyoruz
  return (
    <ErrorBoundary>
      <HomeContent />
    </ErrorBoundary>
  );
}

function HomeContent() {
  const postQuery = trpc.post.getAll.useQuery(
    { limit: 5 },
    {
      retry: 2,
      refetchInterval: false,
      onError: (error) => {
        console.error("Post sorgusu hatası:", error);
      },
    }
  );

  // Debug - Veri yapısını kontrol et
  useEffect(() => {
    if (postQuery.data) {
      console.log("Post veri yapısı:", postQuery.data);
    }
  }, [postQuery.data]);

  // Veri yapısına göre görüntüleme mantığı
  const renderPosts = () => {
    if (postQuery.isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      );
    }

    if (postQuery.error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">
            Veri alınamadı: {postQuery.error.message}
          </p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded text-sm"
            onClick={() => postQuery.refetch()}
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    // Veri ve yapısını kontrol et
    const postData = postQuery.data;
    if (!postData) return <p>Gönderi bulunamadı</p>;

    // SuperJSON tarafından dönüştürülen veri yapısı
    if (
      postData.json &&
      postData.json.posts &&
      Array.isArray(postData.json.posts)
    ) {
      return (
        <div className="grid gap-4">
          {postData.json.posts.map((post) => (
            <div key={post.post_id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{post.post_title}</h3>
              <p className="text-gray-600">
                {post.post_content.substring(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      );
    }

    // Eğer verinin kendisi bir diziyse
    if (Array.isArray(postData)) {
      return (
        <div className="grid gap-4">
          {postData.map((post) => (
            <div key={post.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-gray-600">
                {post.content.substring(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      );
    }

    // Beklenmeyen veri yapısı
    return <p>Beklenmeyen veri yapısı: {JSON.stringify(postData)}</p>;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ana Sayfa</h1>

      {/* Post listesi */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Son Gönderiler</h2>
        {renderPosts()}
      </div>
      <Category />
    </div>
  );
}
