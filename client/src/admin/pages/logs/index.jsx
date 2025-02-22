import React, { useState, useEffect } from "react";
import { ClockRotateRight } from "iconoir-react";
import Header from "../../components/table/Header";
import Footer from "../../components/table/Footer";
import Table from "../../components/table";
import { activityLogService } from "../../services/api";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";

function Logs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    action: "",
    table: "",
    sortBy: "desc",
    search: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await activityLogService.getRecentActivity(
          currentPage,
          20,
          filters
        );
        if (response?.data) {
          setData(response.data.data);
          setPagination(response.data.pagination);
        } else {
          console.warn("API yanıtı beklenen formatta değil:", response);
          setData([]);
        }
        setError(null);
      } catch (err) {
        setError(
          `Kayıtlar yüklenirken hata: ${
            err.message || "Lütfen tekrar deneyin."
          }`
        );
        console.error("Log yükleme hatası:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [currentPage, filters]);

  const filterOptions = {
    actions: [
      { label: "Oluşturma", value: "CREATE" },
      { label: "Güncelleme", value: "UPDATE" },
      { label: "Silme", value: "DELETE" },
      { label: "Giriş", value: "LOGIN" },
    ],
    tables: [
      { label: "Kullanıcılar", value: "users" },
      { label: "Gönderiler", value: "posts" },
      { label: "Kategoriler", value: "categories" },
      { label: "Projeler", value: "projects" },
    ],
  };
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Arama için yeni fonksiyon
  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const headers = [
    {
      key: "log_id",
      label: "ID",
    },
    {
      key: "user_name",
      label: "Kullanıcı",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: "log_action",
      label: "İşlem",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
          {value}
        </span>
      ),
    },
    {
      key: "log_table",
      label: "Tablo",
    },
    {
      key: "log_description",
      label: "Açıklama",
    },
    {
      key: "log_createdAt",
      label: "Tarih",
      render: (value) => new Date(value).toLocaleString("tr-TR"),
    },
  ];

  return (
    <div className="space-y-6">
      <Header title="Sistem Kayıtları" icon={ClockRotateRight} />
      
      {/* Filtreler ve Arama Alanı */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Ara..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="col-span-1"
        />
        
        <Select
          options={[{ label: "Tüm İşlemler", value: "" }, ...filterOptions.actions]}
          value={filters.action}
          onChange={(e) => handleFilterChange("action", e.target.value)}
          className="col-span-1"
        />
        
        <Select
          options={[{ label: "Tüm Tablolar", value: "" }, ...filterOptions.tables]}
          value={filters.table}
          onChange={(e) => handleFilterChange("table", e.target.value)}
          className="col-span-1"
        />
        
        <Select
          options={[
            { label: "Yeniden Eskiye", value: "desc" },
            { label: "Eskiden Yeniye", value: "asc" }
          ]}
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="col-span-1"
        />
      </div>

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
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Logs;
