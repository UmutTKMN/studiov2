import AdminLayout from "../layout";
import AdminPosts from "../pages/post";
import NewPost from "../pages/post/New";
import AdminCategories from "../pages/Categories";
import AdminProjects from "../pages/Projects";
import AdminActivityLogs from "../pages/ActivityLogs";

export const adminRoutes = {
  path: "admin",
  element: <AdminLayout />,
  children: [
    { 
      path: "posts",
      children: [
        { index: true, element: <AdminPosts /> },
        { path: "new", element: <NewPost /> },
      ]
    },
    { path: "categories", element: <AdminCategories /> },
    { path: "projects", element: <AdminProjects /> },
    { path: "activity-logs", element: <AdminActivityLogs /> },
  ],
};

export default adminRoutes;
