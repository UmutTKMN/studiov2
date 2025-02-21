import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { postService } from "../../services/api";

const statusOptions = [
  { value: "draft", label: "Taslak" },
  { value: "published", label: "Yayında" },
  { value: "archived", label: "Arşivlenmiş" }
];

function NewPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    post_title: "",
    post_slug: "",
    post_excerpt: "",
    post_content: "",
    post_category: null, // number olarak gönderilecek
    post_tags: "",
    post_image: null,
    post_status: "draft"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "post_title" && !formData.post_slug) {
      // Başlıktan otomatik slug oluştur
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: value,
        post_slug: slug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      post_status: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.post_title) newErrors.post_title = "Başlık zorunludur";
    if (!formData.post_content) newErrors.post_content = "İçerik zorunludur";
    if (!formData.post_slug) newErrors.post_slug = "URL zorunludur";
    
    // Kategori seçilmişse number'a çevir
    if (formData.post_category) {
      formData.post_category = parseInt(formData.post_category, 10);
      if (isNaN(formData.post_category)) {
        newErrors.post_category = "Geçerli bir kategori seçiniz";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // API'ye gönderilecek veriyi hazırla
      const postData = {
        ...formData,
        post_category: formData.post_category ? parseInt(formData.post_category) : null,
        // Etiketleri array'e çevir ve temizle
        post_tags: formData.post_tags
          ? formData.post_tags.split(',').map(tag => tag.trim()).filter(Boolean).join(',')
          : ""
      };

      const response = await postService.createPost(postData);
      
      if (response?.data) {
        navigate('/admin/posts');
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.response?.data?.message || err.message || "Yazı oluşturulurken bir hata oluştu"
      }));
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <Card className="w-full">
        <CardHeader color="blue-gray" className="h-16 flex items-center gap-4 px-4">
          <DocumentTextIcon className="w-6 h-6" />
          <Typography variant="h6" color="white">
            Yeni Yazı Oluştur
          </Typography>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <Input
            name="post_title"
            label="Başlık"
            value={formData.post_title}
            onChange={handleChange}
            error={errors.post_title}
          />

          <Input
            name="post_slug"
            label="URL"
            value={formData.post_slug}
            onChange={handleChange}
            error={errors.post_slug}
          />

          <Input
            name="post_excerpt"
            label="Özet"
            value={formData.post_excerpt}
            onChange={handleChange}
            error={errors.post_excerpt}
          />

          <Select
            name="post_status"
            label="Durum"
            value={formData.post_status}
            onChange={handleStatusChange}
            options={statusOptions}
            error={errors.post_status}
          />

          <Input
            name="post_tags"
            label="Etiketler"
            value={formData.post_tags}
            onChange={handleChange}
            error={errors.post_tags}
            placeholder="Etiketleri virgülle ayırın"
          />

          <Input
            type="number"
            name="post_category"
            label="Kategori ID"
            value={formData.post_category}
            onChange={handleChange}
            error={errors.post_category}
          />

          <div className="w-full">
            <Textarea
              name="post_content"
              label="İçerik"
              value={formData.post_content}
              onChange={handleChange}
              rows={6}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            {errors.post_content && (
              <p className="mt-1 text-xs text-red-500">{errors.post_content}</p>
            )}
          </div>

          <div className="w-full">
            <Input
              type="file"
              name="post_image"
              label="Görsel"
              onChange={e => setFormData(prev => ({
                ...prev,
                post_image: e.target.files[0]
              }))}
              error={errors.post_image}
              accept="image/*"
            />
          </div>

          {errors.submit && (
            <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
              {errors.submit}
            </div>
          )}
        </CardBody>

        <CardFooter className="flex justify-end gap-4">
          <Button
            variant="text"
            color="gray"
            onClick={() => navigate('/admin/posts')}
          >
            İptal
          </Button>
          <Button
            type="submit"
            variant="gradient"
            color="blue"
            loading={isSubmitting}
          >
            Kaydet
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default NewPost;
