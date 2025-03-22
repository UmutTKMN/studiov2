import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../../services/userService";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { ArrowLeft, FloppyDisk, Trash } from "iconoir-react";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    role: "",
    city: "",
    country: "",
    isActive: true,
    profileImage: null,
  });

  const [roles, setRoles] = useState([
    { id: "1", name: "Admin" },
    { id: "2", name: "Kullanıcı" },
  ]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await userService.getUser(id);
        console.log("Kullanıcı detay yanıtı:", response.data);

        // API yanıtından kullanıcı verisini al
        const userData = response.data.user || response.data;

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          username: userData.username || "",
          phone: userData.phone || "",
          role: userData.role?.id || "",
          city: userData.location?.city || "",
          country: userData.location?.country || "",
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          profileImage: userData.profileImage || null,
        });

        setError(null);
      } catch (err) {
        setError("Kullanıcı bilgileri yüklenirken hata oluştu");
        console.error("Kullanıcı yükleme hatası:", err);
        toast.error("Kullanıcı bilgileri yüklenemedi");
      } finally {
        setIsLoading(false);
      }
    };

    // Rol listesi al
    const fetchRoles = async () => {
      try {
        const response = await userService.getRoles();
        if (response.data && Array.isArray(response.data)) {
          setRoles(response.data);
        }
      } catch (error) {
        console.error("Roller yüklenirken hata:", error);
      }
    };

    fetchUserDetails();
    fetchRoles();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Checkbox için kontrol
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Lütfen geçerli bir resim dosyası seçin");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Resim dosyası 5MB'dan büyük olamaz");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: file,
          profileImagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Ad ve e-posta alanları zorunludur");
      return;
    }

    setIsSaving(true);

    try {
      const formDataToSend = new FormData();

      // Form verilerini ekle
      Object.keys(formData).forEach((key) => {
        if (key === "profileImage" && formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (
          key !== "profileImagePreview" &&
          formData[key] !== undefined
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Konum verisini ayrıca ekle
      formDataToSend.append(
        "location",
        JSON.stringify({
          city: formData.city,
          country: formData.country,
        })
      );

      const response = await userService.updateUser(id, formDataToSend);
      console.log("Güncelleme yanıtı:", response);

      toast.success("Kullanıcı başarıyla güncellendi");
      navigate(`/admin/users/${id}`);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast.error("Kullanıcı güncellenirken hata oluştu");
      setError("Güncelleme işlemi başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Yükleme yapılıyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          {/* Üst Başlık */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="text"
                color="secondary"
                size="sm"
                icon={ArrowLeft}
                onClick={() => navigate(`/admin/users/${id}`)}
              >
                Geri Dön
              </Button>
              <h1 className="text-2xl font-semibold">Kullanıcıyı Düzenle</h1>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {/* Profil Resmi Bölümü */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium mb-4">Profil Resmi</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <img
                      src={
                        formData.profileImagePreview ||
                        formData.profileImage ||
                        "/default-avatar.png"
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow cursor-pointer border border-gray-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      JPG, GIF veya PNG formatında bir resim yükleyin. Maksimum
                      dosya boyutu 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kullanıcı Bilgileri */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium mb-4">
                  Kullanıcı Bilgileri
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Ad Soyad"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Kullanıcı Adı"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />

                  <Input
                    label="E-posta"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Telefon"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <Select
                    label="Rol"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={roles.map((role) => ({
                      value: role.id,
                      label: role.name,
                    }))}
                  />

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-gray-700"
                    >
                      Aktif Kullanıcı
                    </label>
                  </div>
                </div>
              </div>

              {/* Konum Bilgileri */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium mb-4">Konum Bilgileri</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Şehir"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />

                  <Input
                    label="Ülke"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Form Aksiyonları */}
              <div className="p-6 flex justify-between">
                <Button
                  variant="outlined"
                  color="danger"
                  icon={Trash}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Bu kullanıcıyı silmek istediğinizden emin misiniz?"
                      )
                    ) {
                      navigate(`/admin/users/${id}`);
                    }
                  }}
                >
                  Kullanıcıyı Sil
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(`/admin/users/${id}`)}
                  >
                    İptal
                  </Button>

                  <Button
                    type="submit"
                    variant="filled"
                    color="primary"
                    icon={FloppyDisk}
                    loading={isSaving}
                  >
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
