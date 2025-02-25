import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Header from "../../components/table/Header";
import Footer from "../../components/table/Footer";
import Table from "../../components/table";
import { postService } from "../../services/postService";
import { Plus, MultiplePages, EditPencil, Trash } from "iconoir-react";

function Posts() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await postService.getAllPosts({
          page: currentPage,
          limit: 10,
          sort: '-created_at'
        });

        if (response?.data?.posts) {
          setData(response.data.posts);
          setTotalPages(Math.ceil(response.data.total / 10));
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        setError("Yazılar yüklenirken bir hata oluştu");
        toast.error(err.message || "Lütfen tekrar deneyin");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  const handleDelete = async (row) => {
    if (!row.slug && !row.id) {
      toast.error('Silme için geçerli tanımlayıcı bulunamadı');
      return;
    }

    const identifier = row.slug || row.id;

    if (window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      setIsLoading(true);
      try {
        await postService.deletePost(identifier);
        setData(prevData => prevData.filter(post => post.id !== row.id));
        toast.success('Yazı başarıyla silindi!');
      } catch (err) {
        toast.error(err.message || "Yazı silinirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddPost = () => {
    navigate('/admin/posts/new');
  };

  const handleEditPost = (row) => {
    const identifier = row.slug || row.id;
    navigate(`/admin/posts/edit/${identifier}`);
  };

  const headers = [
    {
      key: "title",
      label: "Başlık",
      render: (value, row) => (
        <div className="flex items-center">
          {row.image && (
            <img 
              src={row.image} 
              alt={value} 
              className="w-8 h-8 mr-2 rounded object-cover"
              onError={(e) => e.target.src = '/default-post.png'} 
            />
          )}
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-gray-500">{row.excerpt}</div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Durum",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === "published"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {value === "published" ? "Yayında" : "Taslak"}
        </span>
      ),
    },
    {
      key: "category",
      label: "Kategori",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {value?.name || "Kategorisiz"}
        </span>
      ),
    },
    {
      key: "author",
      label: "Yazar",
      render: (value) => (
        <div className="flex items-center">
          {value?.image && (
            <img 
              src={value.image} 
              alt={value.name} 
              className="w-6 h-6 mr-2 rounded-full"
              onError={(e) => e.target.src = '/default-avatar.png'} 
            />
          )}
          <span>{value?.name || "Anonim"}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Oluşturma Tarihi",
      render: (value) => new Date(value).toLocaleDateString('tr-TR'),
    },
    {
      key: "actions",
      label: "İşlemler",
      className: "text-right pr-4",
      render: (_, row) => (
        <div className="flex justify-end items-center gap-2">
          <button
            className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
            onClick={() => handleEditPost(row)}
            title="Düzenle"
          >
            <EditPencil className="h-5 w-5" />
          </button>
          <button
            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
            onClick={() => handleDelete(row)}
            title="Sil"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Yazılar"
        icon={MultiplePages}
        buttonProps={{
          variant: "gradient",
          color: "primary",
          size: "sm",
          icon: Plus,
          children: "Yeni Yazı",
          onClick: handleAddPost,
        }}
      />

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <Table
        headers={headers}
        data={data}
        isLoading={isLoading}
        className="mt-4"
        emptyMessage="Henüz yazı bulunmuyor"
      />
      
      <Footer
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Posts;
