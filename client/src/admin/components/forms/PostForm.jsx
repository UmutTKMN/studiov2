import React from 'react';
import Button from '../ui/Button';
import { ArrowLeft } from 'iconoir-react';

const PostForm = ({
  formData,
  categories,
  isLoading,
  handleChange,
  handleEditorChange,
  handleImageChange,
  handleSubmit,
  handleCancel,
  isEdit
}) => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="text"
                color="secondary"
                size="sm"
                icon={ArrowLeft}
                onClick={handleCancel}
              >
                Geri Dön
              </Button>
              <h1 className="text-2xl font-semibold">
                {isEdit ? 'Yazı Düzenle' : 'Yeni Yazı Oluştur'}
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Başlık */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Yazı Başlığı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="post_title"
                    value={formData.post_title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="post_category"
                    value={formData.post_category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Özet */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Özet <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="post_excerpt"
                  value={formData.post_excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              {/* İçerik - Editor yerine textarea kullanıyoruz */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İçerik <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="post_content"
                  value={formData.post_content}
                  onChange={handleChange}
                  rows={10}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              {/* Görsel ve Etiketler */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kapak Görseli
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {formData.post_image && (
                    <div className="mt-2">
                      <img
                        src={formData.post_image}
                        alt="Önizleme"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Etiketler
                  </label>
                  <input
                    type="text"
                    name="post_tags"
                    value={formData.post_tags}
                    onChange={handleChange}
                    placeholder="Etiketleri virgülle ayırın"
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Durum ve Eylemler */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  <select
                    name="post_status"
                    value={formData.post_status}
                    onChange={handleChange}
                    className="rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayınla</option>
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    color="primary"
                    loading={isLoading}
                  >
                    {isEdit ? 'Güncelle' : 'Oluştur'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;