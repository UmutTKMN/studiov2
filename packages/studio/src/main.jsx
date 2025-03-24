import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "./routers/index";
import "./styles/index.css";
import TRPCProvider from "./providers/TRPCProvider";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <TRPCProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </TRPCProvider>
  </ErrorBoundary>
);
