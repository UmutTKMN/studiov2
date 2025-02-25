import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import { categoryService } from "../../services/categoryService";
import { toast } from "react-hot-toast";
import PostForm from "../../components/forms/PostForm";

const NewPost = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    post_title: "",
    post_excerpt: "",
    post_content: "", // artık string olarak saklayacağız
    post_category: "",
    post_tags: "",
    post_image: null,
    post_status: "draft"
  });

  // Kategorileri getir
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response?.data?.categories) {
        setCategories(response.data.categories);
      } else {
        throw new Error("Kategori verisi bulunamadı");
      }
    } catch (error) {
      toast.error("Kategoriler yüklenirken bir hata oluştu");
      console.error("Kategori yükleme hatası:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      // Validation kontrolü
      if (!formData.post_title.trim()) {
        toast.error("Başlık alanı zorunludur");
        return;
      }

      if (!formData.post_category) {
        toast.error("Kategori seçimi zorunludur");
        return;
      }

      if (!formData.post_content.trim()) {
        toast.error("İçerik alanı zorunludur");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('post_title', formData.post_title);
      formDataToSend.append('post_category', formData.post_category);
      formDataToSend.append('post_excerpt', formData.post_excerpt);
      formDataToSend.append('post_content', formData.post_content); // direkt string olarak gönderiyoruz
      formDataToSend.append('post_status', formData.post_status);
      
      if (formData.post_tags) {
        const tags = formData.post_tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
          .join(',');
        formDataToSend.append('post_tags', tags);
      }

      if (formData.post_image instanceof File) {
        formDataToSend.append('post_image', formData.post_image);
      }

      await postService.createPost(formDataToSend);
      toast.success("Yazı başarıyla oluşturuldu");
      navigate("/admin/posts");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Yazı oluşturulurken bir hata oluştu";
      toast.error(errorMessage);
      console.error("Yazı oluşturma hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form alanları değişiklik yönetimi
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Resim yükleme yönetimi
  const handleImageChange = useCallback((e) => {
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

      setFormData(prev => ({ ...prev, post_image: file }));
      toast.success("Resim başarıyla yüklendi");
    }
  }, []);

  return (
    <PostForm
      formData={formData}
      categories={categories}
      isLoading={isLoading}
      handleChange={handleChange}
      handleImageChange={handleImageChange}
      handleSubmit={handleSubmit}
      handleCancel={() => {
        if (window.confirm('Yapmış olduğunuz değişiklikler kaybolacak. Emin misiniz?')) {
          navigate('/admin/posts');
        }
      }}
      isEdit={false}
    />
  );
};

export default NewPost;