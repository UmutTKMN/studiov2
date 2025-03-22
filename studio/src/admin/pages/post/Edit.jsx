import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postService } from "../../services/postService";
import { categoryService } from "../../services/categoryService";
import { toast } from "react-hot-toast";
import PostForm from "./components/PostForm";

const EditPost = () => {
  const navigate = useNavigate();
  const { identifier } = useParams();
  const [isLoading, setIsLoading] = useState(true); // Başlangıçta yükleniyor durumunda
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    post_title: "",
    post_excerpt: "",
    post_content: "",
    post_category: "",
    post_tags: "",
    post_image: null,
    post_status: "draft",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [postResponse, categoriesResponse] = await Promise.all([
          postService.getPost(identifier),
          categoryService.getAllCategories(),
        ]);

        if (categoriesResponse?.data?.categories) {
          setCategories(categoriesResponse.data.categories);
        } else if (Array.isArray(categoriesResponse?.data)) {
          setCategories(categoriesResponse.data);
        } else {
          setCategories([]);
          console.error(
            "Kategori verisi beklenen formatta değil:",
            categoriesResponse
          );
        }

        // API yanıtına göre post nesne yapısını kontrol edin
        const post = postResponse.data.post || postResponse.data;

        // API'den gelen alan adlarına göre formData'yı güncelle
        setFormData({
          post_title: post.post_title || "",
          post_excerpt: post.post_excerpt || "",
          post_content: post.post_content || "",
          post_category: post.post_category || "", // Doğrudan ID geliyor
          post_tags: typeof post.post_tags === "string" ? post.post_tags : "", // Zaten string olarak geliyor
          post_image: post.post_image || null,
          post_status: post.post_status || "draft",
        });
      } catch (error) {
        console.error("Post yüklenirken hata:", error);
        toast.error("Yazı bilgileri yüklenirken bir hata oluştu");
        navigate("/admin/posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [identifier, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "post_image" && formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await postService.updatePost(identifier, formDataToSend);
      toast.success("Yazı başarıyla güncellendi");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast.error(
        error.response?.data?.message || "Yazı güncellenirken bir hata oluştu"
      );
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <PostForm
      formData={formData}
      categories={categories}
      isLoading={isLoading}
      handleChange={handleChange}
      handleEditorChange={handleEditorChange}
      handleImageChange={handleImageChange}
      handleSubmit={handleSubmit}
      handleCancel={() => navigate("/admin/posts")}
      isEdit={true}
    />
  );
};

export default EditPost;
