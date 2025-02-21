
const Projects = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Projeler</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Yeni Proje Ekle
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 p-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Proje {item}</h3>
                <div className="space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 px-2 py-1">Düzenle</button>
                  <button className="text-red-600 hover:text-red-700 px-2 py-1">Sil</button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">Bu örnek bir proje açıklamasıdır.</p>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Aktif</span>
                <span className="ml-4">Son güncelleme: 2 gün önce</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
