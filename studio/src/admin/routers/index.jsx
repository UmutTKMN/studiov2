import ProtectedRoute from "../security/ProtectedRoute";
// Post
import AdminLayout from "../layout";
import AdminPosts from "../pages/post";
import NewPost from "../pages/post/New";
import EditPost from "../pages/post/Edit";
import PostDetail from "../pages/post/Detail";
// Category
import AdminCategories from "../pages/category";
import NewCategory from "../pages/category/New";
import EditCategeory from "../pages/category/Edit";
// Project
import AdminProjects from "../pages/project";
import NewProject from "../pages/project/New";
import EditProject from "../pages/project/Edit";
import ProjectDetail from "../pages/project/Detail";
// Users
import AdminUsers from "../pages/user";
import EditUser from "../pages/user/Edit";
import DetailUser from "../pages/user/Detail";
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
        { path: "edit/:identifier", element: <EditPost /> },
        { path: ":identifier", element: <PostDetail /> },
      ],
    },
    {
      path: "categories",
      children: [
        { index: true, element: <AdminCategories /> },
        { path: "new", element: <NewCategory /> },
        { path: "edit/:identifier", element: <EditCategeory /> },
      ],
    },
    {
      path: "projects",
      children: [
        { index: true, element: <AdminProjects /> },
        { path: "new", element: <NewProject /> },
        { path: "edit/:identifier", element: <EditProject /> },
        { path: ":identifier", element: <ProjectDetail /> },
        
      ],
    },
    {
      path: "activity-logs",
      children: [{ index: true, element: <AdminActivityLogs /> }],
    },
    {
      path: "users",
      children: [
        { index: true, element: <AdminUsers /> },
        { path: ":id", element: <DetailUser /> },
        { path: ":id/edit", element: <EditUser /> },
      ],
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
