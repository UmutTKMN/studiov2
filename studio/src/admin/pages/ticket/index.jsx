import React, { useState, useEffect } from "react";
import { Trash, Eye, Plus, Movie } from "iconoir-react";
import Header from "../../components/table/Header";
import Footer from "../../components/table/Footer";
import Table from "../../components/table";
import { ticketService } from "../../services/ticketService";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

function TicketSystem() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
    fetchCategories();
  }, [currentPage]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await ticketService.getAllTickets();

      if (response.data && response.data.success) {
        const tickets = response.data.tickets || [];
        setData(tickets);
      } else {
        setData([]);
      }
      setError(null);
    } catch (err) {
      console.error("Ticket fetch error:", err); // Hata detayını göster
      setError(
        `Ticketlar yüklenirken hata: ${err.message || "Lütfen tekrar deneyin."}`
      );
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ticketService.getCategories();
      if (response.data.success && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
      setCategories([]);
    }
  };

  const headers = [
    {
      key: "ticket_id",
      label: "ID",
      className: "w-20",
    },
    {
      key: "title",
      label: "Konu",
    },
    {
      key: "category",
      label: "Kategori",
      className: "w-32",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {categories.find(c => c.category_id === value)?.name || value}
        </span>
      ),
    },
    {
      key: "status",
      label: "Durum",
      className: "w-28",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === "open" ? "bg-green-100 text-green-800" :
          value === "closed" ? "bg-red-100 text-red-800" :
          "bg-yellow-100 text-yellow-800"}`}
        >
          {value === "open" ? "Açık" :
           value === "closed" ? "Kapalı" :
           value === "pending" ? "Beklemede" : value}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Tarih",
      className: "w-32",
      render: (value) => new Date(value).toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    },
    {
      key: "actions",
      label: "İşlemler",
      className: "w-28 text-right",
      render: (_, row) => (
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="text"
            color="primary"
            icon={Eye}
            onClick={() => handleView(row)}
            title="Görüntüle"
          />
          <Button
            variant="text"
            color="danger"
            icon={Trash}
            onClick={() => handleDelete(row.ticket_id)}
            title="Sil"
          />
        </div>
      ),
    },
  ];

  const handleView = (ticket) => {
    navigate(`/admin/tickets/${ticket.ticket_id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ticket\'ı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await ticketService.deleteTicket(id);
      fetchTickets();
    } catch (error) {
      console.error("Ticket silme hatası:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title="Destek Talepleri"
        icon={Movie}
        buttonProps={{
          icon: Plus,
          children: "Yeni Ticket",
          onClick: () => navigate("/tickets/new")
        }}
      />

      <div className="w-full">
        {error ? (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <Table
            headers={headers}
            data={data}
            isLoading={isLoading}
            className="mt-4"
            emptyText="Henüz hiç ticket oluşturulmamış"
          />
        )}

        <Footer
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default TicketSystem;
