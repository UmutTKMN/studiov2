import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Posts from "../pages/Posts";
import PostDetail from "../pages/PostDetail";
import Categories from "../pages/Categories";
import CategoryDetail from "../pages/CategoryDetail";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts", element: <Posts /> },
      { path: "posts/:slug", element : <PostDetail /> },
      { path: "categories", element: <Categories /> },
      { path: "categories/:slug", element: <CategoryDetail /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:slug", element: <ProjectDetail /> },
    ], 
  },
]);