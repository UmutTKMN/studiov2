import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectService } from "../../services/projectService";
import { toast } from "react-hot-toast";
import ProjectForm from "./components/ProjectForm"; // Doğru import yolunu kullanın

const EditProject = () => {
  const navigate = useNavigate();
  const { identifier } = useParams(); // identifier doğru kullanılıyor
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    project_title: "",
    project_description: "",
    project_owner: "",
    project_tags: "",
    project_status: "pending",
    project_start_date: "",
    project_end_date: "",
    project_budget: "",
    project_image: null,
  });

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const response = await projectService.getProject(identifier);
        console.log("API yanıtı:", response); // Tam yanıtı kontrol et
        console.log("Proje detayı:", response.data); // Veri yapısını kontrol et

        // API'den gelen veri yapısını kontrol edelim
        let project;
        if (response.data.project) {
          project = response.data.project;
        } else {
          project = response.data;
        }

        console.log("İşlenecek proje verisi:", project); // İşlenecek veriyi kontrol et

        // Form verilerini ayarla - kontroller ekleyelim
        setFormData({
          project_title: project.project_title || "",
          project_description: project.project_description || "",
          project_owner: project.project_owner || project.owner_id || "",
          project_tags: project.project_tags || "",
          project_status: project.project_status || "pending",
          project_start_date: project.project_start_date
            ? project.project_start_date.split("T")[0]
            : "",
          project_end_date: project.project_end_date
            ? project.project_end_date.split("T")[0]
            : "",
          project_budget: project.project_budget || "",
          project_image: project.project_image || null,
        });

        console.log("Form verisi ayarlandı:", formData); // Ayarlanan formu kontrol et
      } catch (error) {
        console.error("Proje detayı yüklenirken hata:", error);
        toast.error("Proje bilgileri yüklenirken bir hata oluştu");
        navigate("/admin/projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [identifier, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      project_description: content,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          project_image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Form verilerini FormData'ya ekle
      Object.keys(formData).forEach((key) => {
        if (key === "project_image" && formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await projectService.updateProject(identifier, formDataToSend);
      toast.success("Proje başarıyla güncellendi");
      navigate("/admin/projects");
    } catch (error) {
      console.error("Proje güncelleme hatası:", error);
      toast.error(
        error.response?.data?.message || "Proje güncellenirken bir hata oluştu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hata ayıklama için form verilerini görüntüle */}
      <div style={{ display: "none" }}>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>

      <ProjectForm
        formData={formData}
        isLoading={isLoading}
        handleChange={handleChange}
        handleEditorChange={handleEditorChange}
        handleImageChange={handleImageChange}
        handleSubmit={handleSubmit}
        handleCancel={() => {
          if (
            window.confirm(
              "Yapmış olduğunuz değişiklikler kaybolacak. Emin misiniz?"
            )
          ) {
            navigate("/admin/projects");
          }
        }}
        isEdit={true}
      />
    </>
  );
};

export default EditProject;
