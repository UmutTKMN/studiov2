import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FormLayout } from "../../components/forms/FormLayout";
import { InputField } from "../../components/forms/InputField";
import { TextArea } from "../../components/forms/TextArea";
import Button from "../../components/ui/Button";
import { categoryService } from "../../services/categoryService";

const EditCategory = () => {
  const navigate = useNavigate();
  const { identifier } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);

      try {
        const response = await categoryService.getCategory(identifier);

        let categoryData;

        if (response.data.category) {
          if (response.data.category === null) {
            throw new Error(`"${identifier}" ID'li kategori bulunamadı`);
          }
          categoryData = response.data.category;
        } else if (response.data.success === false) {
          throw new Error(response.data.message || "Kategori bulunamadı");
        } else {
          categoryData = response.data;
        }

        setFormData({
          name: categoryData.name || "",
          description: categoryData.description || "",
        });

        // Kategori başarıyla yüklendi
        setError(null);
      } catch (err) {
        console.error("Kategori yükleme hatası:", err);

        // Hatanın daha detaylı bilgilerini görelim
        if (err.response) {
          console.error("API hata yanıtı:", err.response.data);
          console.error("Durum kodu:", err.response.status);
        }

        const errorMessage =
          err.message || err.response?.data?.message || "Kategori yüklenemedi";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (identifier) {
      fetchCategory();
    } else {
      setError("Kategori tanımlayıcısı eksik");
      toast.error("Kategori tanımlayıcısı eksik");
    }
  }, [identifier]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basit form doğrulaması
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Kategori adı zorunludur");
      return;
    }

    setIsSaving(true);

    try {
      console.log("Gönderilen kategori verisi:", formData);
      await categoryService.updateCategory(identifier, formData);
      toast.success("Kategori başarıyla güncellendi");
      navigate("/admin/categories");
    } catch (err) {
      console.error("Kategori güncelleme hatası:", err);

      const errorMessage =
        err.response?.data?.message || "Güncelleme başarısız";
      setError(errorMessage);
      toast.error("Kategori güncellenemedi: " + errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const formActions = (
    <>
      <Button
        variant="outlined"
        color="danger"
        onClick={() => navigate("/admin/categories")}
      >
        İptal
      </Button>
      <Button type="submit" loading={isSaving} onClick={handleSubmit}>
        Değişiklikleri Kaydet
      </Button>
    </>
  );

  return (
    <FormLayout
      title="Kategori Düzenle"
      subtitle={
        isLoading
          ? "Kategori yükleniyor..."
          : formData.name
          ? `"${formData.name}" kategorisini düzenliyorsunuz`
          : "Kategori düzenleniyor"
      }
      loading={isLoading}
      error={error}
      actions={formActions}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          label="Kategori Adı"
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          required
        />

        <TextArea
          label="Açıklama"
          name="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          rows={4}
        />
      </form>
    </FormLayout>
  );
};

export default EditCategory;
