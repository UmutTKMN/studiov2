import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Header from "../../components/table/Header";
import Footer from "../../components/table/Footer";
import Table from "../../components/table";
import { postService } from "../../services/postService";
import { 
  Plus, MultiplePages, EditPencil, Trash, 
  Archive, RefreshDouble, Filter, Search 
} from "iconoir-react";

function Posts() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    searchQuery: '',
    sort: '-created_at',
    limit: 10
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, filters, showArchived]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let response;
      
      if (showArchived) {
        response = await postService.getArchivedPosts({
          page: currentPage,
          ...filters
        });
      } else {
        response = await postService.getAllPosts({
          page: currentPage,
          ...filters,
          status: filters.status || undefined,
          category: filters.category || undefined,
          q: filters.searchQuery || undefined
        });
      }

      if (response?.data?.posts) {
        setData(response.data.posts);
        setTotalPages(Math.ceil(response.data.total / filters.limit));
      } else {
        setData([]);
        setTotalPages(0);
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

  const handleArchive = async (row) => {
    const identifier = row.slug || row.id;
    setIsLoading(true);
    try {
      await postService.archivePost(identifier);
      setData(prevData => prevData.filter(post => post.id !== row.id));
      toast.success('Yazı başarıyla arşivlendi!');
    } catch (err) {
      toast.error(err.message || "Yazı arşivlenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (row) => {
    const identifier = row.slug || row.id;
    setIsLoading(true);
    try {
      await postService.restorePost(identifier);
      setData(prevData => prevData.filter(post => post.id !== row.id));
      toast.success('Yazı başarıyla geri yüklendi!');
    } catch (err) {
      toast.error(err.message || "Yazı geri yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRows.length === 0) {
      toast.error('Lütfen işlem yapmak için yazı seçin');
      return;
    }

    setIsLoading(true);
    const promises = selectedRows.map(rowId => {
      const row = data.find(item => item.id === rowId);
      const identifier = row?.slug || rowId;
      
      if (action === 'delete') {
        return postService.deletePost(identifier);
      } else if (action === 'archive') {
        return postService.archivePost(identifier);
      } else if (action === 'restore') {
        return postService.restorePost(identifier);
      }
    });

    try {
      await Promise.all(promises);
      toast.success(
        action === 'delete' 
          ? 'Seçili yazılar silindi!' 
          : action === 'archive'
            ? 'Seçili yazılar arşivlendi!'
            : 'Seçili yazılar geri yüklendi!'
      );
      fetchPosts();
      setSelectedRows([]);
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = () => {
    navigate('/admin/posts/new');
  };

  const handleEditPost = (row) => {
    const identifier = row.slug || row.id;
    navigate(`/admin/posts/edit/${identifier}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleFilterChange('searchQuery', e.target.value);
    }
  };

  const toggleArchiveView = () => {
    setShowArchived(prev => !prev);
    setSelectedRows([]);
    setCurrentPage(1);
  };

  const handleRowSelect = (rowId, isSelected) => {
    if (isSelected) {
      setSelectedRows(prev => [...prev, rowId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== rowId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedRows(data.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const headers = [
    {
      key: "select",
      label: "",
      className: "w-10",
      render: (_, row) => (
        <input 
          type="checkbox" 
          checked={selectedRows.includes(row.id)} 
          onChange={(e) => handleRowSelect(row.id, e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
      ),
    },
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
            : value === "archived"
            ? "bg-gray-100 text-gray-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {value === "published" ? "Yayında" : value === "archived" ? "Arşivlenmiş" : "Taslak"}
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
          {!showArchived ? (
            <>
              <button
                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                onClick={() => handleEditPost(row)}
                title="Düzenle"
              >
                <EditPencil className="h-5 w-5" />
              </button>
              <button
                className="text-amber-500 hover:text-amber-700 p-1 rounded hover:bg-amber-50"
                onClick={() => handleArchive(row)}
                title="Arşivle"
              >
                <Archive className="h-5 w-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                onClick={() => handleDelete(row)}
                title="Sil"
              >
                <Trash className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <button
                className="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50"
                onClick={() => handleRestore(row)}
                title="Geri Yükle"
              >
                <RefreshDouble className="h-5 w-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                onClick={() => handleDelete(row)}
                title="Kalıcı Olarak Sil"
              >
                <Trash className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <Header
        title={showArchived ? "Arşivlenmiş Yazılar" : "Yazılar"}
        icon={MultiplePages}
        buttonProps={{
          variant: "gradient",
          color: "primary",
          size: "sm",
          icon: Plus,
          children: "Yeni Yazı",
          onClick: handleAddPost,
          disabled: showArchived,
        }}
      />

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Yazı ara..."
              className="pl-9 pr-4 py-2 border rounded-lg w-full max-w-xs"
              onKeyUp={handleSearch}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select 
            className="border rounded-lg px-3 py-2"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Tüm Durumlar</option>
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
          </select>
          
          <select 
            className="border rounded-lg px-3 py-2"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="-created_at">En Yeni</option>
            <option value="created_at">En Eski</option>
            <option value="-updated_at">Son Güncellenen</option>
            <option value="-views">En Çok Görüntülenen</option>
          </select>
          
          <button 
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
              showArchived ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-700'
            }`}
            onClick={toggleArchiveView}
          >
            <Archive className="h-5 w-5" /> 
            {showArchived ? "Normal Yazıları Göster" : "Arşivi Göster"}
          </button>
        </div>
        
        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">{selectedRows.length} yazı seçildi</span>
            {!showArchived ? (
              <button
                className="text-amber-600 hover:text-amber-800 py-1 px-2 text-sm"
                onClick={() => handleBulkAction('archive')}
              >
                Arşivle
              </button>
            ) : (
              <button
                className="text-green-600 hover:text-green-800 py-1 px-2 text-sm"
                onClick={() => handleBulkAction('restore')}
              >
                Geri Yükle
              </button>
            )}
            <button
              className="text-red-600 hover:text-red-800 py-1 px-2 text-sm"
              onClick={() => handleBulkAction('delete')}
            >
              Sil
            </button>
          </div>
        )}
      </div>

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
        emptyMessage={`Henüz ${showArchived ? 'arşivlenmiş' : ''} yazı bulunmuyor`}
        onSelectAll={handleSelectAll}
        selectedRows={selectedRows}
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
