import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  EditPencil,
  Trash,
  Plus,
  Calendar,
  User,
  Check,
} from "iconoir-react";
import Header from "../../components/table/Header";
import Footer from "../../components/table/Footer";
import Table from "../../components/table";
import { projectService } from "../../services/projectService";

function Projects() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await projectService.getAllProjects();

        if (response?.data?.projects) {
          setData(response.data.projects);
        } else if (Array.isArray(response?.data)) {
          setData(response.data);
        } else if (response?.data) {
          // Tek bir nesne olarak geldiyse
          setData([response.data]);
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        setError(
          `Projeler yüklenirken hata: ${
            err.message || "Lütfen tekrar deneyin."
          }`
        );
        console.error("Proje yükleme hatası:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [currentPage]);

  const handleDelete = async (row) => {
    if (!row.project_id) {
      console.error("Silme için geçerli ID bulunamadı:", row);
      return;
    }

    if (window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      setIsLoading(true);
      try {
        await projectService.deleteProject(row.project_id);
        setData((prevData) =>
          prevData.filter((project) => project.project_id !== row.project_id)
        );
        console.log("Proje başarıyla silindi!");
      } catch (err) {
        setError(
          `Proje silinirken hata: ${err.message || "Lütfen tekrar deneyin."}`
        );
        console.error("Proje silme hatası:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddProject = () => {
    navigate("/admin/projects/new");
  };

  const handleEditProject = (row) => {
    const identifier = row.project_slug || row.id;
    navigate(`/admin/projects/edit/${identifier}`);
  };

  // Tarih formatını düzenleme fonksiyonu
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  // Empty state tanımlaması
  const emptyState = [
    {
      key: "no-projects",
      title: "Proje Bulunamadı",
      description:
        "Henüz proje bulunmuyor",
    },
  ];

  const headers = [
    {
      key: "project_title",
      label: "Proje Adı",
      render: (value, row) => (
        <div className="flex items-center">
          {row.project_image ? (
            <img
              src={row.project_image}
              className="w-8 h-8 mr-2 rounded object-cover"
              alt={value}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-project.png";
              }}
            />
          ) : (
            <div className="w-8 h-8 mr-2 rounded bg-gray-200 flex items-center justify-center">
              <Archive className="w-4 h-4 text-gray-500" />
            </div>
          )}
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-gray-500">
              {row.project_description
                ? row.project_description.length > 50
                  ? row.project_description.substring(0, 50) + "..."
                  : row.project_description
                : "Açıklama yok"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "project_status",
      label: "Durum",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "active" || value === "completed"
              ? "bg-green-100 text-green-800"
              : value === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === "active"
            ? "Aktif"
            : value === "completed"
            ? "Tamamlandı"
            : value === "pending"
            ? "Beklemede"
            : value === "cancelled"
            ? "İptal Edildi"
            : value || "Belirsiz"}
        </span>
      ),
    },
    {
      key: "owner_name",
      label: "Proje Sahibi",
      render: (value) => (
        <div className="flex items-center">
          <User className="w-4 h-4 mr-1 text-gray-500" />
          <span>{value || "Belirtilmemiş"}</span>
        </div>
      ),
    },
    {
      key: "project_start_date",
      label: "Başlangıç Tarihi",
      render: (value) => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
          <span>{formatDate(value)}</span>
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
            onClick={() => handleEditProject(row)}
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
    },
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Projeler"
        icon={Archive}
        buttonProps={{
          variant: "gradient",
          color: "primary",
          size: "sm",
          icon: Plus,
          children: "Yeni Proje",
          onClick: handleAddProject,
        }}
      />

      {error ? (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {/* Veri durumunu görüntülemek için debug bilgisi */}
          <div className="p-2 text-sm text-gray-500">
            Yükleme durumu: {isLoading ? "Yükleniyor..." : "Tamamlandı"}
            <br />
            Veri sayısı: {data.length}
          </div>
          <Table
            headers={headers}
            data={data}
            isLoading={isLoading}
            empty={emptyState}
            emptyIcon={Archive}
            className="mt-4"
          />
        </>
      )}

      <Footer
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Projects;
