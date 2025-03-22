import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  EditPencil,
  Trash,
  Archive,
  CalendarArrowUp,
  CalendarRotate,
  User,
  Hashtag,
  Eye,
  Heart,
  Message,
} from "iconoir-react";
import Button from "../../components/ui/Button";

const PostDetail = () => {
  const navigate = useNavigate();
  const { identifier } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      try {
        const response = await postService.getPost(identifier);
        // API yanıtını post değişkenine ayarla
        if (response?.data?.post) {
          setPost(response.data.post);
        } else {
          setPost(response.data);
        }
        setError(null);
      } catch (err) {
        setError("Post detayları yüklenirken bir hata oluştu");
        console.error("Post detay hatası:", err);
        toast.error("Post detayları yüklenemedi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [identifier]);

  const handleEdit = () => {
    navigate(`/admin/posts/edit/${identifier}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) {
      try {
        setIsLoading(true);
        await postService.deletePost(identifier);
        toast.success("Yazı başarıyla silindi");
        navigate("/admin/posts");
      } catch (error) {
        console.error("Silme hatası:", error);
        toast.error("Yazı silinirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleArchive = async () => {
    try {
      setIsLoading(true);
      await postService.archivePost(post.id || identifier);
      toast.success("Yazı başarıyla arşivlendi");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Arşivleme hatası:", error);
      toast.error("Yazı arşivlenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Tarih yok";
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Yükleniyor</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-semibold text-red-700">Hata</h2>
        <p className="text-red-600">{error || "Post bulunamadı"}</p>
        <Button
          variant="text"
          color="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate("/admin/posts")}
          className="mt-4"
        >
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Üst Başlık ve Butonlar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="text"
                color="secondary"
                size="sm"
                icon={ArrowLeft}
                onClick={() => navigate("/admin/posts")}
              >
                Geri Dön
              </Button>

              <div
                className={`px-3 py-1 rounded-full text-xs ${
                  post.post_status === "published"
                    ? "bg-green-100 text-green-800"
                    : post.post_status === "archived"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {post.post_status === "published"
                  ? "Yayında"
                  : post.post_status === "archived"
                  ? "Arşivlenmiş"
                  : "Taslak"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                color="primary"
                size="sm"
                icon={EditPencil}
                onClick={handleEdit}
              >
                Düzenle
              </Button>
              <Button
                variant="outlined"
                color="warning"
                size="sm"
                icon={Archive}
                onClick={handleArchive}
              >
                Arşivle
              </Button>
              <Button
                variant="outlined"
                color="danger"
                size="sm"
                icon={Trash}
                onClick={handleDelete}
              >
                Sil
              </Button>
            </div>
          </div>

          {/* İçerik Kartı */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Kapak Görseli (Varsa) */}
            {post.post_image && (
              <div className="w-full h-64 sm:h-80 bg-gray-100">
                <img
                  src={post.post_image}
                  alt={post.post_title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-post.png";
                  }}
                />
              </div>
            )}

            {/* İçerik */}
            <div className="p-6">
              {/* Başlık ve Özet */}
              <h1 className="text-3xl font-bold mb-4">{post.post_title}</h1>

              {post.post_excerpt && (
                <div className="mb-6 text-lg italic text-gray-700 pb-6 border-b border-gray-200">
                  {post.post_excerpt}
                </div>
              )}

              {/* Meta Bilgiler */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarArrowUp className="h-4 w-4 mr-1" />
                  <span>Oluşturulma: {formatDate(post.post_createdAt)}</span>
                </div>

                <div className="flex items-center">
                  <CalendarRotate className="h-4 w-4 mr-1" />
                  <span>Güncelleme: {formatDate(post.post_updatedAt)}</span>
                </div>

                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>Yazar: {post.author_name || "Anonim"}</span>
                </div>

                {post.category_name && (
                  <div className="flex items-center">
                    <Hashtag className="h-4 w-4 mr-1" />
                    <span>Kategori: {post.category_name}</span>
                  </div>
                )}
              </div>

              {/* İstatistikler */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="flex items-center px-3 py-1 bg-blue-50 rounded-full text-blue-700">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{post.post_views || 0} görüntülenme</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-red-50 rounded-full text-red-700">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{post.post_likes || 0} beğeni</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-green-50 rounded-full text-green-700">
                  <Message className="h-4 w-4 mr-1" />
                  <span>{post.post_comments || 0} yorum</span>
                </div>
              </div>

              {/* Etiketler */}
              {post.post_tags && (
                <div className="mb-6">
                  <div className="font-medium mb-2">Etiketler:</div>
                  <div className="flex flex-wrap gap-2">
                    {post.post_tags.split(",").map((tag, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-800"
                      >
                        {tag.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ana İçerik */}
              <div className="prose max-w-none mt-8">
                <div dangerouslySetInnerHTML={{ __html: post.post_content }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
