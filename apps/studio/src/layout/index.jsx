import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <section className="container mx-auto max-w-screen-lg px-4">
      <Navbar />
      <main className="py-12">
        <Outlet />
      </main>
      <Footer />
    </section>
  );
};

export default RootLayout;
