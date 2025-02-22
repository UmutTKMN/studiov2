// Post
import AdminLayout from "../layout";
import AdminPosts from "../pages/post";
import NewPost from "../pages/post/New";
// Category
import AdminCategories from "../pages/category";
import NewCategory from "../pages/category/New";
// Project
import AdminProjects from "../pages/project";
import NewProject from "../pages/project/New";
// Users
import AdminUsers from "../pages/user";
// Activity Logs
import AdminActivityLogs from "../pages/logs";

export const adminRoutes = {
  path: "admin",
  element: <AdminLayout />,
  children: [
    {
      path: "posts",
      children: [
        { index: true, element: <AdminPosts /> },
        { path: "new", element: <NewPost /> },
      ],
    },
    {
      path: "categories",
      children: [
        { index: true, element: <AdminCategories /> },
        { path: "new", element: <NewCategory /> },
      ],
    },
    {
      path: "projects",
      children: [
        { index: true, element: <AdminProjects /> },
        { path: "new", element: <NewProject /> },
      ],
    },
    {
      path: "activity-logs",
      children: [{ index: true, element: <AdminActivityLogs /> }],
    },
    {
      path: "users", 
      children: [{ index: true, element: <AdminUsers /> }],
    }
  ],
};

export default adminRoutes;
