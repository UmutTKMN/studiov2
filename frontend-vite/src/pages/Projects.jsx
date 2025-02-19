import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectService } from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await projectService.getAllProjects();
        if (response?.data?.projects) {
          setProjects(response.data.projects);
        } else {
          setProjects([]); // Beklenmedik API yanıtı durumunda temizleme
        }
        setError(null);
      } catch (err) {
        setError(
          `Error loading projects: ${err.message || "Please try again later."}`
        );
        console.error("Error fetching projects:", err);
        setProjects([]); // Hata durumunda projeleri temizle
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!projects.length)
    return <div className="text-center p-4">No projects found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.slug}`}
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="text-gray-600 mt-2 line-clamp-2">
              {project.description}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">By {project.owner}</div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
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
          </div>
        </Link>
      ))}
    </div>
  );
}
