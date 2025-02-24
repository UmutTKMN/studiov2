import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FormLayout } from '../../components/forms/FormLayout';
import { InputField } from '../../components/forms/InputField';
import { TextArea } from '../../components/forms/TextArea';
import Button from '../../components/ui/Button';
import { categoryService } from '../../services/categoryService';

const EditCategory = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    category_name: '',
    category_description: '',
  });

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const response = await categoryService.getCategoryBySlug(slug);
        setFormData({
          category_name: response.data.category.name,
          category_description: response.data.category.description || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Kategori yüklenemedi');
        toast.error('Kategori bilgileri yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await categoryService.updateCategory(slug, formData);
      toast.success('Kategori başarıyla güncellendi');
      navigate('/admin/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Güncelleme başarısız');
      toast.error('Kategori güncellenemedi');
    } finally {
      setIsSaving(false);
    }
  };

  const formActions = (
    <>
      <Button
        variant="outlined"
        color="danger"
        onClick={() => navigate(-1)}
      >
        İptal
      </Button>
      <Button
        type="submit"
        loading={isSaving}
        onClick={handleSubmit}
      >
        Değişiklikleri Kaydet
      </Button>
    </>
  );

  return (
    <FormLayout 
      title="Kategori Düzenle"
      subtitle={`"${formData.category_name}" kategorisini düzenliyorsunuz`}
      loading={isLoading}
      error={error}
      actions={formActions}
    >
      <form className="space-y-6">
        <InputField
          label="Kategori Adı"
          name="category_name"
          value={formData.category_name}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            category_name: e.target.value
          }))}
          required
        />

        <TextArea
          label="Açıklama"
          name="category_description"
          value={formData.category_description}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            category_description: e.target.value
          }))}
          rows={4}
        />
      </form>
    </FormLayout>
  );
};

export default EditCategory;
