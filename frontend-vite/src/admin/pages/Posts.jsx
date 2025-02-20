import React from 'react'
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import TableHeader from '../components/ui/TableHeader';
import TableFooter from '../components/ui/TableFooter';
import Table from '../components/ui/Table';

function Posts() {
  const headers = [
    { key: 'title', label: 'Başlık' },
    { key: 'category', label: 'Kategori' },
    { key: 'date', label: 'Tarih' },
    { key: 'status', label: 'Durum' },
    { key: 'actions', label: 'İşlemler', className: 'text-right' }
  ];

  const data = [
    {
      id: 1,
      title: 'İlk Blog Yazısı',
      category: 'Teknoloji',
      date: '2024-01-20',
      status: 'Yayında'
    },
  ];

  const actions = [
    {
      icon: <PencilIcon className="h-5 w-5 text-blue-500" />,
      onClick: (row) => console.log('Düzenle:', row)
    },
    {
      icon: <TrashIcon className="h-5 w-5 text-red-500" />,
      onClick: (row) => console.log('Sil:', row)
    }
  ];

  return (
    <div className="space-y-6">
      <TableHeader 
        title="Yazılar"
        subtitle="Tüm blog yazılarını yönetin"
        onAdd={() => console.log('Yeni yazı ekle')}
        onSearch={(value) => console.log('Arama:', value)}
      />
      
      <Table 
        headers={headers}
        data={data}
        actions={actions}
      />

      <TableFooter />
    </div>
  );
}

export default Posts;