import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash,
  User,
  ChatBubble,
  Send,
  Bell,
  Edit,
  Clock,
  UserStar,
  Calendar,
  Mail,
  CheckCircle,
  InfoCircle,
  Building
} from "iconoir-react";
import { ticketService } from "../../services/ticketService";
import Button from "../../components/ui/Button";
import { formatDistance } from "date-fns";
import { tr } from "date-fns/locale";

function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  // Admin kullanıcıları için state
  const [adminUsers, setAdminUsers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [assigning, setAssigning] = useState(false);

  const priorityLabels = {
    low: { text: "Düşük", class: "bg-blue-50 text-blue-600", color: "#3b82f6" },
    medium: { text: "Orta", class: "bg-yellow-50 text-yellow-600", color: "#eab308" },
    high: { text: "Yüksek", class: "bg-red-50 text-red-600", color: "#ef4444" },
    urgent: { text: "Acil", class: "bg-red-100 text-red-700 font-bold", color: "#b91c1c" },
  };

  const statusLabels = {
    open: { 
      text: "Açık", 
      class: "bg-green-500 text-white", 
      icon: Bell, 
      color: "#22c55e" 
    },
    pending: {
      text: "Beklemede",
      class: "bg-yellow-500 text-white",
      icon: Clock,
      color: "#eab308"
    },
    closed: { 
      text: "Kapalı", 
      class: "bg-gray-700 text-white", 
      icon: CheckCircle, 
      color: "#374151"
    },
  };

  useEffect(() => {
    fetchTicket();
    fetchCategories();
    fetchAdminUsers();
  }, [id]);

  // Sayfa animasyonu için useEffect
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Ticket detaylarını ve mesajlarını getiren fonksiyon
  const fetchTicket = async () => {
    setIsLoading(true);
    try {
      const response = await ticketService.getTicketDetails(id);

      if (response.data && response.data.success) {
        setTicket(response.data.ticket);
        
        // Ticket mesajlarını ayrıca getir
        const messagesResponse = await ticketService.getMessages(id);
        if (messagesResponse.data && messagesResponse.data.success) {
          setMessages(messagesResponse.data.messages || []);
        }
        
        setError(null);
      } else {
        throw new Error("Ticket verisi alınamadı");
      }
    } catch (err) {
      console.error("Ticket yükleme hatası:", err);
      if (err.response?.status === 404) {
        setError("Ticket bulunamadı");
      } else if (err.response?.status === 403) {
        setError("Bu ticketı görüntüleme yetkiniz yok");
      } else {
        setError(`Ticket yüklenirken bir hata oluştu: ${err.message || "Bilinmeyen hata"}`);
      }
      setTicket(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ticketService.getCategories();
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
    }
  };

  // Admin rolüne sahip kullanıcıları getiren fonksiyon
  const fetchAdminUsers = async () => {
    try {
      const response = await ticketService.getAdminUsers();
      if (response.data.success) {
        // Backend yanıtına göre doğru veri yapısını kullan
        setAdminUsers(response.data.adminUsers || response.data.users || []);
      }
    } catch (error) {
      console.error("Admin kullanıcılar yüklenirken hata:", error);
    }
  };

  // Ticket atama işlemi
  const handleAssignTicket = async () => {
    if (!selectedStaff) return;
    
    setAssigning(true);
    try {
      await ticketService.assignTicket(id, {user_id: selectedStaff});
      fetchTicket(); // Ticket verisini yenile
      setSelectedStaff("");
    } catch (error) {
      console.error("Atama hatası:", error);
    } finally {
      setAssigning(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/tickets");
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu ticket'ı silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      await ticketService.deleteTicket(id);
      navigate("/admin/tickets");
    } catch (error) {
      console.error("Ticket silme hatası:", error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await ticketService.updateTicketStatus(id, newStatus);
      fetchTicket();
    } catch (error) {
      console.error("Durum güncelleme hatası:", error);
    }
  };

  // Mesaj gönderme işlevi
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await ticketService.addMessage(id, { message: newMessage.trim() });
      if (response.data && response.data.success) {
        setMessages(response.data.messages || []);
        setNewMessage("");
        
        // Ticket kapalıysa ve mesaj gönderilirse, yeni durumu almak için ticket'ı yenileyelim
        if (ticket.status === "closed") {
          fetchTicket();
        }
      }
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);
      alert("Mesaj gönderilemedi. Lütfen tekrar deneyiniz.");
    } finally {
      setSending(false);
    }
  };

  // Mesajı okundu olarak işaretleme
  const markMessageAsRead = async (messageId) => {
    try {
      await ticketService.markMessageAsRead(messageId);
      
      // Mesajı okundu olarak işaretle (state'de güncelleme)
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.message_id === messageId 
            ? { ...msg, is_read: true } 
            : msg
        )
      );
    } catch (error) {
      console.error("Mesaj okundu işaretleme hatası:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 mb-4 animate-bounce duration-700"></div>
          <div className="h-2.5 bg-gray-100 rounded-full w-48 mb-4"></div>
          <div className="h-2 bg-gray-100 rounded-full w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 text-center bg-white rounded-2xl shadow-lg border border-gray-100 transition-all transform hover:shadow-xl">
        <div className="mb-6 text-red-400">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {error || "Ticket bulunamadı"}
        </h2>
        <p className="text-gray-500 mb-6">Lütfen daha sonra tekrar deneyiniz veya yöneticinizle iletişime geçiniz.</p>
        <Button 
          variant="gradient"
          color="primary" 
          className="mt-4 px-6 py-2.5 rounded-lg transition-all duration-300"
          onClick={handleBack}
        >
          Ticket Listesine Dön
        </Button>
      </div>
    );
  }

  const category = ticket.category_name || "Genel";
  const categoryDesc = ticket.category_description || "";
  const StatusIcon = statusLabels[ticket.status]?.icon || Bell;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 bg-gray-50">
      <button 
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
      </button>
      
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Ana İçerik */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800 flex items-center flex-wrap gap-2">
            #{ticket.ticket_id} - {ticket.title}
            <span className={`${statusLabels[ticket.status]?.class} px-2 py-0.5 text-xs rounded`}>
              {statusLabels[ticket.status]?.text}
            </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded">
              {category}
            </span>
          </h1>
          
          {ticket.status === "closed" && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-3 mt-3 text-sm">
              Bu destek talebi kapalı. Yanıt göndererek tekrar açabilirsiniz.
            </div>
          )}
          
          <div className="space-y-4 mt-4">
            {/* Ticket açıklaması */}
            <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{ticket.creator_name}</p>
                  <p className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleString("tr-TR")}</p>
                </div>
              </div>
              <div className="text-gray-700 text-sm whitespace-pre-wrap">
                {ticket.description}
              </div>
              {categoryDesc && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <p className="font-medium text-gray-700 mb-1">Kategori Bilgisi:</p>
                  {categoryDesc}
                </div>
              )}
            </div>
            
            {/* Mesajlar */}
            {messages.length > 0 ? messages.map((message, index) => (
              <div 
                key={message.message_id}
                className={`bg-white shadow-sm rounded-lg p-4 border ${message.is_admin ? 'border-blue-100' : 'border-gray-100'}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.is_admin ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {message.is_admin ? 
                      <UserStar className="w-4 h-4 text-blue-600" /> : 
                      <User className="w-4 h-4 text-gray-600" />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{message.sender_name}</p>
                      {message.is_admin && 
                        <span className="bg-blue-500 text-white px-1.5 py-0.5 text-xs rounded">Destek</span>
                      }
                    </div>
                    <p className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString("tr-TR")}</p>
                  </div>
                </div>
                <div className="text-gray-700 text-sm whitespace-pre-wrap">
                  {message.message}
                </div>
                {(index === messages.length - 1 && message.is_admin) && (
                  <p className="text-gray-700 text-sm mt-3 font-medium">
                    Saygılarımızla, {category || "Destek Ekibi"}
                  </p>
                )}
              </div>
            )) : (
              <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100 text-center text-sm text-gray-500">
                Henüz yanıt yok
              </div>
            )}

            {/* Yanıt Formu */}
            {(replyOpen || ticket.status !== "closed") && (
              <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
                <form onSubmit={handleSendMessage}>
                  <textarea
                    rows="3"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 resize-none text-sm mb-3"
                    placeholder="Yanıtınızı buraya yazın..."
                  ></textarea>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="gradient"
                      color="primary"
                      icon={Send}
                      className="px-4 py-2 rounded-lg text-sm"
                      disabled={!newMessage.trim() || sending}
                    >
                      {sending ? "Gönderiliyor..." : "Yanıt Gönder"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        
        {/* Yan Panel */}
        <div className="w-full lg:w-72">
          {/* Ticket Bilgileri */}
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Talep Bilgileri</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori:</span>
                <span className="font-medium">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Oluşturulma:</span>
                <span className="font-medium">{new Date(ticket.created_at).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Son Güncelleme:</span>
                <span className="font-medium">
                  {formatDistance(new Date(ticket.updated_at), new Date(), { addSuffix: true, locale: tr })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Öncelik:</span>
                <span className="font-medium">{priorityLabels[ticket.priority]?.text}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">E-posta:</span>
                <span className="font-medium text-xs truncate">{ticket.creator_email}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 mt-3 pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Talep Eden</p>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-2">
                  {ticket.creator_name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium text-sm">{ticket.creator_name}</p>
                  <p className="text-xs text-gray-500">ID: {ticket.user_id}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 mt-3 pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Destek Ekibi</p>
              {ticket.assigned_to ? (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-2">
                    {ticket.assigned_name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{ticket.assigned_name}</p>
                    <p className="text-xs text-gray-500">Destek Görevlisi</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Henüz atanmış destek görevlisi yok
                </div>
              )}
              
              {/* Admin kullanıcı atama kısmı */}
              <div className="mt-2 pt-2">
                <div className="flex gap-2 mt-2">
                  <select
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="">Görevli Seç</option>
                    {adminUsers.map(admin => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="py-1 px-2 rounded-lg text-xs"
                    disabled={!selectedStaff || assigning}
                    onClick={handleAssignTicket}
                  >
                    Ata
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              {ticket.status === "closed" ? (
                <Button
                  variant="gradient"
                  color="success"
                  className="py-1.5 rounded-lg justify-center text-sm"
                  icon={Bell}
                  onClick={() => handleStatusChange("open")}
                >
                  Aç
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  color="danger"
                  className="py-1.5 rounded-lg justify-center text-sm"
                  icon={CheckCircle}
                  onClick={() => handleStatusChange("closed")}
                >
                  Kapat
                </Button>
              )}
              
              <Button
                variant="outlined"
                color="danger"
                className="py-1.5 rounded-lg justify-center text-sm"
                icon={Trash}
                onClick={handleDelete}
              >
                Sil
              </Button>
            </div>
          </div>
          
          {/* Durum Değiştir */}
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Durum Değiştir</label>
            <div className="flex">
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="open">Açık</option>
                <option value="pending">Beklemede</option>
                <option value="closed">Kapalı</option>
              </select>
            </div>
          </div>
          
          {/* Zaman Çizelgesi */}
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100 mt-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Zaman Çizelgesi</h2>
            
            <div className="space-y-3 pl-5 relative before:content-[''] before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-0.5 before:bg-gray-100 text-sm">
              <div className="relative">
                <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-5 mt-1"></div>
                <div>
                  <p className="font-medium text-gray-800">Ticket oluşturuldu</p>
                  <p className="text-xs text-gray-500">
                    {new Date(ticket.created_at).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
              
              {ticket.status !== "open" && (
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-yellow-500 rounded-full -left-5 mt-1"></div>
                  <div>
                    <p className="font-medium text-gray-800">Durum değiştirildi</p>
                    <p className="text-xs text-gray-500">
                      {new Date(ticket.updated_at).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
              )}
              
              {ticket.assigned_to && (
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-5 mt-1"></div>
                  <div>
                    <p className="font-medium text-gray-800">Görevli atandı</p>
                    <p className="text-xs text-gray-500">
                      {ticket.assigned_name}
                    </p>
                  </div>
                </div>
              )}
              
              {messages.length > 0 && (
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-5 mt-1"></div>
                  <div>
                    <p className="font-medium text-gray-800">Son yanıt</p>
                    <p className="text-xs text-gray-500">
                      {new Date(messages[messages.length - 1]?.created_at).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
