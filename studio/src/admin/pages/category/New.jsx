import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FormLayout } from '../../components/forms/FormLayout';
import { InputField } from '../../components/forms/InputField';
import { TextArea } from '../../components/forms/TextArea';
import Button from '../../components/ui/Button';
import { categoryService } from '../../services/categoryService';

const NewCategory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    category_name: '',
    category_description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await categoryService.createCategory(formData);
      toast.success('Kategori başarıyla oluşturuldu');
      navigate('/admin/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
      toast.error('Kategori oluşturulamadı');
    } finally {
      setIsLoading(false);
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
        loading={isLoading}
        onClick={handleSubmit}
      >
        Kategori Oluştur
      </Button>
    </>
  );

  return (
    <FormLayout 
      title="Yeni Kategori" 
      subtitle="Sisteme yeni bir kategori ekleyin"
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
          placeholder="Örn: Teknoloji"
        />

        <TextArea
          label="Açıklama"
          name="category_description"
          value={formData.category_description}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            category_description: e.target.value
          }))}
          placeholder="Kategori hakkında kısa bir açıklama yazın..."
          rows={4}
        />
      </form>
    </FormLayout>
  );
};

export default NewCategory;
