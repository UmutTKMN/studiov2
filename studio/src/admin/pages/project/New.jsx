import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../../services/projectService";
import { toast } from "react-hot-toast";
import ProjectForm from "./components/ProjectForm";

const NewProject = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_title: "",
    project_description: "",
    project_owner: "",
    project_tags: "",
    project_status: "pending",
    project_start_date: "",
    project_end_date: "",
    project_budget: "",
    project_image: null
  });

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
      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        toast.error("Lütfen geçerli bir resim dosyası seçin");
        return;
      }

      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Resim dosyası 5MB'dan büyük olamaz");
        return;
      }

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
      // Temel validasyon
      if (!formData.project_title.trim()) {
        toast.error("Proje başlığı zorunludur");
        setIsLoading(false);
        return;
      }

      if (!formData.project_owner) {
        toast.error("Proje sahibi zorunludur");
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      
      // Temel metin alanlarını ekle
      formDataToSend.append("project_title", formData.project_title);
      formDataToSend.append("project_description", formData.project_description || "");
      formDataToSend.append("project_owner", formData.project_owner);
      formDataToSend.append("project_tags", formData.project_tags || "");
      formDataToSend.append("project_status", formData.project_status || "pending");
      formDataToSend.append("project_start_date", formData.project_start_date || "");
      formDataToSend.append("project_end_date", formData.project_end_date || "");
      formDataToSend.append("project_budget", formData.project_budget || "");
      
      // Resim varsa ve bir File ise ekle
      if (formData.project_image instanceof File) {
        formDataToSend.append("project_image", formData.project_image);
      }

      const response = await projectService.createProject(formDataToSend);
      console.log("Proje oluşturma yanıtı:", response);
      toast.success("Proje başarıyla oluşturuldu");
      navigate("/admin/projects");
    } catch (error) {
      console.error("Proje oluşturma hatası:", error);
      const errorMessage = error.response?.data?.message || "Proje oluşturulurken bir hata oluştu";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProjectForm
      formData={formData}
      isLoading={isLoading}
      handleChange={handleChange}
      handleEditorChange={handleEditorChange}
      handleImageChange={handleImageChange}
      handleSubmit={handleSubmit}
      handleCancel={() => {
        if (window.confirm("Yapmış olduğunuz değişiklikler kaybolacak. Emin misiniz?")) {
          navigate("/admin/projects");
        }
      }}
      isEdit={false}
    />
  );
};

export default NewProject;