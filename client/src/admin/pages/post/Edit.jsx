import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postService } from "../../services/postService";
import { categoryService } from "../../services/categoryService";
import { toast } from "react-hot-toast";
import PostForm from "../../components/forms/PostForm";

const EditPost = () => {
  const navigate = useNavigate();
  const { identifier } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    post_title: "",
    post_excerpt: "",
    post_content: "",
    post_category: "",
    post_tags: "",
    post_image: null,
    post_status: "draft"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, categoriesResponse] = await Promise.all([
          postService.getPostByIdentifier(identifier),
          categoryService.getAllCategories()
        ]);

        setCategories(categoriesResponse.data.categories);
        const post = postResponse.data.post;
        
        setFormData({
          post_title: post.title,
          post_excerpt: post.excerpt,
          post_content: post.content,
          post_category: post.category.id,
          post_tags: post.tags.join(", "),
          post_image: post.image,
          post_status: post.status
        });
      } catch (error) {
        toast.error("Yazı bilgileri yüklenirken bir hata oluştu");
        navigate("/admin/posts");
      }
    };

    fetchData();
  }, [identifier, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'post_image' && formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await postService.updatePost(identifier, formDataToSend);
      toast.success("Yazı başarıyla güncellendi");
      navigate("/admin/posts");
    } catch (error) {
      toast.error(error.response?.data?.message || "Yazı güncellenirken bir hata oluştu");
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
      handleCancel={() => navigate('/admin/posts')}
      isEdit={true}
    />
  );
};

export default EditPost;
