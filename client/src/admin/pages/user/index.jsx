import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  EditPencil,
  Trash,
  Plus,
  Mail,
} from "iconoir-react";
import Header from "../../components/table/Header";
import Footer from "../../components/table/Footer";
import Table from "../../components/table";
import { userService } from "../../services/api";
import { formatDate } from "../../utils/dateUtils";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

function Users() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtreleme state'leri
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    country: "",
    city: "",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getAllUsers(currentPage, limit, filters);
      
      setData(response.users);
      setTotalPages(response.pagination.totalPages);
      
    } catch (error) {
      setError(error.message);
      setData([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, limit, filters]);

  // Filtre değişikliklerini handle et
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleDelete = async (row) => {
    if (!row.id) {
      console.error("Silme için geçerli ID bulunamadı:", row);
      return;
    }

    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      setIsLoading(true);
      try {
        await userService.deleteUser(row.id);
        setData((prevData) => prevData.filter((user) => user.id !== row.id));
        console.log("Kullanıcı başarıyla silindi!");
      } catch (err) {
        setError(
          `Kullanıcı silinirken hata: ${
            err.message || "Lütfen tekrar deneyin."
          }`
        );
        console.error("Kullanıcı silme hatası:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const headers = [
    {
      key: "name",
      label: "Kullanıcı",
      render: (value, row) => (
        <div className="flex items-center">
          <img
            src={row.profileImage || "/default-avatar.png"}
            alt={value}
            className="w-8 h-8 rounded-full mr-2 object-cover"
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Konum",
      render: (location) => (
        <span className="text-gray-600">
          {location.city && location.country
            ? `${location.city}, ${location.country}`
            : "Belirtilmemiş"}
        </span>
      ),
    },
    {
      key: "role",
      label: "Rol",
      render: (_, row) => (
        <div>
          {row.role ? (
            <div className="flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  row.role.id === 1
                    ? "bg-purple-100 text-purple-800"
                    : row.role.id === 2
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {row.role.name || "Kullanıcı"}
              </span>
            </div>
          ) : (
            <span className="text-gray-500">Belirtilmemiş</span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Kayıt Tarihi",
      render: (value) => <span>{formatDate(value)}</span>,
    },
    {
      key: "lastLogin",
      label: "Son Giriş",
      render: (value) => (
        <span className="text-gray-600">{formatDate(value)}</span>
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
            onClick={() => navigate(`/admin/users/${row.id}`)}
          >
            <EditPencil className="h-5 w-5" />
          </button>
          <button
            className="text-purple-500 hover:text-purple-700 p-1 rounded hover:bg-purple-50"
            onClick={() => (window.location.href = `mailto:${row.email}`)}
          >
            <Mail className="h-5 w-5" />
          </button>
          <button
            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
            onClick={() => handleDelete(row)}
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  // Select options tanımlamaları
  const roleOptions = [
    { value: "", label: "Tüm Roller" },
    { value: "1", label: "Admin" },
    { value: "2", label: "Kullanıcı" },
  ];

  const sortByOptions = [
    { value: "createdAt", label: "Kayıt Tarihi" },
    { value: "lastLogin", label: "Son Giriş" },
    { value: "name", label: "İsim" },
  ];

  const sortOrderOptions = [
    { value: "desc", label: "Azalan" },
    { value: "asc", label: "Artan" },
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Kullanıcılar"
        icon={User}
        buttonProps={{
          variant: "gradient",
          color: "primary",
          size: "sm",
          icon: Plus,
          children: "Yeni Kullanıcı",
          onClick: () => navigate("/admin/users/new"),
        }}
      />

      {/* Filtreleme Alanı */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Arama Input'u */}
        <Input
          placeholder="Kullanıcı ara..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          size="md"
        />

        {/* Rol Filtresi */}
        <Select
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          options={roleOptions}
          label=""
          size="md"
        />

        {/* Sıralama */}
        <Select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          options={sortByOptions}
          label=""
          size="md"
        />

        {/* Sıralama Yönü */}
        <Select
          value={filters.sortOrder}
          onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
          options={sortOrderOptions}
          label=""
          size="md"
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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        limitOptions={[10, 20, 50, 100]}
        currentLimit={limit}
        onLimitChange={setLimit}
      />
    </div>
  );
}

export default Users;
