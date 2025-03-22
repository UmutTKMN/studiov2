import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

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
