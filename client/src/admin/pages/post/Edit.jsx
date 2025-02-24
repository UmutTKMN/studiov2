import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postService } from "../../services/postService";
import { categoryService } from "../../services/categoryService";
import { toast } from "react-hot-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    post_title: "",
    post_excerpt: "",
    post_content: "",
    post_category: "",
    post_tags: "",
    post_image: "",
    post_status: "draft"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, categoriesData] = await Promise.all([
          postService.getPostBySlug(slug),
          categoryService.getAllCategories()
        ]);

        setCategories(categoriesData);
        setFormData({
          post_title: postData.post_title,
          post_excerpt: postData.post_excerpt,
          post_content: postData.post_content,
          post_category: postData.post_category,
          post_tags: postData.post_tags.join(", "),
          post_image: postData.post_image,
          post_status: postData.post_status
        });
      } catch (error) {
        toast.error("Yazı bilgileri yüklenirken bir hata oluştu");
        navigate("/admin/posts");
      }
    };

    fetchData();
  }, [slug, navigate]);

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
      post_content: content,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          post_image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postService.updatePost(slug, formData);
      toast.success("Yazı başarıyla güncellendi");
      navigate("/admin/posts");
    } catch (error) {
      toast.error(error.message || "Yazı güncellenirken bir hata oluştu");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Yazı Düzenle</h2>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Yazı Başlığı
          </label>
          <input
            type="text"
            name="post_title"
            value={formData.post_title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Özet
          </label>
          <textarea
            name="post_excerpt"
            value={formData.post_excerpt}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            İçerik
          </label>
          <ReactQuill
            value={formData.post_content}
            onChange={handleEditorChange}
            className="h-64 mb-10"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Kategori
          </label>
          <select
            name="post_category"
            value={formData.post_category}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Etiketler (virgülle ayırın)
          </label>
          <input
            type="text"
            name="post_tags"
            value={formData.post_tags}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Kapak Görseli
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formData.post_image && (
            <img
              src={formData.post_image}
              alt="Önizleme"
              className="mt-2 max-w-xs"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Durum
          </label>
          <select
            name="post_status"
            value={formData.post_status}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayınla</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Değişiklikleri Kaydet
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/posts")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
