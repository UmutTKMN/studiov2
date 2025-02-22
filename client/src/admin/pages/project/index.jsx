import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, EditPencil, Trash, Plus } from "iconoir-react";
import Header from "../../components/table/Header";
import Footer from "../../components/table/Footer";
import Table from "../../components/table";
import { projectService } from "../../services/api";

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
    if (!row.id) {
      console.error("Silme için geçerli ID bulunamadı:", row);
      return;
    }

    if (window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      setIsLoading(true);
      try {
        await projectService.deleteProject(row.id);
        setData((prevData) =>
          prevData.filter((project) => project.id !== row.id)
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
    navigate(`/admin/projects/${row.id}/edit`);
  };

  const headers = [
    {
      key: "title",
      label: "Proje Adı",
      render: (value, row) => (
        <div className="flex items-center">
          <img src={row.thumbnail} className="w-8 h-8 mr-2 rounded" />
          {value}
        </div>
      ),
    },
    {
      key: "category",
      label: "Kategori",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {value}
        </span>
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
      key: "actions",
      label: "İşlemler",
      className: "text-right pr-4",
      render: (_, row) => (
        <div className="flex justify-end items-center gap-2">
          <button
            className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
            onClick={() => handleEditProject(row)}
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

export default Projects;
