import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout";
// Pages
import Home from "../pages/Home";

const mainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [{ index: true, element: <Home /> }],
};

export const router = createBrowserRouter([mainRoutes]);
