import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, EditPencil, Trash, Plus } from "iconoir-react";
import { toast } from "react-hot-toast"; // Toast import ekle
import Header from "../../components/table/Header";
import Footer from "../../components/table/Footer";
import Table from "../../components/table";
import { categoryService } from "../../services/categoryService";

function Categories() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await categoryService.getAllCategories();
        if (response?.data?.categories) {
          setData(response.data.categories);
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        setError(`Kategoriler yüklenirken hata: ${err.message || "Lütfen tekrar deneyin."}`);
        toast.error("Kategoriler yüklenirken bir hata oluştu");
        console.error("Kategori yükleme hatası:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [currentPage]);

  const handleDelete = async (row) => {
    if (!row.slug) {
      toast.error('Silme için geçerli slug bulunamadı');
      return;
    }

    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      setIsLoading(true);
      try {
        await categoryService.deleteCategory(row.slug);
        setData(prevData => prevData.filter(category => category.slug !== row.slug));
        toast.success('Kategori başarıyla silindi!');
      } catch (err) {
        toast.error(err.response?.data?.message || "Kategori silinirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddCategory = () => {
    navigate('/admin/categories/new');
  };

  const handleEditCategory = (row) => {
    const identifier = row.slug || row.id;
    navigate(`/admin/categories/edit/${identifier}`);
  };

  const headers = [
    {
      key: "name",
      label: "Kategori Adı",
      render: (value, row) => (
        <div className="flex items-center">
          <FolderPlus className="w-5 h-5 mr-2 text-gray-500" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "slug",
      label: "URL",
      render: (value) => <code className="text-sm bg-gray-100 px-2 py-1 rounded">{value}</code>
    },
    {
      key: "post_count",
      label: "Yazı Sayısı",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {value || 0}
        </span>
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
            onClick={() => handleEditCategory(row)}
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
        title="Kategoriler"
        icon={FolderPlus}
        buttonProps={{
          variant: "gradient",
          color: "primary",
          size: "sm",
          icon: Plus,
          children: "Yeni Kategori",
          onClick: handleAddCategory,
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
        totalPages={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Categories;
