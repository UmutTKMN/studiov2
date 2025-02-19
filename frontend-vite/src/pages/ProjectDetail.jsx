import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projectService } from "../services/api";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await projectService.getProjectBySlug(slug);
        console.log("API Response:", response.data);
        
        // API'den gelen veriyi düzenliyoruz
        const projectData = response.data.data;
        setProject({
          title: projectData.project_title,
          description: projectData.project_description,
          status: projectData.project_status,
          image: projectData.project_image,
          owner_name: projectData.owner_name,
          owner_image: projectData.owner_image,
          start_date: projectData.project_start_date,
          end_date: projectData.project_end_date,
          budget: projectData.project_budget,
          createdAt: projectData.project_createdAt,
          tags: projectData.project_tags
        });
        
        setError(null);
      } catch (err) {
        setError("Proje detayları yüklenirken bir hata oluştu.");
        console.error("Proje detay hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Hata</h3>
        <p>{error}</p>
        <Link to="/projects" className="text-blue-500 hover:underline mt-4 inline-block">
          Projelere Dön
        </Link>
      </div>
    </div>
  );

  if (!project) return (
    <div className="text-center">
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Proje Bulunamadı</h3>
        <p>Aradığınız proje mevcut değil veya kaldırılmış olabilir.</p>
        <Link to="/projects" className="text-blue-500 hover:underline mt-4 inline-block">
          Projelere Dön
        </Link>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Belirtilmemiş";
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Geçersiz Tarih";
    }
  };

  return (
    <div className="">
      <nav className="mb-6">
        <Link to="/projects" className="text-blue-500 hover:underline flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.707 4.293a1 1 0 010 1.414L7.414 9H15a1 1 0 110 2H7.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Projelere Dön
        </Link>
      </nav>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {project.image && (
          <div className="relative h-[400px]">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                project.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : project.status === "active"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {project.status}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            {project.owner_image ? (
              <img
                src={project.owner_image}
                alt={project.owner_name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-medium">
                  {project.owner_name?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Proje Sahibi</p>
              <p className="font-medium">{project.owner_name}</p>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Başlangıç Tarihi</h3>
              <p>{formatDate(project.start_date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Bitiş Tarihi</h3>
              <p>{project.end_date ? formatDate(project.end_date) : "Devam Ediyor"}</p>
            </div>
            {project.budget && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Bütçe</h3>
                <p>{Number(project.budget).toLocaleString('tr-TR')} ₺</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Oluşturulma Tarihi</h3>
              <p>{formatDate(project.createdAt)}</p>
            </div>
          </div>

          {project.tags && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
