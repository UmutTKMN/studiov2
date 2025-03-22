import React from "react";
import { ArrowLeft } from "iconoir-react";

const ProjectForm = ({
  formData,
  isLoading,
  handleChange,
  handleEditorChange,
  handleImageChange,
  handleSubmit,
  handleCancel,
  isEdit,
}) => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span>Geri Dön</span>
              </button>
              <h1 className="text-2xl font-semibold">
                {isEdit ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Proje Başlığı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="project_title"
                  value={formData.project_title || ""}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Proje Açıklaması
                </label>
                <textarea
                  value={formData.project_description || ""}
                  onChange={handleEditorChange}
                  className="h-64 mb-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Proje Sahibi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="project_owner"
                    value={formData.project_owner || ""}
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
                    value={formData.project_tags || ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    name="project_start_date"
                    value={formData.project_start_date || ""}
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
                    value={formData.project_end_date || ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Bütçe
                  </label>
                  <input
                    type="number"
                    name="project_budget"
                    value={formData.project_budget || ""}
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
                    value={formData.project_status || "pending"}
                    onChange={handleChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="pending">Beklemede</option>
                    <option value="active">Aktif</option>
                    <option value="in_progress">Devam Ediyor</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>
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
                  <div className="mt-2">
                    <img
                      src={formData.project_image}
                      alt="Önizleme"
                      className="max-h-40 rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.png";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      İşleniyor...
                    </span>
                  ) : isEdit ? (
                    "Değişiklikleri Kaydet"
                  ) : (
                    "Projeyi Oluştur"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
