import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../../services/projectService";
import { toast } from "react-hot-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NewProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_title: "",
    project_description: "",
    project_owner: "",
    project_tags: "",
    project_status: "pending",
    project_start_date: "",
    project_end_date: "",
    project_budget: "",
    project_image: ""
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          project_image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.createProject(formData);
      toast.success("Proje başarıyla oluşturuldu");
      navigate("/admin/projects");
    } catch (error) {
      toast.error(error.message || "Proje oluşturulurken bir hata oluştu");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Yeni Proje Oluştur</h2>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Proje Başlığı
          </label>
          <input
            type="text"
            name="project_title"
            value={formData.project_title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Proje Açıklaması
          </label>
          <ReactQuill
            value={formData.project_description}
            onChange={handleEditorChange}
            className="h-64 mb-10"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Proje Sahibi
          </label>
          <input
            type="text"
            name="project_owner"
            value={formData.project_owner}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Etiketler (virgülle ayırın)
          </label>
          <input
            type="text"
            name="project_tags"
            value={formData.project_tags}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              name="project_start_date"
              value={formData.project_start_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              name="project_end_date"
              value={formData.project_end_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bütçe
          </label>
          <input
            type="number"
            name="project_budget"
            value={formData.project_budget}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="₺"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Proje Durumu
          </label>
          <select
            name="project_status"
            value={formData.project_status}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="pending">Beklemede</option>
            <option value="in_progress">Devam Ediyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Proje Görseli
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formData.project_image && (
            <img
              src={formData.project_image}
              alt="Önizleme"
              className="mt-2 max-w-xs"
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Proje Oluştur
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProject;