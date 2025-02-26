import ProtectedRoute from "../security/ProtectedRoute";
// Post
import AdminLayout from "../layout";
import AdminPosts from "../pages/post";
import NewPost from "../pages/post/New";
// Category
import AdminCategories from "../pages/category";
import NewCategory from "../pages/category/New";
import EditCategeory from "../pages/category/Edit";
// Project
import AdminProjects from "../pages/project";
import NewProject from "../pages/project/New";
// Users
import AdminUsers from "../pages/user";
// Ticket
import AdminTickets from "../pages/ticket";
import DetailTicket from "../pages/ticket/Detail";
// Activity Logs
import AdminActivityLogs from "../pages/logs";

export const adminRoutes = {
  path: "admin",
  element: (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
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
        { path: "edit/:slug", element: <EditCategeory /> },
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
    },
    {
      path: "tickets",
      children: [
        { index: true, element: <AdminTickets /> },
        { path: ":id", element: <DetailTicket /> },
      ],
    },
  ],
};

export default adminRoutes;
