import { trpc } from "../utils/trpc";
import { useEffect } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Category() {
  return (
    <ErrorBoundary>
      <CategoryContent />
    </ErrorBoundary>
  );
}

function CategoryContent() {
  const categoryQuery = trpc.category.getAll.useQuery(
    { limit: 5 },
    {
      retry: 2,
      refetchInterval: false,
      onError: (error) => {
        console.error("Category sorgusu hatası:", error);
      },
    }
  );

  // Debug - Veri yapısını kontrol et
  useEffect(() => {
    if (categoryQuery.data) {
      console.log("Category veri yapısı:", categoryQuery.data);
    }
  }, [categoryQuery.data]);

  // Veri yapısına göre görüntüleme mantığı
  const renderCategories = () => {
    if (categoryQuery.isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      );
    }

    if (categoryQuery.error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">
            Veri alınamadı: {categoryQuery.error.message}
          </p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded text-sm"
            onClick={() => categoryQuery.refetch()}
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    // Veri ve yapısını kontrol et
    const categoryData = categoryQuery.data;
    if (!categoryData) return <p>Kategori bulunamadı</p>;

    // SuperJSON tarafından dönüştürülen doğru veri yapısı
    if (categoryData.json && Array.isArray(categoryData.json)) {
      return (
        <div className="grid gap-4">
          {categoryData.json.map((category) => (
            <div key={category.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
              <span className="text-xs text-gray-500">
                {category.post_count} yazı
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Eğer verinin kendisi bir diziyse
    if (Array.isArray(categoryData)) {
      return (
        <div className="grid gap-4">
          {categoryData.map((category) => (
            <div key={category.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
              <span className="text-xs text-gray-500">
                {category.post_count} yazı
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Beklenmeyen veri yapısı
    return <p>Beklenmeyen veri yapısı: {JSON.stringify(categoryData)}</p>;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kategoriler</h1>

      {/* category listesi */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Tüm Kategoriler</h2>
        {renderCategories()}
      </div>
    </div>
  );
}
