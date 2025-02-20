import AdminLayout from "../layout";
import AdminPosts from "../pages/Posts";
import AdminCategories from "../pages/Categories";
import AdminProjects from "../pages/Projects";
import AdminActivityLogs from "../pages/ActivityLogs";

export const adminRoutes = {
  path: "admin",
  element: <AdminLayout />,
  children: [
    { path: "posts", element: <AdminPosts /> },
    { path: "categories", element: <AdminCategories /> },
    { path: "projects", element: <AdminProjects /> },
    { path: "activity-logs", element: <AdminActivityLogs /> },
  ],
};
