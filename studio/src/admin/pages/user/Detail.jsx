import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../../services/userService";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Calendar,
  Phone,
  ArrowLeft,
  MapPin,
  Key,
  Clock,
  KeyPlus,
  EditPencil,
  Trash,
  Bell,
  ShieldCheck,
} from "iconoir-react";
import Button from "../../components/ui/Button";
import { formatDate } from "../../utils/dateUtils";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await userService.getUser(id);
        // API'den gelen verileri uygun formatta dönüştür
        let userData = {};
        const rawData = response.data.user || response.data;
        // API yanıtındaki "user_" önekli alanları düzenle
        Object.keys(rawData).forEach((key) => {
          const newKey = key.startsWith("user_")
            ? key.replace("user_", "")
            : key;
          userData[newKey] = rawData[key];
        });
        // Rol bilgisini bileşenin beklediği formata dönüş
        if (userData.role !== undefined) {
          userData.role = {
            id: userData.role,
            name:
              userData.role === 1
                ? "Admin"
                : userData.role === 2
                ? "Editör"
                : "Kullanıcı",
          };
        }
        //varsayılan değerler
        userData.isEmailVerified = userData.isVerified || false;
        userData.notificationsEnabled =
          userData.emailNotifications || userData.pushNotifications || false;
        userData.lastPasswordChange = null;

        setUser(userData);
        setError(null);
      } catch (err) {
        setError("Kullanıcı detayları yüklenirken bir hata oluştu");
        console.error("Kullanıcı detay hatası:", err);
        toast.error("Kullanıcı detayları yüklenemedi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      setIsLoading(true);
      try {
        await userService.deleteUser(id);
        toast.success("Kullanıcı başarıyla silindi");
        navigate("/admin/users");
      } catch (error) {
        console.error("Silme hatası:", error);
        toast.error("Kullanıcı silinirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Yükleme yapılıyor...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-semibold text-red-700">Hata</h2>
        <p className="text-red-600">{error || "Kullanıcı bulunamadı"}</p>
        <Button
          variant="text"
          color="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate("/admin/users")}
          className="mt-4"
        >
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto">
          {/* Üst Başlık ve Butonlar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="text"
                color="secondary"
                size="sm"
                icon={ArrowLeft}
                onClick={() => navigate("/admin/users")}
              >
                Geri Dön
              </Button>

              <div className="flex items-center">
                <h1 className="text-2xl font-semibold">
                  {user.name || "İsimsiz Kullanıcı"}
                </h1>
                {user.role && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      user.role.id === 1
                        ? "bg-purple-100 text-purple-800"
                        : user.role.id === 2
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role.name || "Kullanıcı"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                color="primary"
                size="sm"
                icon={EditPencil}
                onClick={handleEdit}
              >
                Düzenle
              </Button>
              <Button
                variant="outlined"
                color="danger"
                size="sm"
                icon={Trash}
                onClick={handleDelete}
              >
                Sil
              </Button>
            </div>
          </div>

          {/* İçerik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sol Kolon - Profil Bilgileri */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow overflow-hidden">
                {/* Profil Resmi */}
                <div className="p-6 flex flex-col items-center">
                  <img
                    src={user.profileImage || "/default-avatar.png"}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-1" />
                      {user.phone}
                    </p>
                  )}
                  {user.bio && (
                    <p className="text-gray-600 text-center mt-3 text-sm">
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* İletişim Butonları */}
                <div className="border-t border-gray-200 p-4 flex items-center justify-center gap-3">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="sm"
                    icon={Mail}
                    onClick={() =>
                      (window.location.href = `mailto:${user.email}`)
                    }
                  >
                    E-posta Gönder
                  </Button>
                </div>
                <div className="border-t border-gray-200 p-4 flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.university || "-"}</p>
                    <p className="font-medium">{user.department || "-"} </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Kolon - Detay Bilgileri */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow overflow-hidden">
                {/* Genel Bilgiler */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b border-gray-100 pb-2">
                      <p className="text-sm text-gray-500">Kullanıcı Kimliği</p>
                      <p className="font-medium">{user.id}</p>
                    </div>

                    <div className="border-b border-gray-100 pb-2">
                      <p className="text-sm text-gray-500">Kullanıcı Adı</p>
                      <p className="font-medium">{user.name || "-"}</p>
                    </div>

                    <div className="border-b border-gray-100 pb-2">
                      <p className="text-sm text-gray-500">Kayıt Tarihi</p>
                      <p className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(user.createdAt)}
                      </p>
                    </div>

                    <div className="border-b border-gray-100 pb-2">
                      <p className="text-sm text-gray-500">Son Giriş</p>
                      <p className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(user.last_login) || "Giriş yapılmadı"}
                      </p>
                    </div>

                    <div className="border-b border-gray-100 pb-2 col-span-2">
                      <p className="text-sm text-gray-500">Konum</p>
                      <p className="font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {user.city || "Bilinmiyor"},{" "}
                        {user.country || "Bilinmiyor"}
                      </p>
                    </div>
                  </div>

                  {/* Hesap Durum Bilgileri */}
                  <h3 className="text-lg font-semibold mb-4 mt-8 flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    Hesap Durumu
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b border-gray-100 pb-2">
                      <p className="text-sm text-gray-500">Hesap Durumu</p>
                      <p className="font-medium">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </p>
                    </div>

                    <div className="border-b border-gray-100 pb-2">
                      <p className="text-sm text-gray-500">E-posta Doğrulama</p>
                      <p className="font-medium">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.isEmailVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {user.isEmailVerified
                            ? "Doğrulanmış"
                            : "Doğrulanmamış"}
                        </span>
                      </p>
                    </div>

                    <div className="border-b border-gray-100 pb-2">
                      <p className="text-sm text-gray-500">
                        Son Şifre Değişikliği
                      </p>
                      <p className="font-medium flex items-center">
                        <KeyPlus className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(user.lastPasswordChange) || "Bilinmiyor"}
                      </p>
                    </div>
                  </div>

                  {/* İzinler */}
                  <h3 className="text-lg font-semibold mb-4 mt-8 flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    İzinler ve Tercihler
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b border-gray-100 pb-2">
                      <p className="text-sm text-gray-500">Bildirimler</p>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.notificationsEnabled
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.notificationsEnabled ? "Açık" : "Kapalı"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
