import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import { categoryService } from "../../services/categoryService";
import { toast } from "react-hot-toast";
import PostForm from "./components/PostForm";

const NewPost = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  // Kategorileri getir
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllCategories();
      console.log("Kategori yanıtı:", response.data); // Yanıtı kontrol et

      if (response?.data?.categories) {
        setCategories(response.data.categories);
      } else if (Array.isArray(response?.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
        console.error(
          "Kategori verisi beklenen formatta değil:",
          response.data
        );
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
        setIsLoading(false);
        return;
      }

      if (!formData.post_category) {
        toast.error("Kategori seçimi zorunludur");
        setIsLoading(false);
        return;
      }

      if (!formData.post_content.trim()) {
        toast.error("İçerik alanı zorunludur");
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      // Tüm form verilerini formData'ya ekle
      Object.keys(formData).forEach((key) => {
        // Resim dosyası özel işlem gerektirir
        if (key === "post_image") {
          if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
          } else if (
            formData[key] &&
            typeof formData[key] === "string" &&
            formData[key].startsWith("data:image")
          ) {
            // Base64 string'i dosyaya çevir (eğer gerekliyse)
            fetch(formData[key])
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], "post_image.jpg", {
                  type: "image/jpeg",
                });
                formDataToSend.append("post_image", file);
              });
          }
        } else {
          // Diğer tüm alanları direkt ekle
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log(
        "Gönderilecek formData:",
        Object.fromEntries(formDataToSend.entries())
      );

      const response = await postService.createPost(formDataToSend);
      console.log("Yazı oluşturma yanıtı:", response);
      toast.success("Yazı başarıyla oluşturuldu");
      navigate("/admin/posts");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Yazı oluşturulurken bir hata oluştu";
      toast.error(errorMessage);
      console.error("Yazı oluşturma hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form alanları değişiklik yönetimi
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Rich text editor değişim işleyicisi
  const handleEditorChange = useCallback((content) => {
    setFormData((prev) => ({ ...prev, post_content: content }));
  }, []);

  // Resim yükleme yönetimi
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];

    if (file) {
      // Dosya tipi kontrolü
      if (!file.type.startsWith("image/")) {
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
          post_image: file, // Dosya olarak sakla
        }));
      };
      reader.readAsDataURL(file);
      toast.success("Resim başarıyla yüklendi");
    }
  }, []);

  return (
    <PostForm
      formData={formData}
      categories={categories}
      isLoading={isLoading}
      handleChange={handleChange}
      handleEditorChange={handleEditorChange} // Editor değişikliği için handler eklendi
      handleImageChange={handleImageChange}
      handleSubmit={handleSubmit}
      handleCancel={() => {
        if (
          window.confirm(
            "Yapmış olduğunuz değişiklikler kaybolacak. Emin misiniz?"
          )
        ) {
          navigate("/admin/posts");
        }
      }}
      isEdit={false}
    />
  );
};

export default NewPost;
