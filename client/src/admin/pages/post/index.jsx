import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await postService.getAllPosts();
        if (response?.data?.posts) {
          setData(response.data.posts);
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        setError(`Error loading posts: ${err.message || "Please try again later."}`);
        console.error("Error fetching posts:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  const handleDelete = async (row) => {
    if (!row.id) {
      console.error('Silme için geçerli ID bulunamadı:', row);
      return;
    }

    const postId = row.id;

    if (window.confirm('Bu postu silmek istediğinizden emin misiniz?')) {
      setIsLoading(true);
      try {
        await postService.deletePost(postId);
        setData(prevData => prevData.filter(post => (post.id) !== postId));
        // Optional: Toast mesajı göster
        console.log('Post başarıyla silindi!');
      } catch (err) {
        setError(`Post silinirken hata oluştu: ${err.message || "Lütfen tekrar deneyin."}`);
        console.error("Post silme hatası:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddPost = () => {
    navigate('/admin/posts/new');
  };

  const handleEditPost = (row) => {
    navigate(`/admin/posts/:id/edit`);
  };

  const headers = [
    {
      key: "title",
      label: "Başlık",
      render: (value, row) => (
        <div className="flex items-center">
          <img src={row.image} className="w-8 h-8 mr-2 rounded" />
          {value}
        </div>
      ),
    },
    {
      key: "status",
      label: "Durum",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "author",
      label: "Yazar",
      render: (value) => (
        <div className="flex items-center">
          <img src={value.image} className="w-8 h-8 mr-2 rounded" />
          {value.name}
        </div>
      ),
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
          >
            <EditPencil className="h-5 w-5" />
          </button>
          <button
            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
            onClick={() => handleDelete(row)}
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
          onClick: () => handleAddPost(),
        }}
      />

      {error ? (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : (
        <Table
          headers={headers}
          data={data}
          isLoading={isLoading}
          className="mt-4"
        />
      )}
      
      <Footer
        currentPage={currentPage}
        totalPages={10} // API'den gelen toplam sayfa sayısı
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default Posts;
